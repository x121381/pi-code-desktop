import { NextResponse } from "next/server";
import { runNpx } from "@/lib/npx";
import { SKILLS_CLI_PACKAGE } from "@/lib/skills-cli";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";
import {
  GitHubApiError,
  inspectGitHubRepository,
  isPopularCatalogQuery,
  isValidSkillsPackage,
  parseGitHubRepositoryQuery,
  POPULAR_CATALOG_VERSION,
  POPULAR_REPOSITORIES,
} from "@/lib/skill-catalog";
import type { SkillSearchResponse, SkillSearchResult } from "@/lib/api-types";

export const dynamic = "force-dynamic";

const ANSI_RE = /\x1B\[[0-9;]*m/g;
const DEFAULT_LIMIT = 30;
const MIN_LIMIT = 1;
const MAX_LIMIT = 50;
const MAX_QUERY_LENGTH = 160;
const MAX_REQUEST_BYTES = 8 * 1024;
const SEARCH_API_BASE = process.env.SKILLS_API_URL || "https://skills.sh";
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_SEARCH_TIMEOUT_MS = 8000;
const MAX_GITHUB_REPOSITORIES = 5;
const POPULARITY_NOTICE = "Popularity signals are informational and do not imply trust or a security audit. Review every skill before installing it.";

interface SkillsApiSkill {
  id?: string;
  name?: string;
  source?: string;
  installs?: number;
}

interface SkillsApiResponse {
  skills?: SkillsApiSkill[];
}

interface GitHubSearchRepository {
  full_name?: string;
}

function parseLimit(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, Math.floor(num)));
}

function registryResult(pkg: string, name: string, installs: number, url: string): SkillSearchResult {
  return {
    id: `skills.sh:${pkg}`,
    name,
    url,
    provenance: { source: "skills.sh", package: pkg },
    popularity: { installs },
    inspected: false,
  };
}

function parseInstallCount(installs: string): number {
  const match = installs.match(/^([\d.,]+)([KMB])?\s+installs?$/i);
  if (!match) return 0;
  const value = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(value)) return 0;
  const unit = match[2]?.toUpperCase();
  const multiplier = unit === "B" ? 1_000_000_000 : unit === "M" ? 1_000_000 : unit === "K" ? 1_000 : 1;
  return Math.round(value * multiplier);
}

function parseSearchOutput(raw: string): SkillSearchResult[] {
  const clean = raw.replace(ANSI_RE, "");
  const results: SkillSearchResult[] = [];
  const lines = clean.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^([\w.-]+\/[\w.-]+@[\w.-]+)\s+([\d.,]+[KMB]?\s+installs)$/i);
    if (!match || !isValidSkillsPackage(match[1])) continue;
    const urlLine = lines[i + 1]?.trim().replace(/^└\s*/, "");
    const name = match[1].slice(match[1].lastIndexOf("@") + 1);
    results.push(registryResult(
      match[1],
      name,
      parseInstallCount(match[2]),
      urlLine?.startsWith("https://") ? urlLine : "",
    ));
  }
  return results;
}

