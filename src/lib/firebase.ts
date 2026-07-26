import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Firebase app'i tek bir kez başlatır (Next.js'te hot-reload ve server/client
 * render'lar sırasında birden fazla initializeApp çağrısını önlemek için).
 */
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);

/**
 * Auth sadece client tarafında kullanılır (admin panel login).
 * SSR sırasında da güvenle çağrılabilir çünkü getAuth window'a dokunmaz,
 * asıl window bağımlılığı onAuthStateChanged/signIn çağrılarında devreye girer.
 */
export const auth = getAuth(firebaseApp);

/**
 * App Check (reCAPTCHA v3) — sadece tarayıcıda başlatılabilir, SSR'da
 * çalıştırılırsa hata verir. Firestore/Auth isteklerine görünmez bir bot
 * doğrulama katmanı ekler; Console'da "Enforce" moduna geçilmeden önce
 * sadece izleme (monitoring) modunda çalışır, mevcut kullanıcıyı etkilemez.
 *
 * Yerelde (localhost) test edebilmek için sabit bir debug token kullanılır
 * (NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN) — `true` verirsek her sayfa
 * yenilemesinde yeni bir rastgele token üretilir ve Console'a eklediğimiz
 * token ile hiç eşleşmez. Sabit değeri Firebase Console > App Check >
 * Apps > (⋮ menüsü) > "Manage debug tokens" kısmına bir kez eklemek yeterli.
 */
const recaptchaSiteKey = process.env.NEXT_PUBLIC_FIREBASE_RECAPTCHA_SITE_KEY;

if (typeof window !== "undefined" && recaptchaSiteKey) {
  if (process.env.NODE_ENV === "development") {
    (window as unknown as { FIREBASE_APPCHECK_DEBUG_TOKEN?: string | boolean }).FIREBASE_APPCHECK_DEBUG_TOKEN =
      process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN || true;
  }
  initializeAppCheck(firebaseApp, {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}
