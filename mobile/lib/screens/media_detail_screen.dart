import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/library_item.dart';
import '../services/movie_api_service.dart';

class MediaDetailScreen extends StatefulWidget {
  const MediaDetailScreen({super.key, required this.item});
  final LibraryItem item;

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

  @override
  Widget build(BuildContext context) => Scaffold(
    body: FutureBuilder<Map<String, dynamic>>(
      future: details,
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return _ErrorState(message: snapshot.error.toString());
        }
        if (!snapshot.hasData) {
          return const Center(child: CircularProgressIndicator());
        }
        return _DetailBody(
          item: widget.item,
          data: snapshot.data!,
          episodes: episodes,
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
  });
  final LibraryItem item;
  final Map<String, dynamic> data;
  final Future<List<Map<String, dynamic>>>? episodes;
  final VoidCallback? onLoadEpisodes;

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
    final cast = List<Map<String, dynamic>>.from(
      credits['cast'] as List? ?? const [],
    );
    final crew = List<Map<String, dynamic>>.from(
      credits['crew'] as List? ?? const [],
    );
    final genres = List<Map<String, dynamic>>.from(
      metadata['genres'] as List? ?? const [],
    );
    final rating = data['imdbRating'] as Map<String, dynamic>?;
    final providersRoot = metadata['watch/providers'] as Map?;
    final providerResults = providersRoot?['results'] as Map?;
    final tr = providerResults?['TR'] as Map?;
    final providers = <Map<String, dynamic>>[
      ...List<Map<String, dynamic>>.from(tr?['flatrate'] as List? ?? const []),
      ...List<Map<String, dynamic>>.from(tr?['rent'] as List? ?? const []),
      ...List<Map<String, dynamic>>.from(tr?['buy'] as List? ?? const []),
    ];
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
    final seasons = item.mediaType == MediaType.tv
        ? _maps(metadata['seasons'])
        : <Map<String, dynamic>>[];
    final tagline = (metadata['tagline'] as String?) ?? '';
    final title = (metadata['title'] ?? metadata['name'] ?? item.title)
        .toString();
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
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  _Pill(item.mediaType == MediaType.movie ? 'Film' : 'Dizi'),
                  if (metadata['release_date'] != null ||
                      metadata['first_air_date'] != null)
                    _Pill(
                      (metadata['release_date'] ?? metadata['first_air_date'])
                          .toString(),
                    ),
                  ...genres.map((genre) => _Pill(genre['name'].toString())),
                ],
              ),
              if (rating != null) ...[
                const SizedBox(height: 14),
                _RatingLine(rating: rating),
              ],
              if (trailer['key'] != null) ...[
                const SizedBox(height: 14),
                FilledButton.icon(
                  onPressed: () => _open(
                    'https://www.youtube.com/watch?v=${trailer['key']}',
                  ),
                  icon: const Icon(Icons.play_arrow_rounded),
                  label: const Text('Fragman'),
                ),
              ],
              if (tagline.isNotEmpty) ...[
                const SizedBox(height: 14),
                Text(
                  '“$tagline”',
                  style: const TextStyle(
                    fontStyle: FontStyle.italic,
                    color: Colors.white54,
                  ),
                ),
              ],
              const SizedBox(height: 20),
              const _Heading('Hikâye'),
              Text(
                (metadata['overview'] as String?)?.isNotEmpty == true
                    ? metadata['overview'] as String
                    : 'Türkçe açıklama bulunmuyor.',
                style: const TextStyle(height: 1.65, color: Colors.white70),
              ),
              const SizedBox(height: 20),
              _Facts(metadata: metadata, crew: crew),
              const SizedBox(height: 22),
              _PeopleRow(title: 'Oyuncular · ${cast.length}', people: cast),
              if (crew.isNotEmpty) ...[
                const SizedBox(height: 14),
                _CompactPanel(
                  title: 'Yapım ekibi · ${crew.length}',
                  child: _PeopleRow(title: 'Ekip', people: crew, compact: true),
                ),
              ],
              if (providers.isNotEmpty) ...[
                const SizedBox(height: 22),
                const _Heading('Türkiye’de izle'),
                SizedBox(
                  height: 72,
                  child: ListView.separated(
                    scrollDirection: Axis.horizontal,
                    itemCount: providers.length,
                    separatorBuilder: (_, _) => const SizedBox(width: 10),
                    itemBuilder: (_, index) {
                      final provider = providers[index];
                      return Chip(
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
                      );
                    },
                  ),
                ),
              ],
              if (keywords.isNotEmpty) ...[
                const SizedBox(height: 22),
                _Heading('Anahtar kelimeler · ${keywords.length}'),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: keywords
                      .map((k) => _Pill(k['name'].toString()))
                      .toList(),
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
                        onTap: () => _open(
                          'https://www.youtube.com/watch?v=${video['key']}',
                        ),
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
                                  image(
                                    season['poster_path'] as String,
                                    'w185',
                                  )!,
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
                                style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Text(
                                [
                                  '${season['episode_count'] ?? 0} bölüm',
                                  if (season['air_date'] != null)
                                    season['air_date'].toString(),
                                ].join(' · '),
                                style: const TextStyle(
                                  fontSize: 12,
                                  color: Colors.white38,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
              if (onLoadEpisodes != null) ...[
                const SizedBox(height: 22),
                episodes == null
                    ? OutlinedButton.icon(
                        onPressed: onLoadEpisodes,
                        icon: const Icon(Icons.table_rows_rounded),
                        label: const Text('Bölüm puanlarını yükle'),
                      )
                    : _EpisodeHeatmap(
                        future: episodes!,
                        onRetry: onLoadEpisodes!,
                      ),
              ],
              const SizedBox(height: 22),
              _CompactPanel(
                title: 'Detay arşivi',
                child: _DetailArchive(
                  mediaType: item.mediaType,
                  metadata: metadata,
                  fetchedAt: data['fetchedAt'] as String?,
                  imdbId:
                      (metadata['external_ids'] as Map?)?['imdb_id']
                          as String? ??
                      item.imdbId,
                  tmdbId: item.tmdbId,
                  providerLink: tr?['link'] as String?,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _Facts extends StatelessWidget {
  const _Facts({required this.metadata, required this.crew});
  final Map<String, dynamic> metadata;
  final List<Map<String, dynamic>> crew;

  @override
  Widget build(BuildContext context) {
    final directors = crew
        .where((person) => person['job'] == 'Director')
        .map((person) => person['name'])
        .join(', ');
    final releaseDate = (metadata['release_date'] ?? metadata['first_air_date'])
        ?.toString();
    final productionCountries = _maps(
      metadata['production_countries'],
    ).map((c) => c['name'].toString()).toList();
    final countries =
        (productionCountries.isNotEmpty
                ? productionCountries
                : (metadata['origin_country'] as List? ?? const []).map(
                    (c) => c.toString(),
                  ))
            .join(', ');
    final creators = _maps(
      metadata['created_by'],
    ).map((c) => c['name'].toString()).join(', ');
    final certification = _certification(metadata);
    final items = <MapEntry<String, String>>[
      if (directors.isNotEmpty) MapEntry('Yönetmen', directors),
      if (directors.isEmpty && creators.isNotEmpty)
        MapEntry('Yaratıcı', creators),
      if (releaseDate != null && releaseDate.isNotEmpty)
        MapEntry('Yayın tarihi', releaseDate),
      if (countries.isNotEmpty) MapEntry('Ülke', countries),
      if (certification.isNotEmpty) MapEntry('Yaş sınırı', certification),
      if (metadata['status'] != null)
        MapEntry('Durum', metadata['status'].toString()),
      if (metadata['runtime'] != null)
        MapEntry('Süre', '${metadata['runtime']} dk'),
      if (metadata['number_of_seasons'] != null)
        MapEntry('Sezon', '${metadata['number_of_seasons']}'),
      if (metadata['number_of_episodes'] != null)
        MapEntry('Bölüm', '${metadata['number_of_episodes']}'),
      if (metadata['original_language'] != null)
        MapEntry('Dil', metadata['original_language'].toString().toUpperCase()),
      if ((metadata['external_ids'] as Map?)?['imdb_id'] != null)
        MapEntry(
          'IMDb ID',
          (metadata['external_ids'] as Map)['imdb_id'].toString(),
        ),
    ];
    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: items
          .map(
            (entry) => Container(
              width: 150,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: .04),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: Colors.white10),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    entry.key,
                    style: const TextStyle(fontSize: 11, color: Colors.white38),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    entry.value,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          )
          .toList(),
    );
  }
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

class _CompactPanel extends StatelessWidget {
  const _CompactPanel({required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) => Theme(
    data: Theme.of(context).copyWith(dividerColor: Colors.transparent),
    child: ExpansionTile(
      tilePadding: const EdgeInsets.symmetric(horizontal: 12),
      childrenPadding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
      collapsedBackgroundColor: Colors.white.withValues(alpha: .035),
      backgroundColor: Colors.white.withValues(alpha: .045),
      collapsedShape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(14),
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      children: [child],
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
        height: compact ? 164 : 190,
        child: ListView.separated(
          scrollDirection: Axis.horizontal,
          itemCount: people.length,
          separatorBuilder: (_, _) => const SizedBox(width: 10),
          itemBuilder: (_, index) {
            final person = people[index];
            final path = person['profile_path'] as String?;
            final width = compact ? 92.0 : 104.0;
            final height = compact ? 118.0 : 138.0;
            return SizedBox(
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
                    style: const TextStyle(fontSize: 11, color: Colors.white38),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    ],
  );
}

class _EpisodeHeatmap extends StatelessWidget {
  const _EpisodeHeatmap({required this.future, required this.onRetry});
  final Future<List<Map<String, dynamic>>> future;
  final VoidCallback onRetry;

  @override
  Widget build(
    BuildContext context,
  ) => FutureBuilder<List<Map<String, dynamic>>>(
    future: future,
    builder: (context, snapshot) {
      if (snapshot.hasError) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _Heading('Bölüm puanları'),
            Text(
              snapshot.error.toString().replaceFirst('Exception: ', ''),
              style: const TextStyle(color: Colors.redAccent),
            ),
            const SizedBox(height: 8),
            OutlinedButton.icon(
              onPressed: onRetry,
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Tekrar dene'),
            ),
          ],
        );
      }
      if (!snapshot.hasData) {
        return const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _Heading('Bölüm puanları'),
            LinearProgressIndicator(),
            SizedBox(height: 8),
            Text(
              'IMDb günlük verisi hazırlanıyor…',
              style: TextStyle(color: Colors.white38),
            ),
          ],
        );
      }
      final episodes = snapshot.data!;
      if (episodes.isEmpty) return const SizedBox.shrink();
      final seasons =
          episodes.map((e) => e['seasonNumber'] as int).toSet().toList()
            ..sort();
      final bySeason = {
        for (final season in seasons)
          season: episodes.where((e) => e['seasonNumber'] == season).toList()
            ..sort(
              (a, b) => (a['episodeNumber'] as int).compareTo(
                b['episodeNumber'] as int,
              ),
            ),
      };
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Heading('Bölüm puanları · ${episodes.length}'),
          ...seasons.map(
            (season) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.04),
                border: Border.all(color: Colors.white12),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Sezon $season',
                        style: const TextStyle(
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        '${bySeason[season]?.length ?? 0} bölüm',
                        style: const TextStyle(color: Colors.white38),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ...?bySeason[season]?.map((episode) {
                    final rating = (episode['averageRating'] as num).toDouble();
                    return Container(
                      margin: const EdgeInsets.only(bottom: 6),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.04),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 64,
                            child: Text(
                              'S$season · E${episode['episodeNumber']}',
                              style: const TextStyle(
                                color: Colors.white70,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ),
                          Container(
                            width: 48,
                            height: 34,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: _ratingColor(rating),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              rating.toStringAsFixed(1),
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 12,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: Text(
                              '${episode['numVotes']} oy · IMDb',
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white38,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Kaynak: IMDb non-commercial datasets',
            style: TextStyle(fontSize: 11, color: Colors.white30),
          ),
        ],
      );
    },
  );

  Color _ratingColor(double rating) {
    if (rating >= 9) return const Color(0xFF55A9DD);
    if (rating >= 8) return const Color(0xFF65BD7D);
    if (rating >= 7) return const Color(0xFFF2D15D);
    if (rating >= 6) return const Color(0xFFE9A84F);
    return const Color(0xFFD75B52);
  }
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

Future<void> _open(String url) =>
    launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

List<Map<String, dynamic>> _maps(Object? value) => value is List
    ? value.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList()
    : <Map<String, dynamic>>[];

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

String _money(num value) {
  final digits = value.round().toString();
  final grouped = digits.replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (_) => '.',
  );
  return '\$$grouped';
}

class _FactTile extends StatelessWidget {
  const _FactTile(this.label, this.value);
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Container(
    width: 150,
    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: .04),
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
        const SizedBox(height: 5),
        Text(value, maxLines: 3, overflow: TextOverflow.ellipsis),
      ],
    ),
  );
}

class _DetailArchive extends StatelessWidget {
  const _DetailArchive({
    required this.mediaType,
    required this.metadata,
    required this.fetchedAt,
    required this.imdbId,
    required this.tmdbId,
    required this.providerLink,
  });
  final MediaType mediaType;
  final Map<String, dynamic> metadata;
  final String? fetchedAt;
  final String? imdbId;
  final int tmdbId;
  final String? providerLink;

  @override
  Widget build(BuildContext context) {
    String join(Object? list, String key) => _maps(list)
        .map((e) => e[key]?.toString() ?? '')
        .where((e) => e.isNotEmpty)
        .join(', ');
    final languages = _maps(metadata['spoken_languages'])
        .map((e) => (e['name'] ?? e['english_name'])?.toString() ?? '')
        .where((e) => e.isNotEmpty)
        .join(', ');
    final budget = metadata['budget'];
    final revenue = metadata['revenue'];
    final ids = Map<String, dynamic>.from(
      metadata['external_ids'] as Map? ?? const {},
    );
    final facts = <MapEntry<String, String>>[
      if (metadata['last_air_date'] != null)
        MapEntry('Son yayın tarihi', metadata['last_air_date'].toString()),
      if (metadata['original_language'] != null)
        MapEntry(
          'Orijinal dil',
          metadata['original_language'].toString().toUpperCase(),
        ),
      if (languages.isNotEmpty) MapEntry('Konuşulan diller', languages),
      if (join(metadata['production_companies'], 'name').isNotEmpty)
        MapEntry(
          'Yapım şirketleri',
          join(metadata['production_companies'], 'name'),
        ),
      if (join(metadata['networks'], 'name').isNotEmpty)
        MapEntry('Kanallar / ağlar', join(metadata['networks'], 'name')),
      if (metadata['belongs_to_collection'] is Map)
        MapEntry(
          'Koleksiyon',
          (metadata['belongs_to_collection'] as Map)['name'].toString(),
        ),
      if (budget is num && budget > 0) MapEntry('Bütçe', _money(budget)),
      if (revenue is num && revenue > 0) MapEntry('Hasılat', _money(revenue)),
      if (mediaType == MediaType.tv)
        MapEntry(
          'Yapım devam ediyor mu?',
          metadata['in_production'] == true ? 'Evet' : 'Hayır',
        ),
      if (fetchedAt != null)
        MapEntry('Son güncelleme', fetchedAt!.split('T').first),
    ];
    final crewOrCreators = mediaType == MediaType.tv
        ? join(metadata['created_by'], 'name')
        : '';
    final links = <MapEntry<String, String>>[
      if (imdbId != null && imdbId!.isNotEmpty)
        MapEntry('IMDb', 'https://www.imdb.com/title/$imdbId/'),
      MapEntry('TMDB', 'https://www.themoviedb.org/${mediaType.name}/$tmdbId'),
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
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            if (crewOrCreators.isNotEmpty)
              _FactTile('Yaratıcı', crewOrCreators),
            ...facts.map((e) => _FactTile(e.key, e.value)),
          ],
        ),
        const SizedBox(height: 14),
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
