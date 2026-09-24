import 'package:flutter_test/flutter_test.dart';
import 'package:movie_log_mobile/models/library_item.dart';
import 'package:movie_log_mobile/models/tmdb_search_item.dart';

void main() {
  group('LibraryItem', () {
    final data = {
      'tmdbId': 1396,
      'imdbId': 'tt0903747',
      'mediaType': 'tv',
      'favorite': true,
      'isPublic': true,
      'snapshot': {
        'title': 'Breaking Bad',
        'originalTitle': 'Breaking Bad',
        'year': 2008,
        'posterPath': '/p.jpg',
        'genres': ['Dram', 'Suç'],
        'imdbRating': 9, // Firestore tamsayı olarak da döndürebilir
        'imdbVotes': 2680071,
      },
    };

    test('Firestore verisini doğru ayrıştırır (tamsayı puan double olur)', () {
      final item = LibraryItem.fromFirestoreMap('tv_1396', data);
      expect(item.mediaType, MediaType.tv);
      expect(item.imdbRating, 9.0);
      expect(item.imdbVotes, 2680071);
      expect(item.genres, ['Dram', 'Suç']);
      expect(item.favorite, isTrue);
    });

    test('eksik snapshot alanlarında çökmez, makul varsayılan verir', () {
      final item = LibraryItem.fromFirestoreMap('movie_1', {
        'tmdbId': 1,
        'mediaType': 'movie',
      });
      expect(item.title, 'Başlıksız');
      expect(item.imdbRating, isNull);
      expect(item.favorite, isFalse);
      expect(item.isPublic, isFalse);
    });

    test('önbellek gidiş-dönüşü veriyi korur', () {
      final item = LibraryItem.fromFirestoreMap('tv_1396', data);
      final again = LibraryItem.fromCache(item.toCache());
      expect(again.id, 'tv_1396');
      expect(again.title, item.title);
      expect(again.imdbRating, item.imdbRating);
      expect(again.mediaType, item.mediaType);
    });
  });

  group('TmdbSearchItem', () {
    const item = TmdbSearchItem(
      tmdbId: 27205,
      imdbId: 'tt1375666',
      mediaType: MediaType.movie,
      title: 'Başlangıç',
      originalTitle: 'Inception',
      year: 2010,
      posterPath: '/x.jpg',
      overview: '',
      genres: ['Bilim Kurgu'],
      imdbRating: 8.8,
      imdbVotes: 2500000,
    );

    test('documentId tür_tmdbId biçimindedir (aynı yapım iki kez eklenemez)', () {
      expect(item.documentId, 'movie_27205');
    });

    test('copyWith yalnızca verilen alanları değiştirir', () {
      final updated = item.copyWith(imdbRating: 9.0);
      expect(updated.imdbRating, 9.0);
      expect(updated.title, item.title);
      expect(updated.tmdbId, item.tmdbId);
    });
  });
}
