import 'package:flutter/material.dart';
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
              ? () => setState(
                  () => episodes ??= api.episodes(widget.item.tmdbId),
                )
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
              if (onLoadEpisodes != null) ...[
                const SizedBox(height: 22),
                episodes == null
                    ? OutlinedButton.icon(
                        onPressed: onLoadEpisodes,
                        icon: const Icon(Icons.table_rows_rounded),
                        label: const Text('Bölüm puanlarını yükle'),
                      )
                    : _EpisodeHeatmap(future: episodes!),
              ],
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
    final items = <MapEntry<String, String>>[
      if (directors.isNotEmpty) MapEntry('Yönetmen', directors),
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
  const _EpisodeHeatmap({required this.future});
  final Future<List<Map<String, dynamic>>> future;

  @override
  Widget build(
    BuildContext context,
  ) => FutureBuilder<List<Map<String, dynamic>>>(
    future: future,
    builder: (context, snapshot) {
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
