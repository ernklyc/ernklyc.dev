import 'package:flutter/material.dart';
import '../models/library_item.dart';

class MediaCard extends StatelessWidget {
  const MediaCard({
    super.key,
    required this.item,
    required this.onFavorite,
    required this.onPublic,
    required this.onRemove,
    required this.onOpen,
  });

  final LibraryItem item;
  final VoidCallback onFavorite;
  final VoidCallback onPublic;
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
                    'https://image.tmdb.org/t/p/w500${item.posterPath}',
                    fit: BoxFit.cover,
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
                      if (value == 'public') onPublic();
                      if (value == 'remove') onRemove();
                    },
                    itemBuilder: (_) => [
                      PopupMenuItem(
                        value: 'public',
                        child: Text(
                          item.isPublic ? 'Gizliye al' : 'Herkese aç',
                        ),
                      ),
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
        '${item.year ?? '—'}${item.isPublic ? '  ·  Herkese açık' : ''}',
        maxLines: 1,
        style: TextStyle(
          fontSize: 12,
          color: item.isPublic ? Colors.greenAccent.shade100 : Colors.white38,
        ),
      ),
    ],
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
