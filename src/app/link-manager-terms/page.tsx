import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link Manager - Kullanım Şartları | Eren Kalaycı",
  description: "Link Manager mobil uygulaması kullanım şartları ve koşulları.",
};

export default function LinkManagerTermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-[#1F2731]/60 backdrop-blur-sm rounded-2xl p-8 border border-[#2A3441]/50 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white">
              LINK MANAGER KULLANIM ŞARTLARI
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
              Bu Kullanım Şartları (&quot;Şartlar&quot;), Link Manager mobil uygulamasını (&quot;Uygulama&quot;) kullanımınızı yönetir. Uygulamayı indirerek, yükleyerek veya kullanarak bu Şartları kabul etmiş sayılırsınız. Lütfen dikkatle okuyunuz.
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">1. KABUL VE UYGULANABİLİRLİK</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu Şartlar, Link Manager uygulamasının tüm kullanıcıları için geçerlidir. Uygulamayı kullanarak bu Şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız, lütfen uygulamayı kullanmayın.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">2. UYGULAMANIN TANIMI</h2>
              <p className="text-gray-300 leading-relaxed">
                Link Manager, kullanıcıların web bağlantılarını organize etmelerine, saklamalarına ve yönetmelerine olanak tanıyan bir mobil uygulamadır. Uygulama, ücretsiz ve premium (ücretli) özellikler sunmaktadır.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">3. KULLANICI HESAPLARI VE KAYIT</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulamayı kullanmak için bir hesap oluşturmanız gerekebilir.</li>
                <li>Hesap bilgilerinizin doğruluğundan ve güncelliğinden siz sorumlusunuz.</li>
                <li>Hesap güvenliğinden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayın.</li>
                <li>Hesabınızın yetkisiz kullanımından derhal bizi haberdar etmelisiniz.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">4. ÜCRETLİ HİZMETLER VE ABONELİKLER</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Link Manager, ücretsiz ve premium (ücretli) özellikler sunmaktadır.</li>
                <li>Premium özelliklere erişim, aylık veya yıllık abonelik veya tek seferlik ödeme ile satın alınabilir.</li>
                <li>Abonelikler, Google Play Store veya Apple App Store üzerinden RevenueCat servisi aracılığıyla yönetilir.</li>
                <li>Abonelik ücretleri, uygulama içi satın alma ekranında gösterilir.</li>
                <li>Abonelikler otomatik olarak yenilenir. İptal etmediğiniz sürece, abonelik dönem sonunda otomatik olarak yenilenecektir.</li>
                <li>Abonelikleri Google Play Store veya Apple App Store ayarlarından iptal edebilirsiniz.</li>
                <li>İptal işlemi, mevcut abonelik döneminin sonunda geçerli olur. İptal sonrası premium özelliklere erişiminiz sona erer.</li>
                <li>Ödemeler iade edilmez, ancak yasal haklarınız saklıdır.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">5. KULLANICI İÇERİĞİ</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulamaya eklediğiniz tüm bağlantılar ve içerikler sizin sorumluluğunuzdadır.</li>
                <li>Yasadışı, zararlı, tehdit edici, rahatsız edici, hakaret içeren veya başkalarının haklarını ihlal eden içerik eklemeyiniz.</li>
                <li>Telif hakkı, ticari marka veya başkalarının fikri mülkiyet haklarını ihlal eden içerik eklemeyiniz.</li>
                <li>Uygulamayı spam, kötü amaçlı yazılım dağıtımı veya yasadışı faaliyetler için kullanmayınız.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">6. FİKRİ MÜLKİYET HAKLARI</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulama ve tüm içeriği (yazılım, tasarım, logo, metinler vb.) telif hakkı ve diğer fikri mülkiyet yasaları ile korunmaktadır.</li>
                <li>Uygulamayı yalnızca kişisel, ticari olmayan amaçlarla kullanabilirsiniz.</li>
                <li>Uygulamanın herhangi bir bölümünü kopyalayamaz, değiştiremez, dağıtamaz veya ticari amaçlarla kullanamazsınız.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">7. HİZMET KESİNTİLERİ VE DEĞİŞİKLİKLER</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulama, bakım, güncelleme veya teknik sorunlar nedeniyle geçici olarak kullanılamayabilir.</li>
                <li>Uygulamanın özelliklerini, fiyatlandırmasını veya hizmetlerini önceden haber vermeksizin değiştirme hakkımız saklıdır.</li>
                <li>Uygulamayı herhangi bir zamanda durdurma veya sonlandırma hakkımız saklıdır.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">8. SORUMLULUK SINIRLAMALARI</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Uygulama &quot;olduğu gibi&quot; sunulmaktadır. Uygulamanın kesintisiz, hatasız veya güvenli olacağını garanti etmiyoruz.</li>
                <li>Uygulamanın kullanımından kaynaklanan doğrudan veya dolaylı zararlardan sorumlu değiliz.</li>
                <li>Uygulamaya eklediğiniz bağlantıların güvenliği veya erişilebilirliğinden sorumlu değiliz.</li>
                <li>Üçüncü taraf web sitelerinin içeriğinden veya güvenliğinden sorumlu değiliz.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">9. VERİ GÜVENLİĞİ</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Verilerinizin güvenliği bizim için önemlidir. Detaylı bilgi için Gizlilik Politikamıza bakınız.</li>
                <li>Uygulamayı kullanarak, verilerinizin toplanması, işlenmesi ve saklanmasını kabul etmiş sayılırsınız.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">10. FESİH</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Bu Şartları ihlal etmeniz durumunda, hesabınızı askıya alma veya sonlandırma hakkımız saklıdır.</li>
                <li>Hesabınızın sonlandırılması durumunda, uygulamaya erişiminiz ve premium özelliklere erişiminiz sona erer.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">11. DEĞİŞİKLİKLER</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Bu Şartları herhangi bir zamanda güncelleyebiliriz.</li>
                <li>Önemli değişiklikler durumunda, uygulama içi bildirim veya e-posta ile bilgilendirileceksiniz.</li>
                <li>Değişikliklerden sonra uygulamayı kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">12. YASAL UYGULANABİLİRLİK</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Bu Şartlar, Türkiye Cumhuriyeti yasalarına tabidir.</li>
                <li>Bu Şartlardan kaynaklanan herhangi bir uyuşmazlık, Türkiye Cumhuriyeti mahkemelerinde çözülecektir.</li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">13. İLETİŞİM</h2>
              <p className="text-gray-300 leading-relaxed mb-3">
                Sorularınız veya şikayetleriniz için bizimle iletişime geçebilirsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>E-posta: support@linkmanager.app</li>
                <li>Play Store: <a href="https://play.google.com/store/apps/details?id=com.link.manager&hl=tr" target="_blank" rel="noopener noreferrer" className="text-[#FF4655] hover:underline">https://play.google.com/store/apps/details?id=com.link.manager&hl=tr</a></li>
              </ul>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-[#FF4655]">14. GENEL HÜKÜMLER</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-300 ml-4">
                <li>Bu Şartların herhangi bir maddesi geçersiz sayılırsa, diğer maddeler yürürlükte kalır.</li>
                <li>Bu Şartlar, uygulamanın kullanımına ilişkin tüm anlaşmaları içerir.</li>
              </ul>
            </section>

            <div className="mt-8 p-4 bg-[#FF4655]/10 border border-[#FF4655]/30 rounded-lg">
              <p className="text-gray-300 leading-relaxed">
                Bu Kullanım Şartlarını kabul ederek, Link Manager uygulamasını kullanmaya başlayabilirsiniz.
              </p>
            </div>

            <div className="mt-12 pt-6 border-t border-[#2A3441]/50 text-center text-gray-400 text-sm">
              <p>&copy; 2025 Link Manager. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
