import 'package:cloud_firestore/cloud_firestore.dart';

enum MediaType { movie, tv }

class LibraryItem {
  const LibraryItem({
    required this.id,
    required this.tmdbId,
    required this.imdbId,
    required this.mediaType,
    required this.title,
    required this.originalTitle,
    required this.year,
    required this.posterPath,
    required this.genres,
    required this.favorite,
    required this.isPublic,
  });

  final String id;
  final int tmdbId;
  final String? imdbId;
  final MediaType mediaType;
  final String title;
  final String originalTitle;
  final int? year;
  final String? posterPath;
  final List<String> genres;
  final bool favorite;
  final bool isPublic;

  factory LibraryItem.fromDocument(
    DocumentSnapshot<Map<String, dynamic>> document,
  ) {
    final data = document.data() ?? const <String, dynamic>{};
    final snapshot = data['snapshot'] as Map<String, dynamic>? ?? const {};
    return LibraryItem(
      id: document.id,
      tmdbId: data['tmdbId'] as int,
      imdbId: data['imdbId'] as String?,
      mediaType: data['mediaType'] == 'tv' ? MediaType.tv : MediaType.movie,
      title: snapshot['title'] as String? ?? 'Başlıksız',
      originalTitle: snapshot['originalTitle'] as String? ?? '',
      year: snapshot['year'] as int?,
      posterPath: snapshot['posterPath'] as String?,
      genres: List<String>.from(snapshot['genres'] as List? ?? const []),
      favorite: data['favorite'] as bool? ?? false,
      isPublic: data['isPublic'] as bool? ?? false,
    );
  }
}
