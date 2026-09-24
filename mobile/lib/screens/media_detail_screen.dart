import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/library_item.dart';
import '../services/movie_api_service.dart';

class MediaDetailScreen extends StatefulWidget {
  const MediaDetailScreen({
    super.key,
    required this.item,
    this.onAdd,
    this.alreadyAdded = false,
  });
  final LibraryItem item;

  /// Arama sonucundan açıldığında arşive ekleme; true dönerse yapım artık arşivde.
  final Future<bool> Function()? onAdd;
  final bool alreadyAdded;

  @override
  State<MediaDetailScreen> createState() => _MediaDetailScreenState();
}

class _MediaDetailScreenState extends State<MediaDetailScreen> {
  final api = MovieApiService();
  late final Future<Map<String, dynamic>> details = api.details(
    widget.item.tmdbId,
    widget.item.mediaType.name,
  );
  Future<List<Map<String, dynamic>>>? episodes;
  Future<Map<String, dynamic>>? guide;
  late bool added = widget.alreadyAdded;
  bool adding = false;

  Future<void> _add() async {
    if (adding || added || widget.onAdd == null) return;
    setState(() => adding = true);
    try {
      final result = await widget.onAdd!();
      if (mounted) setState(() => added = result);
    } finally {
      if (mounted) setState(() => adding = false);
    }
  }

  Widget? get _addAction => widget.onAdd == null
      ? null
      : Padding(
          padding: const EdgeInsets.only(right: 10),
          child: FilledButton.icon(
            onPressed: added || adding ? null : _add,
            style: FilledButton.styleFrom(
              disabledBackgroundColor: Colors.white.withValues(alpha: .18),
              disabledForegroundColor: Colors.white,
            ),
            icon: adding
                ? const SizedBox.square(
                    dimension: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : Icon(added ? Icons.check : Icons.add),
            label: Text(added ? 'Arşivde' : 'Ekle'),
          ),
        );

  @override
  Widget build(BuildContext context) => Scaffold(
    body: FutureBuilder<Map<String, dynamic>>(
      future: details,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return _ErrorState(message: snapshot.error.toString());
        }
        if (!snapshot.hasData) {
          return Stack(
            children: [
              const Center(child: CircularProgressIndicator()),
              SafeArea(
                child: Row(
                  children: [const BackButton(), const Spacer(), ?_addAction],
                ),
              ),
            ],
          );
        }
        return _DetailBody(
          item: widget.item,
          data: snapshot.data!,
          episodes: episodes,
          topAction: _addAction,
          guide: guide,
          onLoadGuide: () {
            setState(() {
              guide = api.parentsGuide(
                widget.item.tmdbId,
                widget.item.mediaType.name,
              );
            });
          },
          onLoadEpisodes: widget.item.mediaType == MediaType.tv
              ? () {
                  setState(() {
                    episodes = api.episodes(widget.item.tmdbId);
                  });
                }
              : null,
        );
      },
    ),
  );
}

class _DetailBody extends StatelessWidget {
  const _DetailBody({
    required this.item,
    required this.data,
    required this.episodes,
    required this.onLoadEpisodes,
    required this.topAction,
    required this.guide,
    required this.onLoadGuide,
  });
  final LibraryItem item;
  final Map<String, dynamic> data;
  final Future<List<Map<String, dynamic>>>? episodes;
  final VoidCallback? onLoadEpisodes;
  final Widget? topAction;
  final Future<Map<String, dynamic>>? guide;
  final VoidCallback onLoadGuide;

  String? image(String? path, [String size = 'w780']) =>
      path == null ? null : 'https://image.tmdb.org/t/p/$size$path';

