import 'package:flutter_test/flutter_test.dart';
import 'package:movie_log_mobile/models/library_item.dart';
import 'package:movie_log_mobile/models/tmdb_search_item.dart';

void main() {
  test('media document id is deterministic', () {
    const media = TmdbSearchItem(
      tmdbId: 157336,
      imdbId: 'tt0816692',
      mediaType: MediaType.movie,
      title: 'Yıldızlararası',
      originalTitle: 'Interstellar',
      year: 2014,
      posterPath: null,
      overview: '',
      genres: [],
      imdbRating: 8.7,
      imdbVotes: 2300000,
    );

    expect(media.documentId, 'movie_157336');
  });
}
