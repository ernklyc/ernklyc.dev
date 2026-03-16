export interface GitHubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  visibility?: string;
}

const GITHUB_USERNAME = "ernklyc";
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`;
const CACHE_REVALIDATE = 3600; // 1 saat

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Repo README'sinden ilk anlamlı paragrafı alır, max ~3 satır (~120 karakter) + "..." ekler.
 */
async function getDescriptionFromReadme(repoName: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repoName}/readme`,
      {
        headers: getHeaders(),
        next: { revalidate: CACHE_REVALIDATE },
      }
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { content?: string; encoding?: string };
    if (!json.content || json.encoding !== "base64") return null;
    const raw = Buffer.from(json.content, "base64").toString("utf-8");
    const lines = raw.split(/\r?\n/);
    const textLines: string[] = [];
    for (const line of lines) {
      let t = line.trim();
      if (!t) continue;
      if (t.startsWith("#")) continue;
      if (t.startsWith("```") || t.startsWith("|") || t.startsWith("- [") || t.startsWith("* [") || /^\[!?\[/.test(t)) break;
      t = t.replace(/^\s*[-*]\s*/, "").replace(/\*\*/g, "");
      if (t.length > 20) textLines.push(t);
      if (textLines.join(" ").length >= 100) break;
    }
    const desc = textLines.join(" ").replace(/\s+/g, " ").trim().slice(0, 120);
    return desc ? `${desc}...` : null;
  } catch {
    return null;
  }
}

export async function getPublicRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(GITHUB_API_URL, {
    headers: getHeaders(),
    next: { revalidate: CACHE_REVALIDATE },
  });

  if (!res.ok) {
    console.error("GitHub repos fetch failed", res.status, res.statusText);
    return [];
  }

  const data = (await res.json()) as GitHubRepo[];
  const repos = data.filter((repo) => repo.visibility !== "private");

  const withDescriptions = await Promise.all(
    repos.map(async (repo) => {
      if (repo.name === "flutter-spotify-clone-ui" || repo.name === "ERNKLYC") return { ...repo, description: null };
      if (repo.description) return repo;
      const fromReadme = await getDescriptionFromReadme(repo.name);
      return { ...repo, description: fromReadme ?? repo.description };
    })
  );

  const languageOrder: Record<string, number> = {
    Dart: 0,
    "C++": 1,
    TypeScript: 2,
    Java: 3,
    Python: 4,
    "C#": 5,
  };
  const getOrder = (lang: string | null) => (lang && lang in languageOrder ? languageOrder[lang] : 99);

  return [...withDescriptions].sort((a, b) => getOrder(a.language) - getOrder(b.language));
}

