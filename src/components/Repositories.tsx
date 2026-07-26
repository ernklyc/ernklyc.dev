"use client";
import { GitHubRepo } from "@/lib/github";
import { useLocale } from "@/contexts/LocaleContext";
import SectionBackground from "@/components/ui/SectionBackground";
import SectionHeading from "@/components/ui/SectionHeading";
import Chip from "@/components/ui/Chip";
import { glassCard, glassCardHover } from "@/lib/theme";
import { cn } from "@/lib/utils";

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
  const isEmpty = !repos || repos.length === 0;

  return (
    <section id="github-projects" className="relative overflow-hidden min-h-screen text-white py-24">
      <SectionBackground />
      <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <SectionHeading title={t("projects.githubTitle")} align="left" className="mb-0" />
            {isEmpty ? (
              <p className="text-gray-300 mt-2">{t("projects.githubEmpty")}</p>
            ) : (
              <p className="text-gray-300 mt-2">
                {t("projects.githubDescription")}{" "}
                <a
                  href="https://github.com/ernklyc?tab=repositories"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#A9B7C4] hover:text-[#C7D2DA] underline underline-offset-4 transition-colors"
                  aria-label="GitHub profil sayfasını aç"
                >
                  {t("projects.githubProfile")}
                </a>{" "}
                {t("projects.githubVisit")}
              </p>
            )}
          </div>
        </div>

        {!isEmpty && (
          <div className="grid gap-6 md:grid-cols-2">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className={cn(glassCard, glassCardHover, "group p-6 flex flex-col justify-between")}
                title={repo.name}
                aria-label={`${repo.name} deposunu GitHub'ta aç`}
              >
                <div className="min-h-[4rem]">
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-[#A9B7C4] transition-colors leading-tight">
                    {repo.name}
                  </h3>
                  <p className="text-sm text-gray-400 leading-snug line-clamp-3 overflow-hidden text-ellipsis min-h-[3.25rem]">
                    {repo.description || "Detayları görüntüle"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-white/10 text-xs text-gray-400">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <Chip dotColor="#A9B7C4" className="px-3 py-1">
                        {repo.language}
                      </Chip>
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

                  <span className="text-gray-400">{formatUpdatedAt(repo.updated_at)}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
