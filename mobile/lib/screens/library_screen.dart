import 'dart:convert';
import 'dart:async';
import 'dart:io';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import '../models/library_item.dart';
import '../models/tmdb_search_item.dart';
import '../services/library_service.dart';
import '../services/movie_api_service.dart';
import '../services/share_intent_service.dart';
import '../widgets/media_card.dart';
import '../widgets/search_sheet.dart';
import 'media_detail_screen.dart';

enum LibraryFilter { all, movie, tv, favorites }

class LibraryScreen extends StatefulWidget {
  const LibraryScreen({super.key});
  @override
  State<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends State<LibraryScreen> {
  final library = LibraryService();
  final api = MovieApiService();
  final search = TextEditingController();
  LibraryFilter filter = LibraryFilter.all;
  bool importing = false;
  final shareIntent = ShareIntentService();
  StreamSubscription<String>? shareSubscription;

  @override
  void initState() {
    super.initState();
    if (Platform.isAndroid) {
      shareSubscription = shareIntent.sharedText.listen(_handleSharedText);
      WidgetsBinding.instance.addPostFrameCallback((_) async {
        final text = await shareIntent.initialText();
        if (text != null) await _handleSharedText(text);
      });
    }
  }

  @override
  void dispose() {
    shareSubscription?.cancel();
    search.dispose();
    super.dispose();
  }

  Future<void> _handleSharedText(String text) async {
    final imdbId = ShareIntentService.imdbIdFrom(text);
    if (imdbId == null || !mounted) return;
    try {
      final matches = await api.matchImdbIds([imdbId]);
      final media = matches.firstOrNull?.media;
      if (media == null) throw Exception('IMDb bağlantısı TMDB ile eşleşmedi.');
      final added = await library.add(media);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              added
                  ? '${media.title} arşive eklendi.'
                  : '${media.title} zaten arşivde.',
            ),
          ),
        );
      }
    } catch (exception) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(exception.toString().replaceFirst('Exception: ', '')),
          ),
        );
      }
    }
  }

  Future<void> importCsv(Set<String> existingIds) async {
    final picked = await FilePicker.pickFile(
      type: FileType.custom,
      allowedExtensions: ['csv'],
    );
    if (picked == null) return;
    final bytes = await picked.readAsBytes();
    setState(() => importing = true);
    try {
      final text = utf8.decode(bytes, allowMalformed: true);
      final ids = RegExp(
        r'\btt\d{7,10}\b',
      ).allMatches(text).map((match) => match.group(0)!).toSet().toList();
      if (ids.isEmpty) {
        throw Exception('CSV içinde IMDb title ID bulunamadı.');
      }
      final matches = await api.matchImdbIds(ids);
      final additions = matches
          .map((match) => match.media)
          .whereType<TmdbSearchItem>()
          .where((media) => !existingIds.contains(media.documentId))
          .toList();
      await library.addMany(additions);
      final missing = matches.where((match) => match.media == null).length;
      final skipped = matches.length - missing - additions.length;
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              '${additions.length} eklendi · $skipped zaten vardı · $missing eşleşmedi',
            ),
          ),
        );
      }
    } catch (exception) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(exception.toString().replaceFirst('Exception: ', '')),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => importing = false);
    }
  }

  List<LibraryItem> visible(List<LibraryItem> items) {
    final query = search.text.trim().toLowerCase();
    return items.where((item) {
      final filterMatch =
          filter == LibraryFilter.all ||
          (filter == LibraryFilter.movie &&
              item.mediaType == MediaType.movie) ||
          (filter == LibraryFilter.tv && item.mediaType == MediaType.tv) ||
          (filter == LibraryFilter.favorites && item.favorite);
      return filterMatch &&
          (query.isEmpty ||
              item.title.toLowerCase().contains(query) ||
              item.originalTitle.toLowerCase().contains(query) ||
              '${item.year}'.contains(query));
    }).toList();
  }

  @override
  Widget build(BuildContext context) => StreamBuilder<List<LibraryItem>>(
    stream: library.watchLibrary(),
    builder: (context, snapshot) {
      final items = snapshot.data ?? const <LibraryItem>[];
      final shown = visible(items);
      final existingIds = items.map((item) => item.id).toSet();
      return Scaffold(
        appBar: AppBar(
          title: const Text(
            'MoTLog',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
          actions: [
            IconButton(
              onPressed: importing ? null : () => importCsv(existingIds),
              tooltip: 'IMDb CSV içe aktar',
              icon: importing
                  ? const SizedBox.square(
                      dimension: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.upload_file),
            ),
            IconButton(
              onPressed: FirebaseAuth.instance.signOut,
              tooltip: 'Çıkış yap',
              icon: const Icon(Icons.logout),
            ),
          ],
        ),
        body: SafeArea(
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 10),
                child: TextField(
                  controller: search,
                  onChanged: (_) => setState(() {}),
                  decoration: const InputDecoration(
                    prefixIcon: Icon(Icons.search),
                    hintText: 'Arşivinde ara...',
                  ),
                ),
              ),
              SizedBox(
                height: 44,
                child: ListView(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  children: LibraryFilter.values
                      .map(
                        (value) => Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: ChoiceChip(
                            selected: filter == value,
                            onSelected: (_) => setState(() => filter = value),
                            label: Text(switch (value) {
                              LibraryFilter.all => 'Tümü',
                              LibraryFilter.movie => 'Filmler',
                              LibraryFilter.tv => 'Diziler',
                              LibraryFilter.favorites => 'Favoriler',
                            }),
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
              const SizedBox(height: 10),
              Expanded(
                child: snapshot.hasError
                    ? Center(
                        child: Text('Arşiv yüklenemedi: ${snapshot.error}'),
                      )
                    : snapshot.connectionState == ConnectionState.waiting
                    ? const Center(child: CircularProgressIndicator())
                    : shown.isEmpty
                    ? const Center(
                        child: Padding(
                          padding: EdgeInsets.all(30),
                          child: Text(
                            'Arşivin henüz boş. + düğmesiyle izlediğin ilk yapımı ekle.',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.white54),
                          ),
                        ),
                      )
                    : GridView.builder(
                        padding: const EdgeInsets.fromLTRB(14, 4, 14, 100),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              childAspectRatio: .58,
                              crossAxisSpacing: 12,
                              mainAxisSpacing: 18,
                            ),
                        itemCount: shown.length,
                        itemBuilder: (context, index) {
                          final item = shown[index];
                          return MediaCard(
                            item: item,
                            onOpen: () => Navigator.push(
                              context,
                              MaterialPageRoute<void>(
                                builder: (_) => MediaDetailScreen(item: item),
                              ),
                            ),
                            onFavorite: () =>
                                library.setFavorite(item, !item.favorite),
                            onPublic: () =>
                                library.setPublic(item, !item.isPublic),
                            onRemove: () => library.remove(item),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            isScrollControlled: true,
            useSafeArea: true,
            backgroundColor: const Color(0xFF0B0E12),
            builder: (_) => SearchSheet(existingIds: existingIds),
          ),
          icon: const Icon(Icons.add),
          label: const Text('Yapım ekle'),
        ),
      );
    },
  );
}
