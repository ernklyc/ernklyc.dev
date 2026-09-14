import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../core/app_config.dart';
import '../models/library_item.dart';
import '../models/tmdb_search_item.dart';

class LibraryService {
  LibraryService({FirebaseFirestore? firestore})
    : _firestore = firestore ?? FirebaseFirestore.instance;
  final FirebaseFirestore _firestore;

  String get _uid {
    final uid = FirebaseAuth.instance.currentUser?.uid;
    if (uid != AppConfig.ownerUid) {
      throw StateError('Bu hesap arşivi değiştiremez.');
    }
    return uid!;
  }

  CollectionReference<Map<String, dynamic>> get _library =>
      _firestore.collection('users').doc(_uid).collection('library');

  Stream<List<LibraryItem>> watchLibrary() =>
      _library.snapshots().map((snapshot) {
        final items = snapshot.docs.map(LibraryItem.fromDocument).toList();
        items.sort((a, b) => b.id.compareTo(a.id));
        return items;
      });

  Future<bool> add(TmdbSearchItem media) =>
      _firestore.runTransaction((transaction) async {
        final reference = _library.doc(media.documentId);
        if ((await transaction.get(reference)).exists) return false;
        transaction.set(reference, media.toFirestore());
        return true;
      });

  Future<void> addMany(List<TmdbSearchItem> items) async {
    final unique = {for (final item in items) item.documentId: item};
    final missing = <TmdbSearchItem>[];

    for (var start = 0; start < unique.length; start += 30) {
      final chunk = unique.values.skip(start).take(30).toList();
      final ids = chunk.map((item) => item.documentId).toList();
      final existing = await _library
          .where(FieldPath.documentId, whereIn: ids)
          .get();
      final existingIds = existing.docs.map((item) => item.id).toSet();
      missing.addAll(
        chunk.where((item) => !existingIds.contains(item.documentId)),
      );
    }

    for (var start = 0; start < missing.length; start += 450) {
      final batch = _firestore.batch();
      for (final media in missing.skip(start).take(450)) {
        batch.set(_library.doc(media.documentId), media.toFirestore());
      }
      await batch.commit();
    }
  }

  Future<void> setFavorite(LibraryItem item, bool value) => _library
      .doc(item.id)
      .update({'favorite': value, 'updatedAt': FieldValue.serverTimestamp()});

  Future<void> setPublic(LibraryItem item, bool value) => _library
      .doc(item.id)
      .update({'isPublic': value, 'updatedAt': FieldValue.serverTimestamp()});

  Future<void> setManyPublic(List<LibraryItem> items, bool value) async {
    for (var start = 0; start < items.length; start += 450) {
      final batch = _firestore.batch();
      for (final item in items.skip(start).take(450)) {
        batch.update(_library.doc(item.id), {
          'isPublic': value,
          'updatedAt': FieldValue.serverTimestamp(),
        });
      }
      await batch.commit();
    }
  }

  Future<void> repairPublicAndRatings(
    List<LibraryItem> items,
    Map<String, double> ratings,
  ) async {
    final pending = items.where((item) {
      final rating = item.imdbId == null ? null : ratings[item.imdbId];
      return !item.isPublic || (rating != null && item.imdbRating == null);
    }).toList();
    if (pending.isEmpty) return;

    for (var start = 0; start < pending.length; start += 450) {
      final batch = _firestore.batch();
      for (final item in pending.skip(start).take(450)) {
        final rating = item.imdbId == null ? null : ratings[item.imdbId];
        final payload = <String, Object?>{
          'isPublic': true,
          'updatedAt': FieldValue.serverTimestamp(),
        };
        if (rating != null && item.imdbRating == null) {
          payload['snapshot.imdbRating'] = rating;
        }
        batch.update(_library.doc(item.id), payload);
      }
      await batch.commit();
    }
  }

  Future<void> remove(LibraryItem item) => _library.doc(item.id).delete();
}
