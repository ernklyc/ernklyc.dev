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

enum LibraryViewMode { grid, list }

enum LibrarySortMode { added, imdbDesc, title, yearDesc, yearAsc }

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
  LibraryViewMode viewMode = LibraryViewMode.grid;
  LibrarySortMode sortMode = LibrarySortMode.imdbDesc;
  bool controlsExpanded = false;
  String genreFilter = 'all';
  String yearFilter = 'all';
  bool importing = false;
  final shareIntent = ShareIntentService();
  StreamSubscription<String>? shareSubscription;
  Map<String, double> imdbRatings = const {};
  String ratingsKey = '';
  String repairKey = '';
  bool ratingsLoading = false;

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
    final filtered = items.where((item) {
      final filterMatch =
          filter == LibraryFilter.all ||
          (filter == LibraryFilter.movie &&
              item.mediaType == MediaType.movie) ||
          (filter == LibraryFilter.tv && item.mediaType == MediaType.tv) ||
          (filter == LibraryFilter.favorites && item.favorite);
      final genreMatch =
          genreFilter == 'all' || item.genres.contains(genreFilter);
      final yearMatch = yearFilter == 'all' || '${item.year}' == yearFilter;
      return filterMatch &&
          genreMatch &&
          yearMatch &&
          (query.isEmpty ||
              item.title.toLowerCase().contains(query) ||
              item.originalTitle.toLowerCase().contains(query) ||
              '${item.year}'.contains(query));
    }).toList();

    filtered.sort(
      (a, b) => switch (sortMode) {
        LibrarySortMode.title => a.title.compareTo(b.title),
        LibrarySortMode.imdbDesc => _ratingOf(b).compareTo(_ratingOf(a)),
        LibrarySortMode.yearDesc => (b.year ?? 0).compareTo(a.year ?? 0),
        LibrarySortMode.yearAsc => (a.year ?? 9999).compareTo(b.year ?? 9999),
        LibrarySortMode.added => b.id.compareTo(a.id),
      },
    );
    return filtered;
  }

  double _ratingOf(LibraryItem item) =>
      item.imdbRating ??
      (item.imdbId == null ? -1 : imdbRatings[item.imdbId] ?? -1);

  void _ensureRatings(List<LibraryItem> items) {
    final ids =
        items
            .where((item) => item.imdbRating == null && item.imdbId != null)
            .map((item) => item.imdbId!)
            .toSet()
            .toList()
          ..sort();
    final key = ids.join('|');
    if (key.isEmpty || key == ratingsKey || ratingsLoading) return;
    ratingsKey = key;
    ratingsLoading = true;
    api
        .ratings(ids)
        .then((ratings) {
          if (!mounted) return;
          final merged = {...imdbRatings, ...ratings};
          setState(() => imdbRatings = merged);
          _repairItems(items, merged);
        })
        .whenComplete(() => ratingsLoading = false);
  }

  void _repairItems(List<LibraryItem> items, Map<String, double> ratings) {
    final key = items
        .map(
          (item) =>
              '${item.id}:${item.isPublic ? 1 : 0}:${item.imdbRating ?? ratings[item.imdbId] ?? ''}',
        )
        .join('|');
    if (key == repairKey) return;
    repairKey = key;
    library.repairPublicAndRatings(items, ratings).catchError((_) {});
  }

  @override
  Widget build(BuildContext context) => StreamBuilder<List<LibraryItem>>(
    stream: library.watchLibrary(),
    builder: (context, snapshot) {
      final items = snapshot.data ?? const <LibraryItem>[];
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _ensureRatings(items);
        _repairItems(items, imdbRatings);
      });
      final shown = visible(items);
      final existingIds = items.map((item) => item.id).toSet();
      final movieCount = items
          .where((item) => item.mediaType == MediaType.movie)
          .length;
      final tvCount = items
          .where((item) => item.mediaType == MediaType.tv)
          .length;
      final favoriteCount = items.where((item) => item.favorite).length;
      final genres = items.expand((item) => item.genres).toSet().toList()
        ..sort();
      final years =
          items.map((item) => item.year).whereType<int>().toSet().toList()
            ..sort((a, b) => b.compareTo(a));
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
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 2, 16, 10),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        '${shown.length} kayıt gösteriliyor',
                        style: const TextStyle(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () =>
                          setState(() => controlsExpanded = !controlsExpanded),
                      icon: Icon(
                        controlsExpanded
                            ? Icons.expand_less
                            : Icons.tune_rounded,
                        size: 18,
                      ),
                      label: Text(controlsExpanded ? 'Gizle' : 'Filtrele'),
                    ),
                    const SizedBox(width: 8),
                    SegmentedButton<LibraryViewMode>(
                      showSelectedIcon: false,
                      segments: const [
                        ButtonSegment(
                          value: LibraryViewMode.grid,
                          icon: Icon(Icons.grid_view_rounded, size: 18),
                        ),
                        ButtonSegment(
                          value: LibraryViewMode.list,
                          icon: Icon(Icons.view_agenda_rounded, size: 18),
                        ),
                      ],
                      selected: {viewMode},
                      onSelectionChanged: (value) =>
                          setState(() => viewMode = value.first),
                    ),
                  ],
                ),
              ),
              AnimatedCrossFade(
                firstChild: const SizedBox.shrink(),
                secondChild: Column(
                  children: [
                    _StatsBar(
                      total: items.length,
                      movies: movieCount,
                      tv: tvCount,
                      favorites: favoriteCount,
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
                      child: Column(
                        children: [
                          _EnumDropdown<LibrarySortMode>(
                            label: 'Sırala',
                            value: sortMode,
                            values: LibrarySortMode.values,
                            labelFor: (value) => switch (value) {
                              LibrarySortMode.added => 'Son eklenen',
                              LibrarySortMode.imdbDesc => 'IMDb puanı',
                              LibrarySortMode.title => 'Ada göre',
                              LibrarySortMode.yearDesc => 'Yeni yıl',
                              LibrarySortMode.yearAsc => 'Eski yıl',
                            },
                            onChanged: (value) =>
                                setState(() => sortMode = value),
                          ),
                          const SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: _StringDropdown(
                                  label: 'Tür',
                                  value: genreFilter,
                                  items: ['all', ...genres],
                                  labelFor: (value) =>
                                      value == 'all' ? 'Tüm türler' : value,
                                  onChanged: (value) =>
                                      setState(() => genreFilter = value),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: _StringDropdown(
                                  label: 'Yıl',
                                  value: yearFilter,
                                  items: [
                                    'all',
                                    ...years.map((year) => '$year'),
                                  ],
                                  labelFor: (value) =>
                                      value == 'all' ? 'Tüm yıllar' : value,
                                  onChanged: (value) =>
                                      setState(() => yearFilter = value),
                                ),
                              ),
                            ],
                          ),
                        ],
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
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 4,
                                ),
                                child: ChoiceChip(
                                  selected: filter == value,
                                  onSelected: (_) =>
                                      setState(() => filter = value),
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
                  ],
                ),
                crossFadeState: controlsExpanded
                    ? CrossFadeState.showSecond
                    : CrossFadeState.showFirst,
                duration: const Duration(milliseconds: 180),
              ),
              SizedBox(height: controlsExpanded ? 10 : 2),
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
                    : _LibraryResults(
                        items: shown,
                        viewMode: viewMode,
                        onOpen: (item) => Navigator.push(
                          context,
                          MaterialPageRoute<void>(
                            builder: (_) => MediaDetailScreen(item: item),
                          ),
                        ),
                        onFavorite: (item) =>
                            library.setFavorite(item, !item.favorite),
                        onRemove: library.remove,
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

class _StatsBar extends StatelessWidget {
  const _StatsBar({
    required this.total,
    required this.movies,
    required this.tv,
    required this.favorites,
  });

  final int total;
  final int movies;
  final int tv;
  final int favorites;

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 72,
    child: ListView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      children: [
        _StatChip(label: 'Toplam', value: total, icon: Icons.collections),
        _StatChip(label: 'Film', value: movies, icon: Icons.movie_creation),
        _StatChip(label: 'Dizi', value: tv, icon: Icons.live_tv),
        _StatChip(label: 'Favori', value: favorites, icon: Icons.favorite),
      ],
    ),
  );
}

