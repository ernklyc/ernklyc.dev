import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/app_config.dart';
import '../models/tmdb_search_item.dart';

class ImportMatch {
  const ImportMatch(this.imdbId, this.media);
  final String imdbId;
  final TmdbSearchItem? media;
}

class MovieApiService {
  static const _detailCacheTtl = Duration(hours: 12);
  static const _episodeCacheTtl = Duration(hours: 6);
  static const _ratingsCacheTtl = Duration(hours: 24);
  static const _searchCacheTtl = Duration(minutes: 15);
  static const _ratingsBatchSize = 100;
  static const _guideCacheTtl = Duration(hours: 24);
  static const _translationCacheTtl = Duration(days: 30);

  Future<Map<String, dynamic>> details(int tmdbId, String mediaType) async {
    final key = 'movie_detail_${mediaType}_$tmdbId';
    return _cachedJsonMap(
      key: key,
      ttl: _detailCacheTtl,
      fetcher: () async {
        final response = await http.get(
          Uri.parse('${AppConfig.apiBaseUrl}/api/movies/$mediaType/$tmdbId'),
        );
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (response.statusCode != 200) {
          throw Exception(body['error'] ?? 'Detaylar alınamadı.');
        }
        return body;
      },
    );
  }

  Future<List<Map<String, dynamic>>> episodes(int tmdbId) async {
    final body = await _cachedJsonMap(
      key: 'movie_episodes_$tmdbId',
      ttl: _episodeCacheTtl,
      fetcher: () async {
        final response = await http
            .get(
              Uri.parse(
                '${AppConfig.apiBaseUrl}/api/movies/tv/$tmdbId/episodes',
              ),
              headers: await _optionalAuthHeaders(),
            )
            .timeout(
              const Duration(seconds: 90),
              onTimeout: () => throw Exception(
                'Bölüm puanları zamanında gelmedi. Tekrar dene.',
              ),
            );
        Map<String, dynamic> body;
        try {
          body = jsonDecode(response.body) as Map<String, dynamic>;
        } catch (_) {
          throw Exception('Bölüm puanları alınamadı (${response.statusCode}).');
        }
        if (response.statusCode != 200) {
          throw Exception(body['error'] ?? 'Bölüm puanları alınamadı.');
        }
        return body;
      },
    );
    return List<Map<String, dynamic>>.from(
      body['episodes'] as List? ?? const [],
    );
  }

  /// DoesTheDogDie topluluk oylarından ebeveyn rehberi (sunucu işler, anahtar sunucuda kalır).
  Future<Map<String, dynamic>> parentsGuide(int tmdbId, String mediaType) {
    return _cachedJsonMap(
      key: 'movie_parents_guide_${mediaType}_$tmdbId',
      ttl: _guideCacheTtl,
      fetcher: () async {
        final response = await http
            .get(
              Uri.parse(
                '${AppConfig.apiBaseUrl}/api/movies/parents-guide/$mediaType/$tmdbId',
              ),
              headers: await _optionalAuthHeaders(),
            )
            .timeout(
              const Duration(seconds: 60),
              onTimeout: () => throw Exception(
                'Ebeveyn rehberi zamanında gelmedi. Tekrar dene.',
              ),
            );
        Map<String, dynamic> body;
        try {
          body = jsonDecode(response.body) as Map<String, dynamic>;
        } catch (_) {
          throw Exception(
            'Ebeveyn rehberi alınamadı (${response.statusCode}).',
          );
        }
        if (response.statusCode != 200) {
          throw Exception(body['error'] ?? 'Ebeveyn rehberi alınamadı.');
        }
        return body;
      },
    );
  }

  /// Harici API'lerin bu ayki kalan kotası (yalnızca arşiv sahibi görebilir).
  Future<Map<String, dynamic>> usage() async {
    final response = await http
        .get(
          Uri.parse('${AppConfig.apiBaseUrl}/api/movies/usage'),
          headers: await _authHeaders(),
        )
        .timeout(const Duration(seconds: 20));
    Map<String, dynamic> body;
    try {
      body = jsonDecode(response.body) as Map<String, dynamic>;
    } catch (_) {
      throw Exception('Kullanım bilgisi alınamadı (${response.statusCode}).');
    }
    if (response.statusCode != 200) {
      throw Exception(body['error'] ?? 'Kullanım bilgisi alınamadı.');
    }
    return body;
  }

  /// Bir konunun topluluk notlarının Türkçe çevirisi (not sırasıyla; çevrilemeyen null).
  Future<List<String?>> translateNotes(
    String mediaType,
    int tmdbId,
    int topicId,
  ) async {
    final body = await _cachedJsonMap(
      key: 'movie_guide_tr_${mediaType}_${tmdbId}_$topicId',
      ttl: _translationCacheTtl,
      fetcher: () async {
        final response = await http
            .get(
              Uri.parse(
                '${AppConfig.apiBaseUrl}/api/movies/parents-guide/$mediaType/$tmdbId/translate?topic=$topicId',
              ),
              headers: await _optionalAuthHeaders(),
            )
            .timeout(const Duration(seconds: 40));
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        if (response.statusCode != 200) {
          throw Exception(decoded['error'] ?? 'Çeviri alınamadı.');
        }
        final list = (decoded['translations'] as List? ?? const []);
        // Hiçbiri çevrilemediyse önbelleğe yazma; sonra tekrar denenebilsin.
        if (list.isNotEmpty && list.every((e) => e == null)) {
          throw Exception('Çeviri şu an kullanılamıyor.');
        }
        return decoded;
      },
    );
    return (body['translations'] as List? ?? const [])
        .map((e) => e as String?)
        .toList();
  }

