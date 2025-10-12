import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Movie Face AI Gizlilik Politikası",
  description:
    "Movie Face AI uygulaması için gizlilik politikası. Yelbegen Software tarafından geliştirildi.",
  alternates: { canonical: "/movie-face-ai-privacy" },
};

export default function MovieFaceAIPrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#0F1923] text-white">
      <section className="px-4 sm:px-6 md:px-8 pt-28 pb-16">
        <div className="mx-auto w-full max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Movie Face AI Gizlilik Politikası</h1>
          <p className="text-sm text-gray-300 mb-8">Effective Date: October 12, 2025</p>

          <p className="mb-6 text-gray-200">
            Bu gizlilik politikası, Yelbegen Software (&quot;Hizmet Sağlayıcı&quot;) tarafından oluşturulan ve Ücretsiz hizmet olarak sunulan Movie Face AI uygulaması (&quot;Uygulama&quot;) için geçerlidir. Bu hizmet &quot;OLDUĞU GİBİ&quot; kullanım için tasarlanmıştır.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Bilgi Toplama ve Kullanım</h2>
          <p className="mb-4 text-gray-200">
            Uygulama, indirdiğinizde ve kullandığınızda bilgi toplar. Bu bilgiler şunları içerebilir:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>Cihazınızın İnternet Protokol adresi (ör. IP adresi)</li>
            <li>Ziyaret ettiğiniz Uygulama sayfaları, ziyaret tarih ve saati, bu sayfalarda geçirilen süre</li>
            <li>Uygulamada geçirilen süre</li>
            <li>Mobil cihazınızda kullandığınız işletim sistemi</li>
          </ul>
          <p className="mb-6 text-gray-200">
            Uygulama, mobil cihazınızın konumu hakkında kesin bilgi toplamaz.
          </p>
          <p className="mb-6 text-gray-200">
            Hizmet Sağlayıcı, size önemli bilgiler, gerekli bildirimler ve pazarlama promosyonları sağlamak için zaman zaman sizinle iletişim kurmak amacıyla sağladığınız bilgileri kullanabilir.
          </p>
          <p className="mb-8 text-gray-200">
            Daha iyi bir deneyim için, Uygulama kullanılırken, Hizmet Sağlayıcı belirli kişisel olarak tanımlanabilir bilgileri sağlamanızı talep edebilir. Hizmet Sağlayıcının talep ettiği bilgiler, onlar tarafından saklanacak ve bu gizlilik politikasında açıklandığı şekilde kullanılacaktır.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Üçüncü Taraf Erişimi</h2>
          <p className="mb-4 text-gray-200">
            Yalnızca toplu, anonimleştirilmiş veriler, Uygulamayı ve hizmetlerini geliştirmek için Hizmet Sağlayıcıya yardımcı olmak amacıyla periyodik olarak harici hizmetlere iletilir. Hizmet Sağlayıcı, bu gizlilik bildiriminde açıklanan yollarla bilgilerinizi üçüncü taraflarla paylaşabilir.
          </p>
          <p className="mb-4 text-gray-200">
            Lütfen dikkat edin ki Uygulama, veri işleme konusunda kendi Gizlilik Politikalarına sahip üçüncü taraf hizmetleri kullanır. Aşağıda, Uygulama tarafından kullanılan üçüncü taraf hizmet sağlayıcılarının Gizlilik Politikalarına bağlantılar bulunmaktadır:
          </p>
          <ul className="list-disc list-inside mb-6 text-gray-200 space-y-1">
            <li>
              <a 
                href="https://adapty.io/privacy" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FF6B7A] hover:underline"
              >
                Adapty
              </a>
            </li>
          </ul>
          <p className="mb-4 text-gray-200">Hizmet Sağlayıcı, Kullanıcı Tarafından Sağlanan ve Otomatik Olarak Toplanan Bilgileri aşağıdaki durumlarda ifşa edebilir:</p>
          <ul className="list-disc list-inside mb-8 text-gray-200 space-y-1">
            <li>Yasal zorunluluk gereği, örneğin mahkeme celbi veya benzer yasal süreçlere uymak için;</li>
            <li>Haklarını korumak, güvenliğinizi veya başkalarının güvenliğini korumak, dolandırıcılığı araştırmak veya devlet talebine yanıt vermek için açıklamanın gerekli olduğuna iyi niyetle inandıklarında;</li>
            <li>Onlar adına çalışan, ifşa ettiğimiz bilgileri bağımsız olarak kullanmayan ve bu gizlilik bildiriminde belirlenen kurallara uymayı kabul eden güvenilir hizmet sağlayıcılarıyla.</li>
          </ul>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Çıkış Hakları</h2>
          <p className="mb-8 text-gray-200">
            Uygulamayı kaldırarak Uygulama tarafından tüm bilgi toplama işlemini kolayca durdurabilirsiniz. Mobil cihazınızın bir parçası olarak mevcut olan veya mobil uygulama pazarı veya ağı aracılığıyla mevcut olan standart kaldırma süreçlerini kullanabilirsiniz.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Veri Saklama Politikası</h2>
          <p className="mb-8 text-gray-200">
            Hizmet Sağlayıcı, Uygulamayı kullandığınız süre boyunca ve bundan sonra makul bir süre boyunca Kullanıcı Tarafından Sağlanan verileri saklayacaktır. Uygulama aracılığıyla sağladığınız Kullanıcı Tarafından Sağlanan Verileri silmemizi istiyorsanız, lütfen yelbegensoftware@gmail.com adresinden bizimle iletişime geçin ve makul bir süre içinde yanıt vereceğiz.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Çocuklar</h2>
          <p className="mb-4 text-gray-200">
            Hizmet Sağlayıcı, Uygulamayı 13 yaşın altındaki çocuklardan bilerek veri toplamak veya onlara pazarlama yapmak için kullanmaz.
          </p>
          <p className="mb-8 text-gray-200">
            Uygulama 13 yaşın altındaki hiç kimseye hitap etmez. Hizmet Sağlayıcı, 13 yaşın altındaki çocuklardan bilerek kişisel olarak tanımlanabilir bilgi toplamaz. Hizmet Sağlayıcının 13 yaşın altındaki bir çocuğun kişisel bilgi sağladığını keşfetmesi durumunda, Hizmet Sağlayıcı bunu sunucularından derhal silecektir. Ebeveyn veya vasi iseniz ve çocuğunuzun bize kişisel bilgi sağladığını biliyorsanız, lütfen gerekli eylemleri gerçekleştirebilmeleri için Hizmet Sağlayıcıyla (yelbegensoftware@gmail.com) iletişime geçin.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Güvenlik</h2>
          <p className="mb-8 text-gray-200">
            Hizmet Sağlayıcı, bilgilerinizin gizliliğini koruma konusunda endişelidir. Hizmet Sağlayıcı, işlediği ve sürdürdüğü bilgileri korumak için fiziksel, elektronik ve prosedürel güvenlik önlemleri sağlar.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Değişiklikler</h2>
          <p className="mb-8 text-gray-200">
            Bu Gizlilik Politikası herhangi bir nedenle zaman zaman güncellenebilir. Hizmet Sağlayıcı, bu sayfayı yeni Gizlilik Politikası ile güncelleyerek Gizlilik Politikasındaki değişiklikler hakkında sizi bilgilendirecektir. Devam eden kullanım tüm değişikliklerin onayı olarak kabul edildiğinden, herhangi bir değişiklik için bu Gizlilik Politikasını düzenli olarak kontrol etmeniz önerilir.
          </p>
          <p className="mb-8 text-gray-200">
            Bu gizlilik politikası 2025-10-12 tarihinden itibaren geçerlidir.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Onayınız</h2>
          <p className="mb-8 text-gray-200">
            Uygulamayı kullanarak, şimdi ve bizim tarafımızdan değiştirildiği şekliyle bu Gizlilik Politikasında belirtilen bilgilerinizin işlenmesine onay veriyorsunuz.
          </p>

          <hr className="border-[#FF4655]/30 mb-8" />

          <h2 className="text-2xl font-semibold mb-4">Bizimle İletişime Geçin</h2>
          <p className="mb-2 text-gray-200">Uygulamayı kullanırken gizlilik ile ilgili herhangi bir sorunuz varsa veya uygulamalar hakkında sorularınız varsa, lütfen Hizmet Sağlayıcıyla yelbegensoftware@gmail.com e-posta adresi üzerinden iletişime geçin.</p>
          
          <div className="mt-8 pt-6 border-t border-[#FF4655]/20">
            <p className="text-gray-400 text-sm">
              Bu gizlilik politikası sayfası{" "}
              <a 
                href="https://app-privacy-policy-generator.nisrulz.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FF6B7A] hover:underline"
              >
                App Privacy Policy Generator
              </a>{" "}
              tarafından oluşturulmuştur.
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400 mt-8">
            <Link href="/" className="hover:text-white hover:underline">← Ana Sayfa</Link>
            <span>Movie Face AI</span>
          </div>
        </div>
      </section>
    </main>
  );
}