class _EnumDropdown<T extends Enum> extends StatelessWidget {
  const _EnumDropdown({
    required this.label,
    required this.value,
    required this.values,
    required this.labelFor,
    required this.onChanged,
  });

  final String label;
  final T value;
  final List<T> values;
  final String Function(T value) labelFor;
  final ValueChanged<T> onChanged;

  @override
  Widget build(BuildContext context) => _DropdownFrame(
    label: label,
    child: DropdownButtonHideUnderline(
      child: DropdownButton<T>(
        isExpanded: true,
        value: value,
        dropdownColor: const Color(0xFF11161C),
        borderRadius: BorderRadius.circular(14),
        items: values
            .map(
              (item) => DropdownMenuItem<T>(
                value: item,
                child: Text(labelFor(item), overflow: TextOverflow.ellipsis),
              ),
            )
            .toList(),
        onChanged: (next) {
          if (next != null) onChanged(next);
        },
      ),
    ),
  );
}

class _StringDropdown extends StatelessWidget {
  const _StringDropdown({
    required this.label,
    required this.value,
    required this.items,
    required this.labelFor,
    required this.onChanged,
  });

  final String label;
  final String value;
  final List<String> items;
  final String Function(String value) labelFor;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) => _DropdownFrame(
    label: label,
    child: DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        isExpanded: true,
        value: items.contains(value) ? value : 'all',
        dropdownColor: const Color(0xFF11161C),
        borderRadius: BorderRadius.circular(14),
        items: items
            .map(
              (item) => DropdownMenuItem<String>(
                value: item,
                child: Text(labelFor(item), overflow: TextOverflow.ellipsis),
              ),
            )
            .toList(),
        onChanged: (next) {
          if (next != null) onChanged(next);
        },
      ),
    ),
  );
}

