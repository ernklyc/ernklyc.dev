import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final email = TextEditingController(text: 'ernklyc@gmail.com');
  final password = TextEditingController();
  bool loading = false;
  bool googleLoading = false;
  String? error;

  @override
  void dispose() {
    email.dispose();
    password.dispose();
    super.dispose();
  }

  Future<void> login() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      await FirebaseAuth.instance.signInWithEmailAndPassword(
        email: email.text.trim(),
        password: password.text,
      );
    } on FirebaseAuthException catch (exception) {
      setState(
        () => error = exception.code == 'invalid-credential'
            ? 'E-posta veya şifre hatalı.'
            : 'Giriş yapılamadı: ${exception.code}',
      );
    } finally {
      if (mounted) setState(() => loading = false);
    }
  }

  Future<void> loginWithGoogle() async {
    setState(() {
      googleLoading = true;
      error = null;
    });
    try {
      final googleUser = await GoogleSignIn().signIn();
      if (googleUser == null) {
        setState(() => error = 'Google girişi iptal edildi.');
        return;
      }

      final googleAuth = await googleUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );
      await FirebaseAuth.instance.signInWithCredential(credential);
    } on FirebaseAuthException catch (exception) {
      setState(
        () => error = exception.code == 'account-exists-with-different-credential'
            ? 'Bu mail farklı giriş yöntemiyle kayıtlı. Önce mevcut yöntemle girip Google hesabını bağlamak gerekiyor.'
            : 'Google ile giriş yapılamadı: ${exception.code}',
      );
    } catch (exception) {
      setState(() => error = 'Google ile giriş yapılamadı.');
    } finally {
      if (mounted) setState(() => googleLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Icon(
                  Icons.movie_filter_rounded,
                  size: 54,
                  color: Color(0xFFA9B7C4),
                ),
                const SizedBox(height: 24),
                Text(
                  'MoTLog',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Movie & TV Series Logger',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Colors.white54),
                ),
                const SizedBox(height: 32),
                OutlinedButton.icon(
                  onPressed: loading || googleLoading ? null : loginWithGoogle,
                  icon: googleLoading
                      ? const SizedBox.square(
                          dimension: 18,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text(
                          'G',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            color: Color(0xFFFFD54A),
                          ),
                        ),
                  label: const Padding(
                    padding: EdgeInsets.all(14),
                    child: Text('Google ile giriş yap'),
                  ),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                ),
                const SizedBox(height: 18),
                const Row(
                  children: [
                    Expanded(child: Divider(color: Colors.white12)),
                    Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12),
                      child: Text('veya e-posta', style: TextStyle(color: Colors.white38)),
                    ),
                    Expanded(child: Divider(color: Colors.white12)),
                  ],
                ),
                const SizedBox(height: 18),
                TextField(
                  controller: email,
                  keyboardType: TextInputType.emailAddress,
                  decoration: const InputDecoration(labelText: 'E-posta'),
                ),
                const SizedBox(height: 14),
                TextField(
                  controller: password,
                  obscureText: true,
                  onSubmitted: (_) => login(),
                  decoration: const InputDecoration(labelText: 'Şifre'),
                ),
                if (error != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 14),
                    child: Text(
                      error!,
                      style: const TextStyle(color: Colors.redAccent),
                    ),
                  ),
                const SizedBox(height: 20),
                FilledButton(
                  onPressed: loading || googleLoading ? null : login,
                  child: Padding(
                    padding: const EdgeInsets.all(14),
                    child: loading
                        ? const SizedBox.square(
                            dimension: 20,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Text('Giriş yap'),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}
