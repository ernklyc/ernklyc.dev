import 'package:cloud_firestore/cloud_firestore.dart';
import 'library_item.dart';

class TmdbSearchItem {
  const TmdbSearchItem({
    required this.tmdbId,
    required this.imdbId,
    required this.mediaType,
    required this.title,
    required this.originalTitle,
    required this.year,
    required this.posterPath,
    required this.overview,
    required this.genres,
    required this.imdbRating,
    required this.imdbVotes,
  });

  final int tmdbId;
  final String? imdbId;
  final MediaType mediaType;
  final String title;
  final String originalTitle;
  final int? year;
  final String? posterPath;
  final String overview;
  final List<String> genres;
  final double? imdbRating;
  final int? imdbVotes;

  String get documentId => '${mediaType.name}_$tmdbId';

  TmdbSearchItem copyWith({
    String? imdbId,
    List<String>? genres,
    double? imdbRating,
    int? imdbVotes,
  }) => TmdbSearchItem(
    tmdbId: tmdbId,
    imdbId: imdbId ?? this.imdbId,
    mediaType: mediaType,
    title: title,
    originalTitle: originalTitle,
    year: year,
    posterPath: posterPath,
    overview: overview,
    genres: genres ?? this.genres,
    imdbRating: imdbRating ?? this.imdbRating,
    imdbVotes: imdbVotes ?? this.imdbVotes,
  );

  factory TmdbSearchItem.fromJson(Map<String, dynamic> json) => TmdbSearchItem(
    tmdbId: json['tmdbId'] as int,
    imdbId: json['imdbId'] as String?,
    mediaType: json['mediaType'] == 'tv' ? MediaType.tv : MediaType.movie,
    title: json['title'] as String? ?? 'Başlıksız',
    originalTitle: json['originalTitle'] as String? ?? '',
    year: json['year'] as int?,
    posterPath: json['posterPath'] as String?,
    overview: json['overview'] as String? ?? '',
    genres: List<String>.from(json['genres'] as List? ?? const []),
    imdbRating: (json['imdbRating'] as num?)?.toDouble(),
    imdbVotes: (json['imdbVotes'] as num?)?.toInt(),
  );

  Map<String, dynamic> toFirestore() => {
    'tmdbId': tmdbId,
    'imdbId': imdbId,
    'mediaType': mediaType.name,
    'favorite': false,
    'isPublic': true,
    'snapshot': {
      'title': title,
      'originalTitle': originalTitle,
      'year': year,
      'posterPath': posterPath,
      'genres': genres,
      'imdbRating': imdbRating,
      'imdbVotes': imdbVotes,
    },
    'addedAt': FieldValue.serverTimestamp(),
    'updatedAt': FieldValue.serverTimestamp(),
  };
}
