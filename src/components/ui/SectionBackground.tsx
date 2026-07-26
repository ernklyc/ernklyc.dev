/**
 * Her section'ın arkasındaki iki ambient blur dekorasyonu.
 * Önceden her component'te tekrar tekrar kopyalanıyordu, artık tek yerde.
 */
export default function SectionBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#A9B7C4]/10 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-50" />
    </div>
  );
}