  @override
  Widget build(BuildContext context) {
    final metadata = Map<String, dynamic>.from(
      data['metadata'] as Map? ?? const {},
    );
    final credits = Map<String, dynamic>.from(
      data['credits'] as Map? ?? const {},
    );
    final cast = _maps(credits['cast']);
    final crew = _maps(credits['crew']);
    final genres = _maps(metadata['genres']);
    final isMovie = item.mediaType == MediaType.movie;
    final directors = crew.where((p) => p['job'] == 'Director').toList();
    final creators = _maps(metadata['created_by']);
    final allCrew = _uniquePeople([
      ...(isMovie ? directors : creators),
      ...crew,
    ]);
    final rating =
        data['imdbRating'] as Map<String, dynamic>? ??
        (item.imdbRating == null
            ? null
            : <String, dynamic>{
                'averageRating': item.imdbRating,
                'numVotes': item.imdbVotes ?? 0,
              });
    final providersRoot = metadata['watch/providers'] as Map?;
    final tr = (providersRoot?['results'] as Map?)?['TR'] as Map?;
    final providers = _uniqueProviders([
      ..._maps(tr?['flatrate']),
      ..._maps(tr?['rent']),
      ..._maps(tr?['buy']),
    ]);
    final videos = _maps((metadata['videos'] as Map?)?['results'])
        .where(
          (v) =>
              v['site'] == 'YouTube' &&
              (v['official'] == true || v['type'] == 'Trailer'),
        )
        .toList();
    final trailer = videos.firstWhere(
      (v) => v['type'] == 'Trailer',
      orElse: () => videos.isEmpty ? <String, dynamic>{} : videos.first,
    );
    final keywordsRoot = metadata['keywords'] as Map?;
    final keywords = _maps(
      keywordsRoot?['keywords'] ?? keywordsRoot?['results'],
    );
    final imagesRoot = metadata['images'] as Map?;
    final gallery = [
      ..._maps(imagesRoot?['backdrops']),
      ..._maps(imagesRoot?['posters']),
    ];
    final seasons = isMovie
        ? <Map<String, dynamic>>[]
        : _maps(metadata['seasons']);
    final tagline = (metadata['tagline'] as String?) ?? '';
    final title = (metadata['title'] ?? metadata['name'] ?? item.title)
        .toString();
    final originalTitle =
        (metadata['original_title'] ?? metadata['original_name'])?.toString();
    final releaseDate = (metadata['release_date'] ?? metadata['first_air_date'])
        ?.toString();
    final runtimeRaw =
        metadata['runtime'] ??
        ((metadata['episode_run_time'] as List?)?.isNotEmpty == true
            ? (metadata['episode_run_time'] as List).first
            : null);
    final runtime = runtimeRaw is num && runtimeRaw > 0
        ? runtimeRaw.toInt()
        : null;
    final imdbId =
        (metadata['external_ids'] as Map?)?['imdb_id'] as String? ??
        item.imdbId;
    final certification = _certification(metadata);
    final countries = _countries(metadata);
    final backdrop = image(metadata['backdrop_path'] as String?, 'w1280');
    final poster = image(
      metadata['poster_path'] as String? ?? item.posterPath,
      'w500',
    );

    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 280,
          pinned: true,
          actions: [?topAction],
          flexibleSpace: FlexibleSpaceBar(
            title: Text(title, maxLines: 1, overflow: TextOverflow.ellipsis),
            background: Stack(
              fit: StackFit.expand,
              children: [
                if (backdrop != null)
                  Image.network(
                    backdrop,
                    fit: BoxFit.cover,
                    cacheWidth: 1080,
                    filterQuality: FilterQuality.low,
                  ),
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.black26, Colors.black87],
                    ),
                  ),
                ),
                if (poster != null)
                  Align(
                    alignment: const Alignment(-.78, .16),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(14),
                      child: Image.network(
                        poster,
                        width: 96,
                        height: 144,
                        fit: BoxFit.cover,
                        cacheWidth: 240,
                        cacheHeight: 360,
                        filterQuality: FilterQuality.low,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          sliver: SliverList.list(
            children: [
              if (originalTitle != null &&
                  originalTitle.isNotEmpty &&
                  originalTitle != title) ...[
                Text(
                  originalTitle,
                  style: const TextStyle(color: Colors.white54),
                ),
                const SizedBox(height: 10),
              ],
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _Pill(isMovie ? 'Film' : 'Dizi'),
                  if (releaseDate != null && releaseDate.isNotEmpty)
                    _Pill(_formatDate(releaseDate)),
                  if (runtime != null) _Pill(_formatRuntime(runtime)),
                  if (metadata['number_of_seasons'] != null)
                    _Pill('${metadata['number_of_seasons']} sezon'),
                  if (metadata['number_of_episodes'] != null)
                    _Pill('${metadata['number_of_episodes']} bölüm'),
                  ...genres.map((genre) => _Pill(genre['name'].toString())),
                ],
              ),
              if (rating != null || trailer['key'] != null) ...[
                const SizedBox(height: 14),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: [
                    if (rating != null) _RatingLine(rating: rating),
                    if (trailer['key'] != null)
                      FilledButton.icon(
                        onPressed: () => _open(
                          'https://www.youtube.com/watch?v=${trailer['key']}',
                        ),
                        icon: const Icon(Icons.play_arrow_rounded),
                        label: const Text('Fragman'),
                      ),
                  ],
                ),
              ],
              if (tagline.isNotEmpty) ...[
                const SizedBox(height: 14),
                Text(
                  '“$tagline”',
                  style: const TextStyle(
                    fontStyle: FontStyle.italic,
                    color: Colors.white60,
                    fontSize: 16,
                  ),
                ),
              ],
              const SizedBox(height: 20),
              const _Heading('Hikâye'),
              Text(
                (metadata['overview'] as String?)?.isNotEmpty == true
                    ? metadata['overview'] as String
                    : 'Türkçe açıklama henüz bulunmuyor.',
                style: const TextStyle(height: 1.65, color: Colors.white70),
              ),
              const SizedBox(height: 20),
              _FactGrid([
                MapEntry(
                  isMovie ? 'Yönetmen' : 'Yaratıcı',
                  (isMovie ? directors : creators)
                          .map((p) => p['name'].toString())
                          .join(', ')
                          .trim()
                          .isEmpty
                      ? '—'
                      : (isMovie ? directors : creators)
                            .map((p) => p['name'].toString())
                            .join(', '),
                ),
                MapEntry(
                  'Yayın tarihi',
                  releaseDate == null || releaseDate.isEmpty
                      ? '—'
                      : _formatDate(releaseDate),
                ),
                MapEntry('Durum', (metadata['status'] ?? '—').toString()),
                if (countries.isNotEmpty) MapEntry('Ülke', countries),
                if (certification.isNotEmpty)
                  MapEntry('Yaş sınırı', certification),
                MapEntry('IMDb ID', imdbId ?? '—'),
              ]),
              const SizedBox(height: 22),
              _Heading('Oyuncular · ${cast.length}'),
              const _Subtitle('TMDB’de kayıtlı tüm oyuncular'),
              _PeopleRow(title: '', people: cast, compact: true),
              const SizedBox(height: 22),
              const _Heading('Türkiye’de izle'),
              if (providers.isEmpty)
                const Text(
                  'Türkiye için güncel sağlayıcı kaydı bulunamadı.',
                  style: TextStyle(color: Colors.white38),
                )
              else
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: providers
                      .map(
                        (provider) => Chip(
                          avatar: provider['logo_path'] == null
                              ? null
                              : ClipRRect(
                                  borderRadius: BorderRadius.circular(6),
                                  child: Image.network(
                                    image(
                                      provider['logo_path'] as String,
                                      'w92',
                                    )!,
                                    cacheWidth: 92,
                                    cacheHeight: 92,
                                    filterQuality: FilterQuality.low,
                                  ),
                                ),
                          label: Text(provider['provider_name'].toString()),
                        ),
                      )
                      .toList(),
                ),
              const SizedBox(height: 22),
              _GuidePanel(guide: guide, onLoad: onLoadGuide),
              if (onLoadEpisodes != null) ...[
                const SizedBox(height: 22),
                _EpisodesPanel(episodes: episodes, onLoad: onLoadEpisodes!),
              ],
              const SizedBox(height: 22),
              _Panel(
                title: 'Detay arşivi',
                subtitle: 'Ekip, teknik bilgiler, görseller ve dış bağlantılar',
                child: _DetailArchive(
                  isMovie: isMovie,
                  metadata: metadata,
                  fetchedAt: data['fetchedAt'] as String?,
                  imdbId: imdbId,
                  tmdbId: item.tmdbId,
                  providerLink: tr?['link'] as String?,
                  allCrew: allCrew,
                  keywords: keywords,
                  videos: videos,
                  gallery: gallery,
                  seasons: seasons,
                  image: image,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

/// Web'deki `CollapsibleSection` karşılığı: başlık + alt başlık + aç/kapa.
class _Panel extends StatelessWidget {
  const _Panel({
    required this.title,
    required this.child,
    this.subtitle,
    this.onExpansionChanged,
  });
  final String title;
  final String? subtitle;
  final Widget child;
  final ValueChanged<bool>? onExpansionChanged;

  @override
  Widget build(BuildContext context) => Theme(
    data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
    child: ExpansionTile(
      onExpansionChanged: onExpansionChanged,
      tilePadding: const EdgeInsets.symmetric(horizontal: 16),
      childrenPadding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      expandedAlignment: Alignment.centerLeft,
      expandedCrossAxisAlignment: CrossAxisAlignment.start,
      collapsedBackgroundColor: Colors.white.withValues(alpha: .03),
      backgroundColor: Colors.white.withValues(alpha: .04),
      collapsedShape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Colors.white10),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Colors.white10),
      ),
      title: Text(
        title,
        style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
      ),
      subtitle: subtitle == null
          ? null
          : Text(
              subtitle!,
              style: const TextStyle(fontSize: 12, color: Colors.white38),
            ),
      children: [child],
    ),
  );
}

