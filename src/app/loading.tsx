export default function Loading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0F1923]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700" />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10 pt-24 pb-16">
        <div className="h-12 w-64 bg-white/10 rounded-lg animate-pulse mx-auto mb-12" />
        <div className="h-6 w-96 bg-white/5 rounded animate-pulse mx-auto mb-20" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
