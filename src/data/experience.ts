export type ExperienceEntry = {
  title: string;
  company: string;
  location: string;
  type: string;
  period: string;
  duration?: string;
  /** YYYY-MM formatında; süre hesaplanacaksa doldur */
  startDate?: string;
  /** YYYY-MM formatında; boşsa "Günümüz" (şu an) kabul edilir */
  endDate?: string | null;
  category: string;
  logo: string;
  skills: string[];
};

/** İki tarih arasındaki ay sayısı; başlangıç ve bitiş ayı dahil (Ağustos başı + bu ay = 8 ay gibi) */
export function getDurationMonths(start: string, end: string | null | undefined): number {
  const [startY, startM] = start.split("-").map(Number);
  const endDate = end ? new Date(end + "-01") : new Date();
  const endY = endDate.getFullYear();
  const endM = endDate.getMonth() + 1;
  const diff = (endY - startY) * 12 + (endM - startM);
  return diff + 1; // her iki ayı da dahil et
}

export function formatDuration(start: string, end: string | null | undefined): string {
  const months = getDurationMonths(start, end);
  if (months < 12) return `${months} ay`;
  const years = Math.floor(months / 12);
  const restMonths = months % 12;
  if (restMonths === 0) return `${years} yıl`;
  return `${years} yıl ${restMonths} ay`;
}

export const experience: ExperienceEntry[] = [
  {
    title: "Software Engineering Intern",
    company: "TİSKİ Bilgi İşlem Daire Başkanlığı",
    location: "Trabzon, Türkiye",
    type: "Ofisten",
    period: "Tem 2024 - Ağu 2024",
    startDate: "2024-07",
    endDate: "2024-08",
    duration: "2 ay",
    category: "Staj",
    logo: "/tiski.png",
    skills: ["Dart", "Flutter", "Git", "BloC", "Firebase"],
  },
  {
    title: "Flutter Developer",
    company: "Daynex Yazılım A.Ş.",
    location: "Trabzon, Türkiye",
    type: "Ofisten",
    period: "Tem 2025 - Ağu 2025",
    startDate: "2025-07",
    endDate: "2025-08",
    duration: "2 ay",
    category: "Staj",
    logo: "https://media.licdn.com/dms/image/v2/D4D0BAQHcgj44MkLlAA/company-logo_200_200/company-logo_200_200/0/1690998382929/daynex_web_z_mleri_logo?e=1775088000&v=beta&t=SLg1Uevt5OrfN-KZm-ij1uXZ0PDbKRLO7gsq_HUTMoc",
    skills: ["Dart", "Flutter", "Git", "BloC"],
  },
  {
    title: "Flutter & Mobile Developer",
    company: "Glass Padel",
    location: "İstanbul, Türkiye",
    type: "Uzaktan",
    period: "Ağu 2025 - Günümüz",
    startDate: "2025-08",
    endDate: null,
    category: "Tam zamanlı",
    logo: "https://media.licdn.com/dms/image/v2/D4D0BAQEbuXQuda9xdg/company-logo_200_200/B4DZnuo1ZkGgAI-/0/1760645306330?e=1775088000&v=beta&t=l8upHyZh-VBuVxbFmP4Owm4lXQv1TGrZuGZb8-ld4do",
    skills: ["Dart", "Flutter", "Firebase", "REST APIs", "Flutterflow"],
  },
];
