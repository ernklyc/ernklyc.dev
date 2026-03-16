import { GitHubRepo } from "@/lib/github";

function formatUpdatedAt(dateString: string) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Bugün güncellendi";
  if (diffDays === 1) return "1 gün önce güncellendi";
  if (diffDays < 30) return `${diffDays} gün önce güncellendi`;

  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths === 1) return "1 ay önce güncellendi";
  if (diffMonths < 12) return `${diffMonths} ay önce güncellendi`;

  const diffYears = Math.floor(diffMonths / 12);
  if (diffYears === 1) return "1 yıl önce güncellendi";
  return `${diffYears} yıl önce güncellendi`;
}

interface RepositoriesProps {
  repos: GitHubRepo[];
}

export default function Repositories({ repos }: RepositoriesProps) {
  if (!repos || repos.length === 0) {
    return (
      <section
        id="github-projects"
        className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white px-6 py-20 md:px-16"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
            GitHub Repolarım
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#FF4655] to-transparent rounded mt-2 mb-4" />
          <p className="text-gray-300">
            Şu anda GitHub projeleri yüklenemedi. Lütfen daha sonra tekrar
            deneyin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="github-projects"
      className="relative overflow-hidden min-h-screen bg-gradient-to-br from-[#0A0F1C] via-[#0F1923] to-[#151F2B] text-white px-6 py-20 md:px-16"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-[#FF4655] to-white animate-gradient-x">
              GitHub Repolarım
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-[#FF4655] to-transparent rounded mt-2 mb-2" />
            <p className="text-gray-300">
              GitHub hesabımdaki son açık kaynak projelerim. Tüm repoları
              görmek için{" "}
              <a
                href="https://github.com/ernklyc?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4655] hover:text-[#FF6B7A] underline underline-offset-4 transition-colors"
                aria-label="GitHub profil sayfasını aç"
              >
                GitHub profilimi
              </a>{" "}
              ziyaret edebilirsin.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-[#1F2731]/80 to-[#0F1923]/90 backdrop-blur-sm p-5 flex flex-col justify-between hover:border-white/20 transition-all duration-500"
              title={repo.name}
              aria-label={`${repo.name} deposunu GitHub'ta aç`}
            >
              <div className="min-h-[4rem]">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-[#FF4655] transition-colors leading-tight">
                  {repo.name}
                </h3>
                <p className="text-sm text-gray-400 leading-snug line-clamp-3 overflow-hidden text-ellipsis min-h-[3.25rem]">
                  {repo.description || "Detayları görüntüle"}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  {repo.language && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{repo.language}</span>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <span>⭐</span>
                    <span>{repo.stargazers_count}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span>🍴</span>
                    <span>{repo.forks_count}</span>
                  </span>
                </div>

                <span className="text-gray-400">
                  {formatUpdatedAt(repo.updated_at)}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