async function searchSkillsApi(query: string, limit: number): Promise<SkillSearchResult[]> {
  const url = `${SEARCH_API_BASE}/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`skills.sh search failed: HTTP ${response.status}`);

  const data = await response.json() as SkillsApiResponse;
  return (data.skills ?? [])
    .map((skill): SkillSearchResult | null => {
      const name = skill.name?.trim();
      const source = skill.source?.trim();
      const slug = skill.id?.trim();
      const pkg = name && source ? `${source}@${name}` : "";
      if (!name || !isValidSkillsPackage(pkg)) return null;
      return registryResult(
        pkg,
        name,
        Number.isSafeInteger(skill.installs) && (skill.installs ?? -1) >= 0 ? skill.installs! : 0,
        slug ? `${SEARCH_API_BASE}/${slug}` : "",
      );
    })
    .filter((skill): skill is SkillSearchResult => skill !== null)
    .sort((a, b) => (b.popularity.installs ?? 0) - (a.popularity.installs ?? 0));
}

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "pi-code-desktop",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function githubFetch(input: string | URL | Request, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GITHUB_SEARCH_TIMEOUT_MS);
  try {
    return await fetch(input, {
      ...init,
      headers: { ...githubHeaders(), ...Object.fromEntries(new Headers(init?.headers).entries()) },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

function inspectedResults(inspection: Awaited<ReturnType<typeof inspectGitHubRepository>>): SkillSearchResult[] {
  return inspection.skills.map((skill) => ({
    id: `github:${skill.owner}/${skill.repo}@${skill.revision}:${skill.skillPath}`,
    name: skill.name,
    description: skill.description,
    url: skill.url,
    provenance: {
      source: "github",
      host: skill.host,
      owner: skill.owner,
      repo: skill.repo,
    },
    popularity: { stars: skill.stars },
    revision: skill.revision,
    skillPath: skill.skillPath,
    license: skill.license,
    updatedAt: skill.updatedAt,
    inspected: true,
  }));
}

async function inspectRepositories(repositories: Array<{ owner: string; repo: string }>): Promise<SkillSearchResult[]> {
  const settled = await Promise.allSettled(
    repositories.map(({ owner, repo }) => inspectGitHubRepository(githubFetch, GITHUB_API_BASE, owner, repo)),
  );
  const rateLimitError = settled.find(
    (result): result is PromiseRejectedResult => result.status === "rejected"
      && result.reason instanceof GitHubApiError
      && (result.reason.upstreamStatus === 403 || result.reason.upstreamStatus === 429),
  );
  if (rateLimitError) throw rateLimitError.reason;
  return settled.flatMap((result) => result.status === "fulfilled" ? inspectedResults(result.value) : []);
}

async function searchGitHubSkills(query: string): Promise<SkillSearchResult[]> {
  const exact = parseGitHubRepositoryQuery(query);
  if (exact) return inspectRepositories([exact]);

  const q = `${query} skill in:name,description,topics`;
  const response = await githubFetch(
    `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${MAX_GITHUB_REPOSITORIES}`,
  );
  if (!response.ok) {
    throw new GitHubApiError(
      `GitHub search failed with HTTP ${response.status}`,
      response.status,
      response.headers.get("retry-after") ?? undefined,
    );
  }
  const data = await response.json() as { items?: GitHubSearchRepository[] };
  const repositories = (data.items ?? []).flatMap((item) => {
    const parsed = item.full_name ? parseGitHubRepositoryQuery(item.full_name) : null;
    return parsed ? [parsed] : [];
  });
  return inspectRepositories(repositories);
}

function dedupeResults(results: SkillSearchResult[]): SkillSearchResult[] {
  const seen = new Set<string>();
  return results.filter((result) => {
    if (seen.has(result.id)) return false;
    seen.add(result.id);
    return true;
  });
}

async function registryResults(query: string, limit: number): Promise<SkillSearchResult[]> {
  try {
    return await searchSkillsApi(query, limit);
  } catch {
    if (!query) return [];
    try {
      const { stdout, stderr } = await runNpx([SKILLS_CLI_PACKAGE, "find", query], {
        timeout: 20000,
        env: { ...process.env, FORCE_COLOR: "0" },
      });
      return parseSearchOutput(stdout + stderr).slice(0, limit);
    } catch {
      return [];
    }
  }
}

async function popularResults(limit: number): Promise<SkillSearchResponse> {
  const [registry, github] = await Promise.all([
    registryResults("", limit),
    inspectRepositories([...POPULAR_REPOSITORIES]),
  ]);
  const results = dedupeResults([...registry, ...github])
    .sort((a, b) => {
      const installs = (b.popularity.installs ?? 0) - (a.popularity.installs ?? 0);
      return installs || (b.popularity.stars ?? 0) - (a.popularity.stars ?? 0);
    })
    .slice(0, limit);
  return { results, catalogVersion: POPULAR_CATALOG_VERSION, notice: POPULARITY_NOTICE };
}

export async function POST(req: Request) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const body = await parseJsonWithinLimit(req, MAX_REQUEST_BYTES) as { query?: unknown; limit?: unknown } | null;
    if (!body || (body.query !== undefined && typeof body.query !== "string")) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
    const query = (body.query ?? "").trim();
    if (query.length > MAX_QUERY_LENGTH) {
      return NextResponse.json({ error: "query is too long" }, { status: 400 });
    }
    const limit = parseLimit(body.limit);
    if (isPopularCatalogQuery(query)) return NextResponse.json(await popularResults(limit));

    const [registry, github] = await Promise.all([
      registryResults(query, limit),
      searchGitHubSkills(query),
    ]);
    return NextResponse.json({
      results: dedupeResults([...github, ...registry]).slice(0, limit),
      notice: POPULARITY_NOTICE,
    } satisfies SkillSearchResponse);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
    if (error instanceof GitHubApiError) {
      const response = NextResponse.json({ error: error.message }, { status: error.responseStatus });
      if (error.retryAfter) response.headers.set("Retry-After", error.retryAfter);
      return response;
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