class _Subtitle extends StatelessWidget {
  const _Subtitle(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 10),
    child: Text(
      text,
      style: const TextStyle(fontSize: 12, color: Colors.white38),
    ),
  );
}

class _FactGrid extends StatelessWidget {
  const _FactGrid(this.facts);
  final List<MapEntry<String, String>> facts;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, constraints) {
      final width = (constraints.maxWidth - 8) / 2;
      return Wrap(
        spacing: 8,
        runSpacing: 8,
        children: facts
            .map((fact) => _FactTile(fact.key, fact.value, width: width))
            .toList(),
      );
    },
  );
}

class _FactTile extends StatelessWidget {
  const _FactTile(this.label, this.value, {required this.width});
  final String label;
  final String value;
  final double width;

  @override
  Widget build(BuildContext context) => Container(
    width: width,
    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .03),
      borderRadius: BorderRadius.circular(14),
      border: Border.all(color: Colors.white10),
    ),
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: Colors.white38),
        ),
        const SizedBox(height: 6),
        Text(
          value,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
        ),
      ],
    ),
  );
}

/// Ebeveyn rehberi: DoesTheDogDie topluluk oyları, IMDb kategorileriyle gruplu.
class _GuidePanel extends StatelessWidget {
  const _GuidePanel({required this.guide, required this.onLoad});
  final Future<Map<String, dynamic>>? guide;
  final VoidCallback onLoad;

