import 'dart:async';
import 'package:flutter/material.dart';
import '../models/library_item.dart';
import '../models/tmdb_search_item.dart';
import '../screens/media_detail_screen.dart';
import '../services/library_service.dart';
import '../services/movie_api_service.dart';

class SearchSheet extends StatefulWidget {
  const SearchSheet({super.key, required this.existingIds});
  final Set<String> existingIds;
  @override
  State<SearchSheet> createState() => _SearchSheetState();
}

class _SearchSheetState extends State<SearchSheet> {
  final controller = TextEditingController();
  final api = MovieApiService();
  final library = LibraryService();
  Timer? debounce;
  List<TmdbSearchItem> results = const [];
  bool loading = false;
  String? busyId;
  final addedIds = <String>{};
  String? error;
  int searchSerial = 0;

  @override
  void dispose() {
    debounce?.cancel();
    controller.dispose();
    super.dispose();
  }

  void changed(String value) {
    debounce?.cancel();
    if (value.trim().length < 2) {
      setState(() => results = const []);
      return;
    }
    debounce = Timer(
      const Duration(milliseconds: 350),
      () => search(value.trim()),
    );
  }

  Future<void> search(String query) async {
    final serial = ++searchSerial;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final found = await api.search(query);
      if (mounted && serial == searchSerial) setState(() => results = found);
    } catch (exception) {
      if (mounted && serial == searchSerial) {
        setState(
          () => error = exception.toString().replaceFirst('Exception: ', ''),
        );
      }
    } finally {
      if (mounted && serial == searchSerial) setState(() => loading = false);
    }
  }

  bool exists(TmdbSearchItem media) =>
      widget.existingIds.contains(media.documentId) ||
      addedIds.contains(media.documentId);

  void openDetail(TmdbSearchItem media) {
    FocusScope.of(context).unfocus();
    Navigator.push(
      context,
      MaterialPageRoute<void>(
        builder: (_) => MediaDetailScreen(
          item: LibraryItem(
            id: media.documentId,
            tmdbId: media.tmdbId,
            imdbId: media.imdbId,
            mediaType: media.mediaType,
            title: media.title,
            originalTitle: media.originalTitle,
            year: media.year,
            posterPath: media.posterPath,
            genres: media.genres,
            imdbRating: media.imdbRating,
            imdbVotes: media.imdbVotes,
            favorite: false,
            isPublic: true,
          ),
          alreadyAdded: exists(media),
          onAdd: () => add(media),
        ),
      ),
    );
  }

  /// Yapım arşivdeyse (yeni eklendi ya da zaten vardı) true, hata olursa false.
  Future<bool> add(TmdbSearchItem media) async {
    if (exists(media)) return true;
    if (mounted) setState(() => busyId = media.documentId);
    try {
      final details = await api.details(media.tmdbId, media.mediaType.name);
      final metadata = details['metadata'] as Map<String, dynamic>? ?? const {};
      final externalIds =
          metadata['external_ids'] as Map<String, dynamic>? ?? const {};
      final imdbRating = details['imdbRating'] as Map<String, dynamic>?;
      final enriched = media.copyWith(
        imdbId: externalIds['imdb_id'] as String? ?? media.imdbId,
        genres: (metadata['genres'] as List? ?? const [])
            .whereType<Map>()
            .map((genre) => genre['name'].toString())
            .toList(),
        imdbRating: (imdbRating?['averageRating'] as num?)?.toDouble(),
        imdbVotes: (imdbRating?['numVotes'] as num?)?.toInt(),
      );
      final added = await library.add(enriched);
      addedIds.add(media.documentId);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              added
                  ? '${enriched.title} eklendi.'
                  : '${enriched.title} zaten arşivde.',
            ),
          ),
        );
      }
      return true;
    } catch (exception) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Eklenemedi: ${exception.toString().replaceFirst('Exception: ', '')}',
            ),
          ),
        );
      }
      return false;
    } finally {
      if (mounted) setState(() => busyId = null);
    }
  }

  @override
  Widget build(BuildContext context) => DraggableScrollableSheet(
    initialChildSize: .92,
    minChildSize: .55,
    maxChildSize: .96,
    expand: false,
    builder: (context, scrollController) => Padding(
      padding: const EdgeInsets.fromLTRB(18, 12, 18, 0),
      child: Column(
        children: [
          Container(
            width: 44,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 18),
          const Align(
            alignment: Alignment.centerLeft,
            child: Text(
              'Film veya dizi ekle',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: controller,
            autofocus: true,
            onChanged: changed,
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'TMDB’de ara...',
            ),
          ),
          if (loading) const LinearProgressIndicator(minHeight: 2),
          if (error != null)
            Padding(
              padding: const EdgeInsets.all(12),
              child: Text(
                error!,
                style: const TextStyle(color: Colors.redAccent),
              ),
            ),
          Expanded(
            child: ListView.separated(
              controller: scrollController,
              padding: const EdgeInsets.symmetric(vertical: 14),
              itemCount: results.length,
              separatorBuilder: (_, _) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final media = results[index];
                final inArchive = exists(media);
                return ListTile(
                  onTap: () => openDetail(media),
                  tileColor: Colors.white.withValues(alpha: .04),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                  leading: SizedBox(
                    width: 48,
                    height: 72,
                    child: media.posterPath == null
                        ? const Icon(Icons.movie)
                        : ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              'https://image.tmdb.org/t/p/w185${media.posterPath}',
                              fit: BoxFit.cover,
                              cacheWidth: 120,
                              cacheHeight: 180,
                              filterQuality: FilterQuality.low,
                            ),
                          ),
                  ),
                  title: Text(
                    media.title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  subtitle: Text(
                    '${media.mediaType.name == 'movie' ? 'Film' : 'Dizi'} · ${media.year ?? '—'}',
                  ),
                  trailing: IconButton.filled(
                    onPressed: inArchive || busyId == media.documentId
                        ? null
                        : () => add(media),
                    icon: busyId == media.documentId
                        ? const SizedBox.square(
                            dimension: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Icon(inArchive ? Icons.check : Icons.add),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    ),
  );
}