class _DropdownFrame extends StatelessWidget {
  const _DropdownFrame({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) => InputDecorator(
    decoration: InputDecoration(
      labelText: label,
      contentPadding: const EdgeInsets.fromLTRB(12, 4, 8, 4),
    ),
    child: child,
  );
}

class _StatChip extends StatelessWidget {
  const _StatChip({
    required this.label,
    required this.value,
    required this.icon,
  });

  final String label;
  final int value;
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
    width: 112,
    margin: const EdgeInsets.only(right: 10),
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.05),
      border: Border.all(color: Colors.white12),
      borderRadius: BorderRadius.circular(16),
    ),
    child: Row(
      children: [
        Icon(icon, size: 18, color: const Color(0xFFF5C518)),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('$value', style: const TextStyle(fontWeight: FontWeight.w800)),
            Text(
              label,
              style: const TextStyle(fontSize: 11, color: Colors.white54),
            ),
          ],
        ),
      ],
    ),
  );
}

class _LibraryResults extends StatelessWidget {
  const _LibraryResults({
    required this.items,
    required this.viewMode,
    required this.onOpen,
    required this.onFavorite,
    required this.onRemove,
  });

  final List<LibraryItem> items;
  final LibraryViewMode viewMode;
  final ValueChanged<LibraryItem> onOpen;
  final ValueChanged<LibraryItem> onFavorite;
  final ValueChanged<LibraryItem> onRemove;

  @override
  Widget build(BuildContext context) {
    if (viewMode == LibraryViewMode.list) {
      return ListView.separated(
        padding: const EdgeInsets.fromLTRB(14, 4, 14, 100),
        itemCount: items.length,
        separatorBuilder: (_, _) => const SizedBox(height: 10),
        itemBuilder: (context, index) {
          final item = items[index];
          return MediaListTile(
            item: item,
            onOpen: () => onOpen(item),
            onFavorite: () => onFavorite(item),
            onRemove: () => onRemove(item),
          );
        },
      );
    }

    return GridView.builder(
      padding: const EdgeInsets.fromLTRB(14, 4, 14, 100),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: .58,
        crossAxisSpacing: 12,
        mainAxisSpacing: 18,
      ),
      itemCount: items.length,
      itemBuilder: (context, index) {
        final item = items[index];
        return MediaCard(
          item: item,
          onOpen: () => onOpen(item),
          onFavorite: () => onFavorite(item),
          onRemove: () => onRemove(item),
        );
      },
    );
  }
}
