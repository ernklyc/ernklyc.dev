import 'package:flutter/material.dart';
import '../models/library_item.dart';

class MediaCard extends StatelessWidget {
  const MediaCard({
    super.key,
    required this.item,
    required this.onFavorite,
    required this.onRemove,
    required this.onOpen,
  });

  final LibraryItem item;
  final VoidCallback onFavorite;
  final VoidCallback onRemove;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Expanded(
        child: GestureDetector(
          onTap: onOpen,
          child: ClipRRect(
            borderRadius: BorderRadius.circular(18),
            child: Stack(
              fit: StackFit.expand,
              children: [
                if (item.posterPath != null)
                  Image.network(
                    'https://image.tmdb.org/t/p/w342${item.posterPath}',
                    fit: BoxFit.cover,
                    cacheWidth: 360,
                    cacheHeight: 540,
                    filterQuality: FilterQuality.low,
                    gaplessPlayback: true,
                  )
                else
                  const ColoredBox(
                    color: Color(0xFF151A20),
                    child: Icon(Icons.movie, size: 44),
                  ),
                const DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [
                        Colors.black12,
                        Colors.transparent,
                        Colors.black87,
                      ],
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  left: 8,
                  child: _Badge(
                    item.mediaType == MediaType.movie ? 'FİLM' : 'DİZİ',
                  ),
                ),
                if (item.imdbRating != null)
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: _RatingBadge(item.imdbRating!),
                  ),
                Positioned(
                  top: 4,
                  right: 4,
                  child: IconButton.filledTonal(
                    onPressed: onFavorite,
                    icon: Icon(
                      item.favorite ? Icons.favorite : Icons.favorite_border,
                      color: item.favorite ? Colors.redAccent : Colors.white,
                    ),
                  ),
                ),
                Positioned(
                  bottom: 6,
                  right: 6,
                  child: PopupMenuButton<String>(
                    onSelected: (value) {
                      if (value == 'remove') onRemove();
                    },
                    itemBuilder: (_) => [
                      const PopupMenuItem(
                        value: 'remove',
                        child: Text('Arşivden kaldır'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      const SizedBox(height: 9),
      Text(
        item.title,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: const TextStyle(fontWeight: FontWeight.w600),
      ),
      const SizedBox(height: 3),
      Text(
        '${item.year ?? '—'}',
        maxLines: 1,
        style: const TextStyle(fontSize: 12, color: Colors.white38),
      ),
    ],
  );
}

class MediaListTile extends StatelessWidget {
  const MediaListTile({
    super.key,
    required this.item,
    required this.onFavorite,
    required this.onRemove,
    required this.onOpen,
  });

  final LibraryItem item;
  final VoidCallback onFavorite;
  final VoidCallback onRemove;
  final VoidCallback onOpen;

  @override
  Widget build(BuildContext context) => InkWell(
    onTap: onOpen,
    borderRadius: BorderRadius.circular(16),
    child: Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.045),
        border: Border.all(color: Colors.white12),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: SizedBox(
              width: 58,
              height: 86,
              child: item.posterPath != null
                  ? Image.network(
                      'https://image.tmdb.org/t/p/w185${item.posterPath}',
                      fit: BoxFit.cover,
                      cacheWidth: 160,
                      cacheHeight: 240,
                      filterQuality: FilterQuality.low,
                      gaplessPlayback: true,
                    )
                  : const ColoredBox(
                      color: Color(0xFF151A20),
                      child: Icon(Icons.movie, size: 28),
                    ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    _Badge(item.mediaType == MediaType.movie ? 'FİLM' : 'DİZİ'),
                    _SmallLabel('${item.year ?? '—'}'),
                    if (item.imdbRating != null)
                      _SmallLabel(
                        'IMDb ${item.imdbRating!.toStringAsFixed(1)}',
                      ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              IconButton(
                onPressed: onFavorite,
                tooltip: 'Favori',
                icon: Icon(
                  item.favorite ? Icons.favorite : Icons.favorite_border,
                  color: item.favorite ? Colors.redAccent : Colors.white70,
                ),
              ),
              PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'remove') onRemove();
                },
                itemBuilder: (_) => [
                  const PopupMenuItem(
                    value: 'remove',
                    child: Text('Arşivden kaldır'),
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ),
  );
}

class _Badge extends StatelessWidget {
  const _Badge(this.text);
  final String text;
  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: Colors.black54,
      borderRadius: BorderRadius.circular(8),
      border: Border.all(color: Colors.white24),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.1,
        ),
      ),
    ),
  );
}

class _SmallLabel extends StatelessWidget {
  const _SmallLabel(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: Colors.white.withValues(alpha: 0.08),
      borderRadius: BorderRadius.circular(8),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      child: Text(
        text,
        style: const TextStyle(fontSize: 10, color: Colors.white60),
      ),
    ),
  );
}

class _RatingBadge extends StatelessWidget {
  const _RatingBadge(this.rating);
  final double rating;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      color: const Color(0xFFF5C518),
      borderRadius: BorderRadius.circular(9),
    ),
    child: Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 5),
      child: Text(
        '★ ${rating.toStringAsFixed(1)}',
        style: const TextStyle(
          color: Colors.black,
          fontSize: 11,
          fontWeight: FontWeight.w900,
        ),
      ),
    ),
  );
}
