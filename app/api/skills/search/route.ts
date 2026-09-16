import { NextResponse } from "next/server";
import { runNpx } from "@/lib/npx";
import type { SkillSearchResult } from "@/lib/api-types";

export const dynamic = "force-dynamic";

const ANSI_RE = /\x1B\[[0-9;]*m/g;
const DEFAULT_LIMIT = 50;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const SEARCH_API_BASE = process.env.SKILLS_API_URL || "https://skills.sh";
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_SEARCH_TIMEOUT_MS = 8000;

interface SkillsApiSkill {
  id?: string;
  name?: string;
  source?: string;
  installs?: number;
}

interface SkillsApiResponse {
  skills?: SkillsApiSkill[];
}

function parseLimit(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Math.floor(num)));
}

function formatInstalls(count?: number): string {
  if (!count || count <= 0) return "";
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M installs`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K installs`;
  return `${count} install${count === 1 ? "" : "s"}`;
}

function parseSearchOutput(raw: string): SkillSearchResult[] {
  const clean = raw.replace(ANSI_RE, "");
  const results: SkillSearchResult[] = [];
  const lines = clean.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // package line: "owner/repo@skill  NNK installs"
    const pkgMatch = line.match(/^([\w.\-]+\/[\w.\-@:]+)\s+([\d.,]+[KMB]?\s+installs)$/);
    if (pkgMatch) {
      const urlLine = lines[i + 1]?.trim().replace(/^└\s*/, "");
      results.push({
        package: pkgMatch[1],
        installs: pkgMatch[2],
        url: urlLine?.startsWith("https://") ? urlLine : "",
      });
    }
  }
  return results;
}

async function searchSkillsApi(query: string, limit: number): Promise<SkillSearchResult[]> {
  const url = `${SEARCH_API_BASE}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`skills.sh search failed: HTTP ${res.status}`);

  const data = (await res.json()) as SkillsApiResponse;
  return (data.skills ?? [])
    .map((skill): SkillSearchResult | null => {
      const name = skill.name?.trim();
      const source = skill.source?.trim();
      const slug = skill.id?.trim();
      if (!name || (!source && !slug)) return null;

      const pkg = `${source || slug}@${name}`;
      return {
        package: pkg,
        installs: formatInstalls(skill.installs),
        url: slug ? `${SEARCH_API_BASE}/${slug}` : "",
        origin: "skills.sh",
      };
    })
    .filter((skill): skill is SkillSearchResult => skill !== null)
    .sort((a, b) => parseInstallCount(b.installs) - parseInstallCount(a.installs));
}

// A query naming a specific repo, either as a bare "owner/repo" or a full
// https://github.com/owner/repo URL (optionally with a trailing .git / path).
const GITHUB_REPO_RE = /^(?:https?:\/\/github\.com\/)?([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?$/i;

interface GitHubRepo {
  full_name: string;
  html_url: string;
  description?: string | null;
  stargazers_count?: number;
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pi-code-desktop",
  };
  // Optional: raises the unauthenticated GitHub API rate limit when a user
  // supplies their own token via env. Never required and never sent anywhere
  // else — this is the same token a developer would already export for `gh`.
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubFetch(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_SEARCH_TIMEOUT_MS);
  try {
    return await fetch(url, { headers: githubHeaders(), cache: "no-store", signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function repoToResult(repo: GitHubRepo): SkillSearchResult {
  return {
    package: `github:${repo.full_name}`,
    installs: repo.stargazers_count ? `★ ${repo.stargazers_count.toLocaleString()}` : "",
    url: repo.html_url,
    origin: "github",
    description: repo.description?.trim() || undefined,
  };
}

/**
 * Looks up skills on GitHub. A query that names a specific repo (URL or
 * "owner/repo") fetches that repo directly; otherwise this searches public
 * repositories whose name/description/topics mention the query and "skill",
 * which is how Claude/Pi skill repos are conventionally tagged. Unauthenticated
 * GitHub API calls are rate-limited but require no credentials.
 */
async function searchGitHubSkills(query: string, limit: number): Promise<SkillSearchResult[]> {
  const trimmed = query.trim();
  const repoMatch = trimmed.match(GITHUB_REPO_RE);
  if (repoMatch) {
    const [, owner, repo] = repoMatch;
    try {
      const res = await githubFetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`);
      if (!res.ok) return [];
      const data = await res.json() as GitHubRepo;
      return [repoToResult(data)];
    } catch {
      return [];
    }
  }

  try {
    const q = `${trimmed} skill in:name,description,topics`;
    const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${Math.min(limit, 25)}`;
    const res = await githubFetch(url);
    if (!res.ok) return [];
    const data = await res.json() as { items?: GitHubRepo[] };
    return (data.items ?? []).map(repoToResult);
  } catch {
    return [];
  }
}

function parseInstallCount(installs: string): number {
  const match = installs.match(/^([\d.]+)([KMB])?\s+installs?$/);
  if (!match) return 0;
  const value = Number(match[1]);
  if (!Number.isFinite(value)) return 0;
  const multiplier = match[2] === "B" ? 1_000_000_000 : match[2] === "M" ? 1_000_000 : match[2] === "K" ? 1_000 : 1;
  return value * multiplier;
}

function dedupeResults(results: SkillSearchResult[]): SkillSearchResult[] {
  const seen = new Set<string>();
  const out: SkillSearchResult[] = [];
  for (const result of results) {
    const key = (result.url || result.package).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(result);
  }
  return out;
}

// POST /api/skills/search  body: { query: string, limit?: number }
// Searches skills.sh's registry and, in parallel, GitHub (a named "owner/repo"
// or URL resolves that exact repo; any other query searches public repos
// tagged/described as skills). Results are merged so users can find both
// registered skills and skills published only on GitHub.
export async function POST(req: Request) {
  try {
    const { query, limit: rawLimit } = await req.json() as { query?: string; limit?: unknown };
    if (!query?.trim()) return NextResponse.json({ error: "query required" }, { status: 400 });
    const limit = parseLimit(rawLimit);
    const trimmedQuery = query.trim();

    const githubResultsPromise = searchGitHubSkills(trimmedQuery, limit);

    let registryResults: SkillSearchResult[] = [];
    try {
      registryResults = await searchSkillsApi(trimmedQuery, limit);
    } catch {
      try {
        const { stdout, stderr } = await runNpx(["skills", "find", trimmedQuery], {
          timeout: 20000,
          env: { ...process.env, FORCE_COLOR: "0" },
        });
        registryResults = parseSearchOutput(stdout + stderr).slice(0, limit)
          .map((r) => ({ ...r, origin: "skills.sh" as const }));
      } catch {
        registryResults = [];
      }
    }

    const githubResults = await githubResultsPromise;
    const results = dedupeResults([...githubResults, ...registryResults]).slice(0, limit);
    if (results.length === 0 && registryResults.length === 0 && githubResults.length === 0) {
      return NextResponse.json({ results: [] });
    }
    return NextResponse.json({ results });
  } catch (e: unknown) {
    const err = e as { stdout?: string; stderr?: string; message?: string };
    const raw = (err.stdout ?? "") + (err.stderr ?? "");
    const results = raw ? parseSearchOutput(raw) : [];
    if (results.length > 0) return NextResponse.json({ results });
    return NextResponse.json({ error: err.message ?? String(e) }, { status: 500 });
  }
}
