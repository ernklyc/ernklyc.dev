/**
 * Merkezi tasarım token'ları.
 *
 * Bütün site genelinde kart, chip, buton ve arka plan dekorasyonları
 * burada tanımlı tek bir "kaynak"tan türetilir. Bir bileşende stil
 * güncellemesi gerektiğinde tek yer değişir, tüm site tutarlı kalır.
 */

export const colors = {
  accent: "#A9B7C4",
  accentLight: "#C7D2DA",
  accentDark: "#7E8FA0",
  surface: "#12161B",
  surfaceHover: "#1A1F26",
  surfaceTrack: "#0B0E12",
} as const;

/**
 * Kart kabuğu — düz, tek tonlu, minimal cam efekti. Önceden 3 durak
 * (from/via/to) gradyanlıydı; site genelinde gradyansız, sade koyu tema
 * tercih edildiği için tek tonlu şeffaf yüzeye indirildi.
 */
export const glassCard =
  "rounded-2xl border border-white/10 shadow-lg shadow-black/20 " +
  "bg-white/[0.04] backdrop-blur-xl transition-all duration-300";

export const glassCardHover = "hover:bg-white/[0.06] hover:border-white/20";

/** Tıklanabilir/tıklanamayan tüm chip, rozet ve etiketlerin ortak koyu teması. */
export const darkChip = "bg-[#12161B]/70 border border-white/10 text-gray-300";

export const darkChipInteractive =
  "bg-[#12161B]/70 border border-white/10 text-gray-300 " +
  "hover:bg-[#1A1F26] hover:border-white/20 transition-all duration-300";

/** İkon butonları (sosyal linkler, aksiyon butonları) için ortak koyu tema. */
export const darkIconButton =
  "bg-[#12161B] hover:bg-[#1A1F26] border border-white/10 hover:border-white/20 " +
  "backdrop-blur-sm transition-all duration-300";

/** Dil değiştirici gibi segmented control track/indicator temaları. */
export const darkSegmentTrack = "bg-[#0B0E12]/60 border border-white/10";
export const darkSegmentIndicator =
  "bg-[#12161B] border border-white/10 shadow-sm shadow-black/50";

/** Form input alanlarının ortak stili. */
export const inputBase =
  "w-full bg-white/[0.04] backdrop-blur-sm border rounded-xl p-4 text-white " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-300";

export const inputBorder = {
  default:
    "border-white/10 hover:border-white/20 focus:border-white/30 focus:ring-white/20",
  error: "border-red-500 focus:border-red-500 focus:ring-red-500/20",
} as const;