  Future<List<TmdbSearchItem>> search(String query) async {
    final normalizedQuery = query.trim().toLowerCase();
    final body = await _cachedJsonMap(
      key: 'movie_search_$normalizedQuery',
      ttl: _searchCacheTtl,
      fetcher: () async {
        final uri = Uri.parse(
          '${AppConfig.apiBaseUrl}/api/movies/search',
        ).replace(queryParameters: {'q': query});
        final response = await http.get(uri, headers: await _authHeaders());
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (response.statusCode != 200) {
          throw Exception(body['error'] ?? 'Arama yapılamadı.');
        }
        return body;
      },
    );
    return (body['results'] as List? ?? const [])
        .map((item) => TmdbSearchItem.fromJson(item as Map<String, dynamic>))
        .toList();
  }

  Future<Map<String, double>> ratings(List<String> imdbIds) async {
    final uniqueIds = imdbIds.toSet().toList()..sort();
    if (uniqueIds.isEmpty) return const {};

    final merged = <String, double>{};
    for (var start = 0; start < uniqueIds.length; start += _ratingsBatchSize) {
      final chunk = uniqueIds.skip(start).take(_ratingsBatchSize).toList();
      merged.addAll(await _ratingsChunk(chunk));
    }
    return merged;
  }

  Future<Map<String, double>> _ratingsChunk(List<String> imdbIds) async {
    final body = await _cachedJsonMap(
      key: 'movie_ratings_${imdbIds.join('_')}',
      ttl: _ratingsCacheTtl,
      fetcher: () async {
        final response = await http.post(
          Uri.parse('${AppConfig.apiBaseUrl}/api/movies/ratings'),
          headers: {'content-type': 'application/json'},
          body: jsonEncode({'imdbIds': imdbIds}),
        );
        final body = jsonDecode(response.body) as Map<String, dynamic>;
        if (response.statusCode != 200) {
          throw Exception(body['error'] ?? 'IMDb puanları alınamadı.');
        }
        return body;
      },
    );

    final ratings = body['ratings'] as Map<String, dynamic>? ?? const {};
    return ratings.map((id, value) {
      final rating = (value as Map<String, dynamic>)['averageRating'] as num;
      return MapEntry(id, rating.toDouble());
    });
  }

  Future<List<ImportMatch>> matchImdbIds(List<String> imdbIds) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}/api/movies/import/imdb'),
      headers: {'content-type': 'application/json', ...await _authHeaders()},
      body: jsonEncode({'imdbIds': imdbIds}),
    );
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(body['error'] ?? 'IMDb kayıtları eşleştirilemedi.');
    }
    return (body['results'] as List? ?? const []).map((raw) {
      final item = raw as Map<String, dynamic>;
      final media = item['media'];
      return ImportMatch(
        item['imdbId'] as String,
        media == null
            ? null
            : TmdbSearchItem.fromJson(media as Map<String, dynamic>),
      );
    }).toList();
  }

  /// Oturum varsa token gönderir (arşiv dışı yapımların önizlemesi için); yoksa boş başlık.
  Future<Map<String, String>> _optionalAuthHeaders() async {
    try {
      final token = await FirebaseAuth.instance.currentUser?.getIdToken();
      return token == null ? const {} : {'authorization': 'Bearer $token'};
    } catch (_) {
      return const {};
    }
  }

  Future<Map<String, String>> _authHeaders() async {
    final token = await FirebaseAuth.instance.currentUser?.getIdToken();
    if (token == null) throw StateError('Oturum bulunamadı.');
    return {'authorization': 'Bearer $token'};
  }

  Future<Map<String, dynamic>> _cachedJsonMap({
    required String key,
    required Duration ttl,
    required Future<Map<String, dynamic>> Function() fetcher,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(key);
    final now = DateTime.now().millisecondsSinceEpoch;

    Map<String, dynamic>? staleValue;
    if (raw != null) {
      final cached = jsonDecode(raw) as Map<String, dynamic>;
      final cachedAt = cached['cachedAt'] as int? ?? 0;
      staleValue = Map<String, dynamic>.from(cached['value'] as Map);
      if (now - cachedAt < ttl.inMilliseconds) return staleValue;
    }

    try {
      final fresh = await fetcher();
      await prefs.setString(key, jsonEncode({'cachedAt': now, 'value': fresh}));
      return fresh;
    } catch (_) {
      if (staleValue != null) return staleValue;
      rethrow;
    }
  }
}
