import 'dart:io';

abstract final class AppConfig {
  static const ownerUid = 'zYIbbfB5YpfCG6KHLJMpVlhT3B62';
  static const _definedApiBaseUrl = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_definedApiBaseUrl.isNotEmpty) return _definedApiBaseUrl;
    return Platform.isAndroid ? 'https://ernklyc.dev' : 'http://127.0.0.1:4173';
  }
}
