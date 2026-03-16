export type Locale = "tr" | "en";

export const translations = {
  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımda",
      skills: "Yetenekler",
      experience: "Deneyim",
      projects: "Projeler",
      contact: "İletişim",
      cvDownload: "CV İndir",
    },
    hero: {
      title: "Eren KALAYCI",
      subtitle: "Bilgisayar Mühendisi & Mobil Uygulama Geliştiricisi",
      description:
        "Merhaba, ben Eren Kalaycı. Aktif olarak Flutter ile mobil uygulama geliştirme üzerine yoğunlaşmaktayım. Hobi olarak ise Unity ile oyunlar geliştiriyor ve modern web siteleri tasarlıyorum. Eren Kalaycı olarak geliştirdiğim mobil uygulamaları, oyunları ve web sitelerini yayınlıyorum.",
      cvDownload: "CV İndir",
      discover: "Keşfet",
    },
    about: {
      title: "HAKKIMDA",
      subtitle: "Yazılım geliştirme tutkum ve yolculuğum",
    },
    skills: {
      title: "YETENEKLERİM",
      subtitle: "Sürekli gelişen teknoloji dünyasında edindiğim uzmanlık alanlarım",
    },
    experience: {
      title: "Eğitim & İş Deneyimi",
      subtitle: "Akademik geçmişim ve profesyonel deneyimlerim",
    },
    projects: {
      title: "PROJELERİM",
      subtitle: "Yaratıcılık ve teknolojinin buluştuğu noktada ortaya çıkan projelerim. Her biri farklı bir hikaye anlatıyor.",
      githubTitle: "GitHub Repolarım",
      githubEmpty: "Şu anda GitHub projeleri yüklenemedi. Lütfen daha sonra tekrar deneyin.",
      githubDescription: "GitHub hesabımdaki son açık kaynak projelerim. Tüm repoları görmek için",
      githubProfile: "GitHub profilimi",
      githubVisit: "ziyaret edebilirsin.",
      playStoreTitle: "Google Play Uygulamalarım",
      playStoreEmpty: "Play Store uygulamaları şu an yüklenemedi. Lütfen daha sonra tekrar deneyin.",
      playStoreDescription: "Yelbegen Software adıyla yayınladığım mobil uygulamalar. Hepsini görmek için",
      playStorePage: "Google Play sayfamı",
      playStoreVisit: "ziyaret edebilirsin.",
      playStoreCta: "Google Play'de gör →",
    },
    contact: {
      title: "İLETİŞİME GEÇ",
      subtitle: "Proje teklifleri, iş birliği fırsatları veya herhangi bir sorunuz için benimle iletişime geçmekten çekinmeyin.",
      nameLabel: "Adınız",
      namePlaceholder: "Adınızı girin",
      subjectLabel: "Konu",
      subjectPlaceholder: "Mesaj konusu",
      messageLabel: "Mesajınız",
      messagePlaceholder: "Mesajınızı detaylı bir şekilde yazın...",
      submit: "Mesaj Gönder",
      sending: "Gönderiliyor...",
      success: "Gönderildi!",
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      errorNameRequired: "Ad alanı zorunludur",
      errorNameMin: "Ad en az 2 karakter olmalıdır",
      errorNameMax: "Ad en fazla 50 karakter olabilir",
      errorSubjectRequired: "Konu alanı zorunludur",
      errorSubjectMin: "Konu en az 3 karakter olmalıdır",
      errorSubjectMax: "Konu en fazla 100 karakter olabilir",
      errorMessageRequired: "Mesaj alanı zorunludur",
      errorMessageMin: "Mesaj en az 10 karakter olmalıdır",
      errorMessageMax: "Mesaj en fazla 1000 karakter olabilir",
    },
    footer: {
      title: "Eren Kalaycı",
      subtitle: "Bilgisayar Mühendisi & Mobil Uygulama Geliştirici",
      backToTop: "Yukarı Çık",
      rights: "Tüm hakları saklıdır.",
    },
    notFound: {
      message: "Aradığınız sayfa bulunamadı.",
      backHome: "← Ana Sayfaya Dön",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      contact: "Contact",
      cvDownload: "Download CV",
    },
    hero: {
      title: "Eren KALAYCI",
      subtitle: "Computer Engineer & Mobile App Developer",
      description:
        "Hi, I'm Eren Kalaycı. I focus on mobile app development with Flutter. As a hobby, I develop games with Unity and design modern websites. I publish mobile apps, games and websites as Eren Kalaycı.",
      cvDownload: "Download CV",
      discover: "Discover",
    },
    about: {
      title: "ABOUT ME",
      subtitle: "My passion for software development and my journey",
    },
    skills: {
      title: "SKILLS",
      subtitle: "Expertise I have gained in an ever-evolving tech world",
    },
    experience: {
      title: "Education & Work Experience",
      subtitle: "My academic background and professional experience",
    },
    projects: {
      title: "MY PROJECTS",
      subtitle: "Projects at the intersection of creativity and technology. Each tells a different story.",
      githubTitle: "My GitHub Repos",
      githubEmpty: "GitHub projects could not be loaded. Please try again later.",
      githubDescription: "Recent open source projects from my GitHub. To see all repos visit",
      githubProfile: "my GitHub profile",
      githubVisit: ".",
      playStoreTitle: "My Google Play Apps",
      playStoreEmpty: "Play Store apps could not be loaded. Please try again later.",
      playStoreDescription: "Mobile apps published under Yelbegen Software. To see all of them visit",
      playStorePage: "my Google Play page",
      playStoreVisit: ".",
      playStoreCta: "View on Google Play →",
    },
    contact: {
      title: "GET IN TOUCH",
      subtitle: "Feel free to reach out for project proposals, collaboration or any questions.",
      nameLabel: "Your name",
      namePlaceholder: "Enter your name",
      subjectLabel: "Subject",
      subjectPlaceholder: "Message subject",
      messageLabel: "Your message",
      messagePlaceholder: "Write your message in detail...",
      submit: "Send Message",
      sending: "Sending...",
      success: "Sent!",
      error: "Something went wrong. Please try again.",
      errorNameRequired: "Name is required",
      errorNameMin: "Name must be at least 2 characters",
      errorNameMax: "Name can be at most 50 characters",
      errorSubjectRequired: "Subject is required",
      errorSubjectMin: "Subject must be at least 3 characters",
      errorSubjectMax: "Subject can be at most 100 characters",
      errorMessageRequired: "Message is required",
      errorMessageMin: "Message must be at least 10 characters",
      errorMessageMax: "Message can be at most 1000 characters",
    },
    footer: {
      title: "Eren Kalaycı",
      subtitle: "Computer Engineer & Mobile App Developer",
      backToTop: "Back to top",
      rights: "All rights reserved.",
    },
    notFound: {
      message: "The page you are looking for was not found.",
      backHome: "← Back to Home",
    },
  },
} as const;

function getNested(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split(".");
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === "string" ? current : undefined;
}

export function t(locale: Locale, key: string): string {
  const value = getNested(translations[locale] as Record<string, unknown>, key);
  return value ?? key;
}