  @override
  Widget build(BuildContext context) => _Panel(
    title: 'Ebeveyn rehberi',
    subtitle: 'Topluluk oylarına göre içerik uyarıları · açınca yüklenir',
    onExpansionChanged: (open) {
      if (open && guide == null) onLoad();
    },
    child: guide == null
        ? const _GuideLoading()
        : FutureBuilder<Map<String, dynamic>>(
            future: guide,
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      snapshot.error.toString().replaceFirst('Exception: ', ''),
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: onLoad,
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Tekrar dene'),
                    ),
                  ],
                );
              }
              if (!snapshot.hasData) return const _GuideLoading();
              final data = snapshot.data!;
              if (data['available'] != true) {
                return const Text(
                  'Bu yapım için topluluk verisi bulunamadı (DoesTheDogDie).',
                  style: TextStyle(color: Colors.white38),
                );
              }
              final source = Map<String, dynamic>.from(
                data['source'] as Map? ?? const {},
              );
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Her konu için “var” ve “yok” diyen oy sayısı gösterilir. IMDb’deki gibi hafif/orta/şiddetli derecesi yoktur. Konuya dokunursan topluluk notları açılır; notlar spoiler içerebilir.',
                    style: TextStyle(
                      fontSize: 12,
                      height: 1.5,
                      color: Colors.white38,
                    ),
                  ),
                  const SizedBox(height: 12),
                  for (final category in _maps(data['categories']))
                    _GuideCategory(category: category),
                  const SizedBox(height: 4),
                  InkWell(
                    onTap: () => _open(source['url'].toString()),
                    child: Text(
                      'Veri: ${source['name']} · ${_thousands(source['votes'] as num? ?? 0)} oy · topluluk tarafından girilir, hatalı olabilir.',
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.white30,
                        decoration: TextDecoration.underline,
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
  );
}

class _GuideLoading extends StatelessWidget {
  const _GuideLoading();
  @override
  Widget build(BuildContext context) => const Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      LinearProgressIndicator(),
      SizedBox(height: 8),
      Text(
        'Ebeveyn rehberi yükleniyor…',
        style: TextStyle(color: Colors.white38),
      ),
    ],
  );
}

class _GuideCategory extends StatelessWidget {
  const _GuideCategory({required this.category});
  final Map<String, dynamic> category;

  @override
  Widget build(BuildContext context) {
    final topics = _maps(category['topics']);
    final status = category['status'] as String? ?? 'unknown';
    final (statusText, statusColor) = switch (status) {
      'present' => ('Var · ${topics.length} konu', const Color(0xFFF2D15D)),
      'none' => ('Bildirilmedi', const Color(0xFF65BD7D)),
      _ => ('Yeterli oy yok', Colors.white38),
    };
    final chip = Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: statusColor.withValues(alpha: .12),
        border: Border.all(color: statusColor.withValues(alpha: .35)),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        statusText,
        style: TextStyle(fontSize: 12, color: statusColor),
      ),
    );
    final title = Text(
      category['label'].toString(),
      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
    );
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Theme(
        data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
        child: topics.isEmpty
            ? Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 14,
                ),
                decoration: _guideBox,
                child: Row(
                  children: [
                    Expanded(child: title),
                    chip,
                  ],
                ),
              )
            : ExpansionTile(
                expandedAlignment: Alignment.centerLeft,
                expandedCrossAxisAlignment: CrossAxisAlignment.start,
                tilePadding: const EdgeInsets.symmetric(horizontal: 14),
                childrenPadding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
                collapsedBackgroundColor: Colors.white.withValues(alpha: .03),
                backgroundColor: Colors.white.withValues(alpha: .03),
                collapsedShape: _guideShape,
                shape: _guideShape,
                title: title,
                trailing: chip,
                children: [
                  for (final topic in topics) _GuideTopic(topic: topic),
                ],
              ),
      ),
    );
  }
}

final _guideShape = RoundedRectangleBorder(
  borderRadius: BorderRadius.circular(12),
  side: const BorderSide(color: Colors.white10),
);
final _guideBox = BoxDecoration(
  color: Colors.white.withValues(alpha: .03),
  borderRadius: BorderRadius.circular(12),
  border: Border.all(color: Colors.white10),
);

class _GuideTopic extends StatelessWidget {
  const _GuideTopic({required this.topic});
  final Map<String, dynamic> topic;

