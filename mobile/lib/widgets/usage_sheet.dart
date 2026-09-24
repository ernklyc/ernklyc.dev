import 'package:flutter/material.dart';
import '../services/movie_api_service.dart';

/// Harici API'lerin aylık kalan kotası.
class UsageSheet extends StatefulWidget {
  const UsageSheet({super.key});
  @override
  State<UsageSheet> createState() => _UsageSheetState();
}

class _UsageSheetState extends State<UsageSheet> {
  final api = MovieApiService();
  late Future<Map<String, dynamic>> usage = api.usage();

  String _n(num value) => value.round().toString().replaceAllMapped(
    RegExp(r'\B(?=(\d{3})+(?!\d))'),
    (_) => '.',
  );

  @override
  Widget build(BuildContext context) => SafeArea(
    child: Padding(
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
      child: FutureBuilder<Map<String, dynamic>>(
        future: usage,
        builder: (context, snapshot) {
          final header = Row(
            children: [
              const Expanded(
                child: Text(
                  'API kullanımı',
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
                ),
              ),
              IconButton(
                tooltip: 'Yenile',
                onPressed: () => setState(() => usage = api.usage()),
                icon: const Icon(Icons.refresh_rounded),
              ),
            ],
          );
          if (snapshot.hasError) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                header,
                Text(
                  snapshot.error.toString().replaceFirst('Exception: ', ''),
                  style: const TextStyle(color: Colors.redAccent),
                ),
              ],
            );
          }
          if (!snapshot.hasData) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [header, const LinearProgressIndicator()],
            );
          }
          final data = snapshot.data!;
          final ddd = Map<String, dynamic>.from(data['ddd'] as Map);
          final used = (ddd['used'] as num).toInt();
          final limit = (ddd['limit'] as num).toInt();
          final remaining = (ddd['remaining'] as num).toInt();
          final ratio = limit == 0 ? 0.0 : (used / limit).clamp(0.0, 1.0);
          final color = ratio >= .9
              ? const Color(0xFFD75B52)
              : ratio >= .7
              ? const Color(0xFFE9A84F)
              : const Color(0xFF65BD7D);
          return Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              header,
              Text(
                '${data['month']} ayı · aylık kota',
                style: const TextStyle(fontSize: 12, color: Colors.white38),
              ),
              const SizedBox(height: 18),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      ddd['name'].toString(),
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                  ),
                  Text(
                    '${_n(remaining)} kaldı',
                    style: const TextStyle(fontWeight: FontWeight.w800),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: LinearProgressIndicator(
                  value: ratio.toDouble(),
                  minHeight: 10,
                  color: color,
                  backgroundColor: Colors.white12,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '${_n(used)} / ${_n(limit)} istek kullanıldı',
                style: const TextStyle(fontSize: 12, color: Colors.white54),
              ),
              const SizedBox(height: 12),
              Text(
                '${ddd['note']} TMDB’nin aylık kotası yoktur, bu yüzden gösterilmez.',
                style: const TextStyle(fontSize: 11, color: Colors.white30),
              ),
            ],
          );
        },
      ),
    ),
  );
}
