import 'dart:async';
import 'package:flutter/services.dart';

class ShareIntentService {
  static const _methods = MethodChannel('dev.ernklyc.movie_log/share');
  static const _events = EventChannel('dev.ernklyc.movie_log/share_events');

  Future<String?> initialText() async {
    try {
      return await _methods.invokeMethod<String>('getInitialSharedText');
    } on MissingPluginException {
      return null;
    }
  }

  Stream<String> get sharedText => _events
      .receiveBroadcastStream()
      .where((event) => event is String)
      .cast<String>();

  static String? imdbIdFrom(String value) =>
      RegExp(r'\btt\d{7,10}\b').firstMatch(value)?.group(0);
}
