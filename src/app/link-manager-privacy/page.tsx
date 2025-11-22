import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Manager - Gizlilik Politikası | Eren Kalaycı",
  description: "Link Manager mobil uygulaması gizlilik politikası ve kişisel verilerin korunması hakkında bilgiler.",
};

export default function LinkManagerPrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3441]/50 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              LINK MANAGER GİZLİLİK POLİTİKASI
            </h1>
            <p className="text-gray-400">Son Güncelleme: 2025</p>
            <a 
              href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-[#FF4655] hover:text-[#FF6B7A] transition-colors"
            >
              Play Store&apos;da Görüntüle →
            </a>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Bu Gizlilik Politikası, Link Manager mobil uygulamasının (&quot;Uygulama&quot;) kişisel verilerinizi nasıl topladığını, kullandığını, sakladığını ve paylaştığını açıklar. Uygulamayı kullanarak bu politikayı kabul etmiş sayılırsınız.
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">1. VERİ SORUMLUSU</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager uygulaması, verilerinizin sorumlusudur. Bu politika, uygulamanın veri işleme faaliyetlerini açıklar.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">2. TOPLANAN VERİLER</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.1. Kullanıcı İçeriği</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Eklediğiniz web bağlantıları (URL&apos;ler)</li>
                <li>Bağlantı başlıkları ve kategorileri</li>
                <li>Favori işaretlemeleri</li>
                <li>Kullanıcı tercihleri ve ayarları</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.2. Cihaz Bilgileri</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Cihaz Kimliği (Device ID): Abonelik durumunuzu kontrol etmek ve premium özelliklere erişiminizi yönetmek için kullanılır. Bu bilgi sadece uygulama içi premium durumu kontrolü için kullanılır ve üçüncü taraflarla paylaşılmaz.</li>
                <li>Cihaz modeli ve işletim sistemi bilgileri</li>
                <li>Uygulama sürümü</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.3. Kullanım Verileri</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulama içi etkileşimler ve kullanım istatistikleri</li>
                <li>Hata raporları ve çökme bilgileri (Crashlytics)</li>
                <li>Performans metrikleri</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">2.4. Abonelik Bilgileri</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Abonelik durumu ve geçmişi (RevenueCat üzerinden)</li>
                <li>Satın alma işlemleri (Google Play Store / Apple App Store üzerinden işlenir)</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">3. VERİ TOPLAMA YÖNTEMLERİ</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">3.1. Doğrudan Toplama</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulamayı kullanırken girdiğiniz bilgiler</li>
                <li>Uygulama ayarları ve tercihleri</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">3.2. Otomatik Toplama</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Firebase Analytics: Uygulama kullanım istatistikleri ve analitik veriler</li>
                <li>Firebase Crashlytics: Hata raporları ve uygulama çökme bilgileri</li>
                <li>RevenueCat: Abonelik durumu ve satın alma işlemleri</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">4. VERİ KULLANIM AMAÇLARI</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Topladığımız verileri aşağıdaki amaçlarla kullanırız:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.1. Hizmet Sağlama</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulamanın temel işlevlerini yerine getirmek</li>
                <li>Bağlantılarınızı saklamak ve organize etmek</li>
                <li>Premium özelliklere erişiminizi yönetmek</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.2. Abonelik Yönetimi</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Premium abonelik durumunuzu kontrol etmek</li>
                <li>Cihaz ID&apos;si kullanarak abonelik doğrulaması yapmak</li>
                <li>Satın alma işlemlerini işlemek</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.3. Uygulama İyileştirme</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Hataları tespit etmek ve düzeltmek (Crashlytics)</li>
                <li>Uygulama performansını analiz etmek (Firebase Analytics)</li>
                <li>Kullanıcı deneyimini geliştirmek</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">4.4. Güvenlik</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulama güvenliğini sağlamak</li>
                <li>Yetkisiz erişimleri önlemek</li>
                <li>Dolandırıcılık tespiti</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">5. VERİ PAYLAŞIMI</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">5.1. Üçüncü Taraf Hizmet Sağlayıcılar</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                Verileriniz aşağıdaki hizmet sağlayıcılarla paylaşılabilir:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Google Firebase (Analytics ve Crashlytics): Kullanım istatistikleri ve hata raporları</li>
                <li>RevenueCat: Abonelik yönetimi ve satın alma işlemleri</li>
                <li>Google Play Store / Apple App Store: Satın alma işlemleri (abonelik bilgileri)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">5.2. Yasal Zorunluluklar</h3>
              <p className="text-gray-300 leading-relaxed">
                Yasal yükümlülüklerimiz gereği, mahkeme kararı veya yasal süreçler kapsamında verileriniz paylaşılabilir.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">5.3. İş Ortaklıkları</h3>
              <p className="text-gray-300 leading-relaxed">
                Verileriniz, gizlilik standartlarımıza uygun iş ortaklarımızla paylaşılabilir, ancak bu durumda siz bilgilendirilirsiniz.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">6. VERİ GÜVENLİĞİ</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">6.1. Güvenlik Önlemleri</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verileriniz şifreleme teknolojileri ile korunur</li>
                <li>Güvenli sunucu altyapısı kullanılır</li>
                <li>Düzenli güvenlik denetimleri yapılır</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">6.2. Veri Saklama</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verileriniz, hizmet sağlama süresince saklanır</li>
                <li>Hesabınızı sildiğinizde, verileriniz 30 gün içinde silinir</li>
                <li>Yasal yükümlülükler gereği bazı veriler daha uzun süre saklanabilir</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">7. CİHAZ KİMLİĞİ (DEVICE ID) KULLANIMI</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">7.1. Cihaz kimliği, yalnızca aşağıdaki amaçlarla kullanılır:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Premium abonelik durumunuzu doğrulamak</li>
                <li>Aynı cihazda premium özelliklere erişiminizi sağlamak</li>
                <li>Abonelik ihlallerini önlemek</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">7.2. Cihaz kimliği:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Üçüncü taraflarla paylaşılmaz</li>
                <li>Reklam veya pazarlama amaçlı kullanılmaz</li>
                <li>Sadece uygulama içi premium durumu kontrolü için kullanılır</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">8. KULLANICI HAKLARI</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında aşağıdaki haklara sahipsiniz:
              </p>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.1. Bilgi Edinme Hakkı</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Hangi verilerinizin toplandığını öğrenebilirsiniz</li>
                <li>Verilerinizin nasıl kullanıldığını öğrenebilirsiniz</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.2. Erişim Hakkı</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Kişisel verilerinize erişim talep edebilirsiniz</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.3. Düzeltme Hakkı</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Yanlış veya eksik verilerinizin düzeltilmesini talep edebilirsiniz</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.4. Silme Hakkı</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verilerinizin silinmesini talep edebilirsiniz (yasal yükümlülükler saklı kalmak kaydıyla)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.5. İtiraz Hakkı</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verilerinizin işlenmesine itiraz edebilirsiniz</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-100 mt-6">8.6. Haklarınızı Kullanma</h3>
              <p className="text-gray-300 leading-relaxed mb-3">
                Haklarınızı kullanmak için bizimle iletişime geçebilirsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>E-posta: privacy@linkmanager.app</li>
                <li>Play Store: <a href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr" target="_blank" rel="noopener noreferrer" className="text-[#FF4655] hover:underline">https://play.google.com/store/apps/details?id=com.link.manager&hl=tr</a></li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">9. ÇOCUKLARIN GİZLİLİĞİ</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager, 13 yaş altındaki çocuklardan bilerek veri toplamaz. 13 yaş altındaki bir çocuğun verilerinin toplandığını fark edersek, derhal sileriz.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">10. ÇEREZLER VE BENZERİ TEKNOLOJİLER</h2>
              <p className="text-gray-300 leading-relaxed">
                Uygulama, Firebase Analytics ve Crashlytics gibi analitik araçlar kullanır. Bu araçlar, kullanım istatistikleri ve hata raporları toplar.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">11. ULUSLARARASI VERİ TRANSFERİ</h2>
              <p className="text-gray-300 leading-relaxed">
                Verileriniz, hizmet sağlayıcılarımızın sunucularında (ABD ve diğer ülkeler) saklanabilir. Bu transferler, uygun güvenlik önlemleri ile yapılır.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">12. POLİTİKA DEĞİŞİKLİKLERİ</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Bu Gizlilik Politikasını herhangi bir zamanda güncelleyebiliriz.</li>
                <li>Önemli değişiklikler durumunda, uygulama içi bildirim veya e-posta ile bilgilendirileceksiniz.</li>
                <li>Değişikliklerden sonra uygulamayı kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">13. İLETİŞİM</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Gizlilik ile ilgili sorularınız veya talepleriniz için:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>E-posta: privacy@linkmanager.app</li>
                <li>Play Store: <a href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr" target="_blank" rel="noopener noreferrer" className="text-[#FF4655] hover:underline">https://play.google.com/store/apps/details?id=com.link.manager&hl=tr</a></li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">14. YASAL UYGULANABİLİRLİK</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu Gizlilik Politikası, Türkiye Cumhuriyeti&apos;nin Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuatına uygun olarak hazırlanmıştır.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">15. ONAY</h2>
              <p className="text-gray-300 leading-relaxed">
                Uygulamayı kullanarak, bu Gizlilik Politikasını okuduğunuzu, anladığınızı ve kabul ettiğinizi onaylarsınız.
              </p>
            </section>

            <div className="mt-12 pt-6 border-t border-[#2A3441]/50 text-center text-gray-400 text-sm">
              <p>&copy; 2025 Link Manager. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
