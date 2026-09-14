import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import '../core/app_config.dart';
import '../models/tmdb_search_item.dart';

class ImportMatch {
  const ImportMatch(this.imdbId, this.media);
  final String imdbId;
  final TmdbSearchItem? media;
}

class MovieApiService {
  Future<Map<String, dynamic>> details(int tmdbId, String mediaType) async {
    final response = await http.get(
      Uri.parse('${AppConfig.apiBaseUrl}/api/movies/$mediaType/$tmdbId'),
    );
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(body['error'] ?? 'Detaylar alınamadı.');
    }
    return body;
  }

  Future<List<Map<String, dynamic>>> episodes(int tmdbId) async {
    final response = await http.get(
      Uri.parse('${AppConfig.apiBaseUrl}/api/movies/tv/$tmdbId/episodes'),
    );
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(body['error'] ?? 'Bölüm puanları alınamadı.');
    }
    return List<Map<String, dynamic>>.from(
      body['episodes'] as List? ?? const [],
    );
  }

  Future<List<TmdbSearchItem>> search(String query) async {
    final uri = Uri.parse(
      '${AppConfig.apiBaseUrl}/api/movies/search',
    ).replace(queryParameters: {'q': query});
    final response = await http.get(uri, headers: await _authHeaders());
    final body = jsonDecode(response.body) as Map<String, dynamic>;
    if (response.statusCode != 200) {
      throw Exception(body['error'] ?? 'Arama yapılamadı.');
    }
    return (body['results'] as List? ?? const [])
        .map((item) => TmdbSearchItem.fromJson(item as Map<String, dynamic>))
        .toList();
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

  Future<Map<String, String>> _authHeaders() async {
    final token = await FirebaseAuth.instance.currentUser?.getIdToken();
    if (token == null) throw StateError('Oturum bulunamadı.');
    return {'authorization': 'Bearer $token'};
  }
}
