"use client";
import { GitHubRepo } from "@/lib/github";
import { useLocale } from "@/contexts/LocaleContext";
import SplitText from "@/components/SplitText";

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
  const { t } = useLocale();

  if (!repos || repos.length === 0) {
    return (
      <section
        id="github-projects"
        className="relative overflow-hidden min-h-screen text-white px-6 py-20 md:px-16"
      >
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-50"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <SplitText
            text={t("projects.githubTitle")}
            tag="h2"
            className="text-2xl md:text-4xl font-bold mb-2 text-white"
            splitType="words"
            delay={30}
            duration={0.8}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.2}
            rootMargin="-80px"
          />
          <div className="h-1 w-24 bg-gradient-to-r from-white to-transparent rounded mt-2 mb-4" />
          <p className="text-gray-300">
            {t("projects.githubEmpty")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="github-projects"
      className="relative overflow-hidden min-h-screen text-white px-6 py-20 md:px-16"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF4655]/10 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <SplitText
              text={t("projects.githubTitle")}
              tag="h2"
              className="text-2xl md:text-4xl font-bold mb-2 text-white"
              splitType="words"
              delay={30}
              duration={0.8}
              ease="power3.out"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-80px"
            />
            <div className="h-1 w-24 bg-gradient-to-r from-white to-transparent rounded mt-2 mb-2" />
            <p className="text-gray-300">
              {t("projects.githubDescription")}{" "}
              <a
                href="https://github.com/ernklyc?tab=repositories"
                target="_blank"
                rel="noreferrer"
                className="text-[#FF4655] hover:text-[#FF6B7A] underline underline-offset-4 transition-colors"
                aria-label="GitHub profil sayfasını aç"
              >
                {t("projects.githubProfile")}
              </a>{" "}
              {t("projects.githubVisit")}
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
              className="group border border-white/10 border-t-white/15 shadow-lg shadow-black/30 bg-gradient-to-br from-[#1F2731]/80 via-[#1A252F]/75 to-[#0F1923]/90 backdrop-blur-xl p-5 flex flex-col justify-between hover:border-white/20 hover:shadow-xl hover:shadow-black/40 transition-all duration-500 rounded-2xl"
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
                      <span className="h-2 w-2 rounded-full bg-[#FF4655]" />
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