  @override
  Widget build(BuildContext context) {
    final notes = _maps(topic['notes']);
    final votes = Text(
      '${topic['yes']} evet · ${topic['no']} hayır',
      style: const TextStyle(fontSize: 11, color: Colors.white38),
    );
    final label = Text(
      topic['label'].toString(),
      style: const TextStyle(fontSize: 13, color: Colors.white70),
    );
    if (notes.isEmpty) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  label,
                  const SizedBox(height: 2),
                  const Text(
                    'Açıklama girilmemiş',
                    style: TextStyle(fontSize: 11, color: Colors.white24),
                  ),
                ],
              ),
            ),
            votes,
          ],
        ),
      );
    }
    return Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 8),
        childrenPadding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
        title: label,
        subtitle: Text(
          '${notes.length} topluluk notu · dokun',
          style: const TextStyle(fontSize: 11, color: Colors.white38),
        ),
        trailing: votes,
        expandedAlignment: Alignment.centerLeft,
        expandedCrossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final note in notes)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                '“${note['text']}”',
                style: const TextStyle(
                  fontSize: 12,
                  height: 1.5,
                  color: Colors.white54,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Web'deki "Bölüm puanları" bölümü: aç/kapa, açılınca yüklenir, sezonlar da aç/kapa.
class _EpisodesPanel extends StatelessWidget {
  const _EpisodesPanel({required this.episodes, required this.onLoad});
  final Future<List<Map<String, dynamic>>>? episodes;
  final VoidCallback onLoad;

  @override
  Widget build(BuildContext context) => _Panel(
    title: 'Bölüm puanları',
    subtitle: 'IMDb puanı · açınca yüklenir',
    onExpansionChanged: (open) {
      if (open && episodes == null) onLoad();
    },
    child: episodes == null
        ? const _EpisodesLoading()
        : FutureBuilder<List<Map<String, dynamic>>>(
            future: episodes,
            builder: (context, snapshot) {
              if (snapshot.hasError) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      snapshot.error.toString().replaceFirst('Exception: ', ''),
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                    const SizedBox(height: 8),
                    OutlinedButton.icon(
                      onPressed: onLoad,
                      icon: const Icon(Icons.refresh_rounded),
                      label: const Text('Tekrar dene'),
                    ),
                  ],
                );
              }
              if (!snapshot.hasData) return const _EpisodesLoading();
              final list = snapshot.data!;
              if (list.isEmpty) {
                return const Text(
                  'Bu dizi için IMDb bölüm puanı bulunamadı.',
                  style: TextStyle(color: Colors.white38),
                );
              }
              final seasons =
                  list.map((e) => e['seasonNumber'] as int).toSet().toList()
                    ..sort();
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${list.length} bölüm · satıra dokununca IMDb açılır',
                    style: const TextStyle(fontSize: 12, color: Colors.white38),
                  ),
                  const SizedBox(height: 10),
                  for (final season in seasons)
                    _SeasonRatings(
                      season: season,
                      episodes:
                          list
                              .where((e) => e['seasonNumber'] == season)
                              .toList()
                            ..sort(
                              (a, b) => (a['episodeNumber'] as int).compareTo(
                                b['episodeNumber'] as int,
                              ),
                            ),
                    ),
                  const SizedBox(height: 6),
                  const Text(
                    'Kaynak: IMDb non-commercial datasets. Puanlar günlük veri setinden gelir.',
                    style: TextStyle(fontSize: 11, color: Colors.white30),
                  ),
                ],
              );
            },
          ),
  );
}

class _EpisodesLoading extends StatelessWidget {
  const _EpisodesLoading();
  @override
  Widget build(BuildContext context) => const Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      LinearProgressIndicator(),
      SizedBox(height: 8),
      Text(
        'IMDb bölüm puanları yükleniyor… (ilk seferde biraz sürebilir)',
        style: TextStyle(color: Colors.white38),
      ),
    ],
  );
}

