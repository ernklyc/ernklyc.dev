// Firestore'a örnek/ilk blog yazısını ekleyen tek seferlik script.
// Kullanım: node scripts/seed-blog-post.mjs
//
// NOT: Bu script'in çalışması için Firestore güvenlik kurallarının
// GEÇİCİ olarak yazmaya izin vermesi gerekir (Firebase Console -> Firestore
// -> Rules -> "allow read, write: if true;"). Script bittikten sonra
// kuralları tekrar güvenli haline (firestore.rules dosyasındaki gibi) döndür.

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, Timestamp } from "firebase/firestore";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "..", ".env.local");

function loadEnv(path) {
  if (!existsSync(path)) {
    console.error(`.env.local bulunamadı: ${path}`);
    process.exit(1);
  }
  const content = readFileSync(path, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}

const env = loadEnv(envPath);

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("Firebase config .env.local içinde bulunamadı. Önce Firebase kurulumunu tamamla.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const post = {
  title: "Bu Bloga Hoş Geldiniz",
  slug: "hos-geldiniz",
  excerpt:
    "Bu blogda geliştirdiğim projeler hakkında devlog paylaşımları yapacağım ve araştırdığım konuları anlatacağım.",
  content: `# Merhaba!

Bu blog, geliştirdiğim projeler üzerine **devlog** paylaşımları yapmak ve araştırdığım konuları anlatmak için açıldı.

## Neler paylaşacağım?

- Flutter/Firebase üzerine öğrendiklerim
- Geliştirdiğim uygulamaların arka planı
- Zaman zaman küçük teknik notlar

Takipte kalın!`,
  tags: ["Devlog"],
  status: "published",
  publishedAt: Timestamp.now(),
};

try {
  const ref = await addDoc(collection(db, "posts"), post);
  console.log(`✅ Yazı eklendi. Doküman ID: ${ref.id}`);
  console.log(`   Site: /blog/${post.slug}`);
  process.exit(0);
} catch (error) {
  console.error("❌ Yazı eklenemedi:", error.message);
  console.error("   Firestore Rules geçici olarak yazmaya izin veriyor mu kontrol et.");
  process.exit(1);
}