class _SeasonRatings extends StatelessWidget {
  const _SeasonRatings({required this.season, required this.episodes});
  final int season;
  final List<Map<String, dynamic>> episodes;

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Theme(
      data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
      child: ExpansionTile(
        expandedAlignment: Alignment.centerLeft,
        expandedCrossAxisAlignment: CrossAxisAlignment.start,
        initiallyExpanded: season == 1,
        tilePadding: const EdgeInsets.symmetric(horizontal: 12),
        childrenPadding: const EdgeInsets.fromLTRB(8, 0, 8, 8),
        collapsedBackgroundColor: Colors.white.withValues(alpha: .03),
        backgroundColor: Colors.white.withValues(alpha: .03),
        collapsedShape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: Colors.white10),
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: Colors.white10),
        ),
        title: Text(
          'Sezon $season',
          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
        ),
        trailing: Text(
          '${episodes.length} bölüm',
          style: const TextStyle(fontSize: 12, color: Colors.white38),
        ),
        children: [
          for (final episode in episodes)
            InkWell(
              borderRadius: BorderRadius.circular(10),
              onTap: () =>
                  _open('https://www.imdb.com/title/${episode['imdbId']}/'),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 5),
                child: Row(
                  children: [
                    SizedBox(
                      width: 68,
                      child: Text(
                        'S$season · E${episode['episodeNumber']}',
                        style: const TextStyle(
                          fontSize: 13,
                          color: Colors.white70,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    Container(
                      width: 46,
                      height: 34,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: _ratingColor(
                          (episode['averageRating'] as num).toDouble(),
                        ),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        (episode['averageRating'] as num).toStringAsFixed(1),
                        style: const TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.w800,
                          fontSize: 13,
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        '${_thousands(episode['numVotes'] as num)} oy · IMDb',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.white38,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    ),
  );
}

Color _ratingColor(double rating) {
  if (rating >= 9) return const Color(0xFF55A9DD);
  if (rating >= 8) return const Color(0xFF65BD7D);
  if (rating >= 7) return const Color(0xFFF2D15D);
  if (rating >= 6) return const Color(0xFFE9A84F);
  return const Color(0xFFD75B52);
}

/// Web'deki "Detay arşivi" ile aynı sıra: bilgiler, ekip, anahtar kelimeler,
/// videolar, görseller, sezonlar, dış bağlantılar.
class _DetailArchive extends StatelessWidget {
  const _DetailArchive({
    required this.isMovie,
    required this.metadata,
    required this.fetchedAt,
    required this.imdbId,
    required this.tmdbId,
    required this.providerLink,
    required this.allCrew,
    required this.keywords,
    required this.videos,
    required this.gallery,
    required this.seasons,
    required this.image,
  });
  final bool isMovie;
  final Map<String, dynamic> metadata;
  final String? fetchedAt;
  final String? imdbId;
  final int tmdbId;
  final String? providerLink;
  final List<Map<String, dynamic>> allCrew;
  final List<Map<String, dynamic>> keywords;
  final List<Map<String, dynamic>> videos;
  final List<Map<String, dynamic>> gallery;
  final List<Map<String, dynamic>> seasons;
  final String? Function(String? path, [String size]) image;

  String _names(Object? list, [String key = 'name']) => _maps(
    list,
  ).map((e) => e[key]?.toString() ?? '').where((e) => e.isNotEmpty).join(', ');

  @override
  Widget build(BuildContext context) {
    final languages = _maps(metadata['spoken_languages'])
        .map((e) => (e['name'] ?? e['english_name'])?.toString() ?? '')
        .where((e) => e.isNotEmpty)
        .join(', ');
    final budget = metadata['budget'];
    final revenue = metadata['revenue'];
    final ids = Map<String, dynamic>.from(
      metadata['external_ids'] as Map? ?? const {},
    );
    String orDash(String v) => v.isEmpty ? '—' : v;
    final facts = <MapEntry<String, String>>[
      if (metadata['last_air_date'] != null)
        MapEntry(
          'Son yayın tarihi',
          _formatDate(metadata['last_air_date'].toString()),
        ),
      MapEntry(
        'Orijinal dil',
        (metadata['original_language']?.toString().toUpperCase()) ?? '—',
      ),
      MapEntry('Konuşulan diller', orDash(languages)),
      MapEntry(
        'Yapım şirketleri',
        orDash(_names(metadata['production_companies'])),
      ),
      if (_names(metadata['networks']).isNotEmpty)
        MapEntry('Kanallar / ağlar', _names(metadata['networks'])),
      if (metadata['belongs_to_collection'] is Map)
        MapEntry(
          'Koleksiyon',
          (metadata['belongs_to_collection'] as Map)['name'].toString(),
        ),
      if (budget is num && budget > 0) MapEntry('Bütçe', _money(budget)),
      if (revenue is num && revenue > 0) MapEntry('Hasılat', _money(revenue)),
      if (!isMovie)
        MapEntry(
          'Yapım devam ediyor mu?',
          metadata['in_production'] == true ? 'Evet' : 'Hayır',
        ),
      MapEntry(
        'Son güncelleme',
        fetchedAt == null ? '—' : _formatDate(fetchedAt!),
      ),
    ];
    final links = <MapEntry<String, String>>[
      if (imdbId != null && imdbId!.isNotEmpty)
        MapEntry('IMDb', 'https://www.imdb.com/title/$imdbId/'),
      MapEntry(
        'TMDB',
        'https://www.themoviedb.org/${isMovie ? 'movie' : 'tv'}/$tmdbId',
      ),
      if (providerLink != null) MapEntry('İzleme seçenekleri', providerLink!),
      if (metadata['homepage'] is String &&
          (metadata['homepage'] as String).isNotEmpty)
        MapEntry('Resmî site', metadata['homepage'] as String),
      if (ids['wikidata_id'] != null)
        MapEntry(
          'Wikidata',
          'https://www.wikidata.org/wiki/${ids['wikidata_id']}',
        ),
      if (ids['instagram_id'] != null)
        MapEntry(
          'Instagram',
          'https://www.instagram.com/${ids['instagram_id']}/',
        ),
      if (ids['facebook_id'] != null)
        MapEntry('Facebook', 'https://www.facebook.com/${ids['facebook_id']}'),
      if (ids['twitter_id'] != null)
        MapEntry('X', 'https://x.com/${ids['twitter_id']}'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _FactGrid(facts),
        if (allCrew.isNotEmpty) ...[
          const SizedBox(height: 22),
          _Heading('Yapım ekibi · ${allCrew.length}'),
          const _Subtitle('TMDB’de kayıtlı tüm ekip'),
          _PeopleRow(title: '', people: allCrew, compact: true),
        ],
        if (keywords.isNotEmpty) ...[
          const SizedBox(height: 22),
          _Heading('Anahtar kelimeler · ${keywords.length}'),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: keywords.map((k) => _Pill(k['name'].toString())).toList(),
          ),
        ],
        if (videos.isNotEmpty) ...[
          const SizedBox(height: 22),
          _Heading('Videolar · ${videos.length}'),
          SizedBox(
            height: 84,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: videos.length,
              separatorBuilder: (_, _) => const SizedBox(width: 10),
              itemBuilder: (_, index) {
                final video = videos[index];
                return InkWell(
                  borderRadius: BorderRadius.circular(14),
                  onTap: () =>
                      _open('https://www.youtube.com/watch?v=${video['key']}'),
                  child: Container(
                    width: 220,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .04),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.play_circle_outline_rounded),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(
                            video['name'].toString(),
                            maxLines: 3,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
        if (gallery.isNotEmpty) ...[
          const SizedBox(height: 22),
          _Heading('Görseller · ${gallery.length}'),
          const _Subtitle('Backdrop ve posterler'),
          SizedBox(
            height: 140,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: gallery.length,
              separatorBuilder: (_, _) => const SizedBox(width: 10),
              itemBuilder: (_, index) {
                final path = gallery[index]['file_path'] as String?;
                if (path == null) return const SizedBox.shrink();
                return GestureDetector(
                  onTap: () => _open(image(path, 'original')!),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: Image.network(
                      image(path, 'w500')!,
                      height: 140,
                      fit: BoxFit.cover,
                      cacheHeight: 280,
                      filterQuality: FilterQuality.low,
                    ),
                  ),
                );
              },
            ),
          ),
        ],
        if (seasons.isNotEmpty) ...[
          const SizedBox(height: 22),
          _Heading(
            'Sezonlar · ${metadata['number_of_seasons'] ?? seasons.length}',
          ),
          ...seasons.map(
            (season) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: .03),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white10),
                ),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: season['poster_path'] == null
                          ? const SizedBox(
                              width: 48,
                              height: 72,
                              child: Icon(Icons.tv_rounded),
                            )
                          : Image.network(
                              image(season['poster_path'] as String, 'w185')!,
                              width: 48,
                              height: 72,
                              fit: BoxFit.cover,
                              cacheWidth: 120,
                              cacheHeight: 180,
                              filterQuality: FilterQuality.low,
                            ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            season['name'].toString(),
                            style: const TextStyle(fontWeight: FontWeight.w600),
                          ),
                          Text(
                            '${season['episode_count'] ?? 0} bölüm',
                            style: const TextStyle(
                              fontSize: 12,
                              color: Colors.white54,
                            ),
                          ),
                          if (season['air_date'] != null)
                            Text(
                              _formatDate(season['air_date'].toString()),
                              style: const TextStyle(
                                fontSize: 12,
                                color: Colors.white30,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
        const SizedBox(height: 14),
        const Divider(color: Colors.white10),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: links
              .map(
                (link) => ActionChip(
                  avatar: const Icon(Icons.open_in_new_rounded, size: 16),
                  label: Text(link.key),
                  onPressed: () => _open(link.value),
                ),
              )
              .toList(),
        ),
      ],
    );
  }
}

Future<void> _open(String url) =>
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

List<Map<String, dynamic>> _maps(Object? value) => value is List
    ? value.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList()
    : <Map<String, dynamic>>[];

List<Map<String, dynamic>> _uniquePeople(List<Map<String, dynamic>> people) {
  final seen = <String>{};
  return people
      .where(
        (p) => seen.add(
          '${p['id']}-${p['job'] ?? p['character'] ?? p['department'] ?? ''}',
        ),
      )
      .toList();
}

List<Map<String, dynamic>> _uniqueProviders(List<Map<String, dynamic>> list) {
  final seen = <Object?>{};
  return list.where((p) => seen.add(p['provider_id'])).toList();
}

String _countries(Map<String, dynamic> metadata) {
  final production = _maps(
    metadata['production_countries'],
  ).map((c) => c['name'].toString()).toList();
  if (production.isNotEmpty) return production.join(', ');
  return (metadata['origin_country'] as List? ?? const [])
      .map((c) => c.toString())
      .join(', ');
}

const _months = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

String _formatDate(String value) {
  final date = DateTime.tryParse(value);
  if (date == null) return value;
  return '${date.day} ${_months[date.month - 1]} ${date.year}';
}

String _formatRuntime(int minutes) {
  final hours = minutes ~/ 60;
  final rest = minutes % 60;
  return hours > 0 ? '$hours sa $rest dk' : '$rest dk';
}

String _thousands(num value) => value.round().toString().replaceAllMapped(
  RegExp(r'\B(?=(\d{3})+(?!\d))'),
  (_) => '.',
);

String _money(num value) => '\$${_thousands(value)}';

String _certification(Map<String, dynamic> metadata) {
  Map<String, dynamic>? pick(List<Map<String, dynamic>> list) {
    for (final code in const ['TR', 'US']) {
      for (final entry in list) {
        if (entry['iso_3166_1'] == code) return entry;
      }
    }
    return null;
  }

  final tv = pick(_maps((metadata['content_ratings'] as Map?)?['results']));
  final tvRating = tv?['rating'];
  if (tvRating is String && tvRating.isNotEmpty) return tvRating;

  final movie = pick(_maps((metadata['release_dates'] as Map?)?['results']));
  for (final release in _maps(movie?['release_dates'])) {
    final cert = release['certification'];
    if (cert is String && cert.isNotEmpty) return cert;
  }
  return '';
}

class _RatingLine extends StatelessWidget {
  const _RatingLine({required this.rating});

  final Map<String, dynamic> rating;

  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    decoration: BoxDecoration(
      color: const Color(0xFFF5C518).withValues(alpha: .1),
      border: Border.all(color: const Color(0xFFF5C518).withValues(alpha: .25)),
      borderRadius: BorderRadius.circular(14),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        const Icon(Icons.star, color: Color(0xFFF5C518), size: 20),
        const SizedBox(width: 6),
        Text(
          '${(rating['averageRating'] as num).toStringAsFixed(1)} IMDb',
          style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w800),
        ),
        const SizedBox(width: 8),
        Text(
          '${rating['numVotes']} oy',
          style: const TextStyle(fontSize: 12, color: Colors.white54),
        ),
      ],
    ),
  );
}

class _PeopleRow extends StatelessWidget {
  const _PeopleRow({
    required this.title,
    required this.people,
    this.compact = false,
  });
  final String title;
  final List<Map<String, dynamic>> people;
  final bool compact;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      if (!compact) _Heading(title),
      if (compact) const SizedBox(height: 4),
      SizedBox(
        height: compact ? 186 : 190,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: people.length,
          separatorBuilder: (_, _) => const SizedBox(width: 10),
          itemBuilder: (_, index) {
            final person = people[index];
            final path = person['profile_path'] as String?;
            final width = compact ? 92.0 : 104.0;
            final height = compact ? 118.0 : 138.0;
            return InkWell(
              borderRadius: BorderRadius.circular(12),
              onTap: person['id'] == null
                  ? null
                  : () => _open(
                      'https://www.themoviedb.org/person/${person['id']}',
                    ),
              child: SizedBox(
                width: width,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: path == null
                          ? ColoredBox(
                              color: Color(0xFF151A20),
                              child: SizedBox(
                                width: width,
                                height: height,
                                child: const Icon(Icons.person),
                              ),
                            )
                          : Image.network(
                              'https://image.tmdb.org/t/p/w342$path',
                              width: width,
                              height: height,
                              fit: BoxFit.cover,
                              cacheWidth: 180,
                              cacheHeight: 240,
                              filterQuality: FilterQuality.low,
                            ),
                    ),
                    const SizedBox(height: 7),
                    Text(
                      person['name'].toString(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    Text(
                      (person['character'] ??
                              person['job'] ??
                              person['department'] ??
                              '')
                          .toString(),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 11,
                        color: Colors.white38,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    ],
  );
}

class _Heading extends StatelessWidget {
  const _Heading(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.only(bottom: 12),
    child: Text(
      text,
      style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
    ),
  );
}

class _Pill extends StatelessWidget {
  const _Pill(this.text);
  final String text;
  @override
  Widget build(BuildContext context) =>
      Chip(label: Text(text), visualDensity: VisualDensity.compact);
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message});
  final String message;
  @override
  Widget build(BuildContext context) => SafeArea(
    child: Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 42),
            const SizedBox(height: 12),
            const Text('Detaylar alınamadı'),
            const SizedBox(height: 8),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: Colors.white38),
            ),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Geri dön'),
            ),
          ],
        ),
      ),
    ),
  );
}
