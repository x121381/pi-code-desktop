export const GITHUB_HOST = "github.com" as const;
export const MAX_SKILL_MD_BYTES = 128 * 1024;
export const MAX_SKILL_PATH_LENGTH = 512;
export const MAX_SKILLS_PACKAGE_LENGTH = 200;
export const POPULAR_CATALOG_VERSION = "2026-09-17";

export const POPULAR_REPOSITORIES = [
  { owner: "anthropics", repo: "skills" },
  { owner: "vercel-labs", repo: "agent-skills" },
  { owner: "obra", repo: "superpowers" },
  { owner: "github", repo: "awesome-copilot" },
] as const;

const OWNER_RE = /^(?!-)[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const REPO_RE = /^(?!\.{1,2}$)[A-Za-z0-9_.-]{1,100}$/;
const REVISION_RE = /^[0-9a-f]{40}$/i;
const SAFE_PATH_SEGMENT_RE = /^(?!\.{1,2}$)[A-Za-z0-9._-]+$/;
const SKILLS_PACKAGE_RE = /^(?!-)[A-Za-z0-9][A-Za-z0-9.-]{0,38}\/(?![.-]{1,2}(?:@|$))[A-Za-z0-9_][A-Za-z0-9_.-]{0,99}@[A-Za-z0-9_][A-Za-z0-9_.-]{0,99}$/;

export interface GitHubSkillSpec {
  host: typeof GITHUB_HOST;
  owner: string;
  repo: string;
  revision: string;
  skillPath: string;
}

export interface InspectedGitHubSkill extends GitHubSkillSpec {
  name: string;
  description?: string;
  license?: string;
  updatedAt: string;
  stars: number;
  url: string;
  skillFileSize: number;
  skillBlobSha: string;
}

export interface GitHubRepositoryInspection {
  owner: string;
  repo: string;
  revision: string;
  description?: string;
  license?: string;
  updatedAt: string;
  stars: number;
  url: string;
  skills: InspectedGitHubSkill[];
}

interface GitHubRepositoryResponse {
  name?: string;
  owner?: { login?: string };
  full_name?: string;
  html_url?: string;
  description?: string | null;
  default_branch?: string;
  stargazers_count?: number;
  updated_at?: string;
  license?: { spdx_id?: string | null; name?: string | null } | null;
}

interface GitHubCommitResponse {
  sha?: string;
}

interface GitHubTreeResponse {
  truncated?: boolean;
  tree?: Array<{
    path?: string;
    type?: string;
    mode?: string;
    size?: number;
    sha?: string;
  }>;
}

export class GitHubApiError extends Error {
  readonly upstreamStatus: number;
  readonly retryAfter?: string;

  constructor(message: string, upstreamStatus: number, retryAfter?: string) {
    super(message);
    this.name = "GitHubApiError";
    this.upstreamStatus = upstreamStatus;
    this.retryAfter = retryAfter;
  }

  get responseStatus(): number {
    if (this.upstreamStatus === 403 || this.upstreamStatus === 429) return 429;
    if ([400, 404, 422].includes(this.upstreamStatus)) return this.upstreamStatus;
    return 502;
  }
}

export function isGitHubOwner(value: unknown): value is string {
  return typeof value === "string" && OWNER_RE.test(value);
}

export function isGitHubRepo(value: unknown): value is string {
  return typeof value === "string" && REPO_RE.test(value);
}

export function isGitHubRevision(value: unknown): value is string {
  return typeof value === "string" && REVISION_RE.test(value);
}

export function isSafeSkillPath(value: unknown): value is string {
  if (typeof value !== "string" || value.length > MAX_SKILL_PATH_LENGTH) return false;
  if (value === "") return true;
  if (value.startsWith("/") || value.endsWith("/") || value.includes("\\") || value.includes("//")) return false;
  return value.split("/").every((segment) => SAFE_PATH_SEGMENT_RE.test(segment));
}

export function isValidSkillsPackage(value: unknown): value is string {
  return typeof value === "string"
    && value.length <= MAX_SKILLS_PACKAGE_LENGTH
    && SKILLS_PACKAGE_RE.test(value);
}

export function isPopularCatalogQuery(query: string): boolean {
  return query.trim() === "";
}

export function parseGitHubRepositoryQuery(query: string): { owner: string; repo: string } | null {
  const trimmed = query.trim();
  const match = trimmed.match(/^(?:https:\/\/github\.com\/)?([^/]+)\/([^/]+?)(?:\.git)?\/?$/i);
  if (!match || !isGitHubOwner(match[1]) || !isGitHubRepo(match[2])) return null;
  return { owner: match[1], repo: match[2] };
}

export function skillFilePath(skillPath: string): string {
  return skillPath ? `${skillPath}/SKILL.md` : "SKILL.md";
}

export function fixedGitHubInstallSource(spec: GitHubSkillSpec): string {
  if (spec.skillPath) {
    return `https://${GITHUB_HOST}/${spec.owner}/${spec.repo}/tree/${spec.revision}/${spec.skillPath}`;
  }
  return `https://${GITHUB_HOST}/${spec.owner}/${spec.repo}#${spec.revision}`;
}

function githubLicense(repo: GitHubRepositoryResponse): string | undefined {
  const spdx = repo.license?.spdx_id?.trim();
  if (spdx && spdx !== "NOASSERTION") return spdx;
  return repo.license?.name?.trim() || undefined;
}

async function requireGitHubJson<T>(fetcher: typeof fetch, url: string): Promise<T> {
  const response = await fetcher(url, { cache: "no-store" });
  if (!response.ok) {
    throw new GitHubApiError(
      `GitHub inspection failed with HTTP ${response.status}`,
      response.status,
      response.headers.get("retry-after") ?? undefined,
    );
  }
  return response.json() as Promise<T>;
}

function canonicalRepository(repo: GitHubRepositoryResponse): { owner: string; repo: string } | null {
  const owner = repo.owner?.login;
  const name = repo.name;
  if (!isGitHubOwner(owner) || !isGitHubRepo(name)) return null;
  return { owner, repo: name };
}

function skillEntries(tree: GitHubTreeResponse): Array<{
  skillPath: string;
  size: number;
  blobSha: string;
}> {
  if (tree.truncated) return [];
  const entries: Array<{ skillPath: string; size: number; blobSha: string }> = [];
  for (const item of tree.tree ?? []) {
    if (
      item.type !== "blob"
      || item.mode !== "100644"
      || typeof item.path !== "string"
      || typeof item.size !== "number"
      || !isGitHubRevision(item.sha)
    ) continue;
    if (item.path !== "SKILL.md" && !item.path.endsWith("/SKILL.md")) continue;
    if (item.size <= 0 || item.size > MAX_SKILL_MD_BYTES) continue;
    const skillPath = item.path === "SKILL.md" ? "" : item.path.slice(0, -"/SKILL.md".length);
    if (isSafeSkillPath(skillPath)) entries.push({ skillPath, size: item.size, blobSha: item.sha });
  }
  return entries;
}

function checkedMetadata(repo: GitHubRepositoryResponse): {
  canonical: { owner: string; repo: string };
  description?: string;
  license?: string;
  updatedAt: string;
  stars: number;
  url: string;
} {
  const canonical = canonicalRepository(repo);
  if (!canonical || typeof repo.updated_at !== "string" || typeof repo.html_url !== "string") {
    throw new GitHubApiError("GitHub returned incomplete repository metadata", 502);
  }
  return {
    canonical,
    description: repo.description?.trim() || undefined,
    license: githubLicense(repo),
    updatedAt: repo.updated_at,
    stars: Number.isSafeInteger(repo.stargazers_count) && (repo.stargazers_count ?? -1) >= 0
      ? repo.stargazers_count!
      : 0,
    url: repo.html_url,
  };
}

export async function inspectGitHubRepository(
  fetcher: typeof fetch,
  apiBase: string,
  owner: string,
  repoName: string,
): Promise<GitHubRepositoryInspection> {
  if (!isGitHubOwner(owner) || !isGitHubRepo(repoName)) {
    throw new GitHubApiError("Invalid GitHub owner or repository", 400);
  }

  const repo = await requireGitHubJson<GitHubRepositoryResponse>(fetcher, `${apiBase}/repos/${owner}/${repoName}`);
  const metadata = checkedMetadata(repo);
  if (!repo.default_branch) throw new GitHubApiError("GitHub repository has no default branch", 422);
  const commit = await requireGitHubJson<GitHubCommitResponse>(
    fetcher,
    `${apiBase}/repos/${metadata.canonical.owner}/${metadata.canonical.repo}/commits/${encodeURIComponent(repo.default_branch)}`,
  );
  if (!isGitHubRevision(commit.sha)) throw new GitHubApiError("GitHub returned an invalid commit revision", 502);
  const tree = await requireGitHubJson<GitHubTreeResponse>(
    fetcher,
    `${apiBase}/repos/${metadata.canonical.owner}/${metadata.canonical.repo}/git/trees/${commit.sha}?recursive=1`,
  );

  const skills = skillEntries(tree).map(({ skillPath, size, blobSha }) => ({
    host: GITHUB_HOST,
    owner: metadata.canonical.owner,
    repo: metadata.canonical.repo,
    revision: commit.sha!,
    skillPath,
    name: skillPath ? skillPath.split("/").at(-1)! : metadata.canonical.repo,
    description: metadata.description,
    license: metadata.license,
    updatedAt: metadata.updatedAt,
    stars: metadata.stars,
    url: `${metadata.url}/tree/${commit.sha}/${skillPath || ""}`.replace(/\/$/, ""),
    skillFileSize: size,
    skillBlobSha: blobSha,
  }));

  return {
    owner: metadata.canonical.owner,
    repo: metadata.canonical.repo,
    revision: commit.sha,
    description: metadata.description,
    license: metadata.license,
    updatedAt: metadata.updatedAt,
    stars: metadata.stars,
    url: metadata.url,
    skills,
  };
}

export async function revalidateGitHubSkill(
  fetcher: typeof fetch,
  apiBase: string,
  spec: GitHubSkillSpec,
): Promise<InspectedGitHubSkill> {
  if (
    spec.host !== GITHUB_HOST
    || !isGitHubOwner(spec.owner)
    || !isGitHubRepo(spec.repo)
    || !isGitHubRevision(spec.revision)
    || !isSafeSkillPath(spec.skillPath)
  ) {
    throw new GitHubApiError("Invalid GitHub skill source", 400);
  }

  const repo = await requireGitHubJson<GitHubRepositoryResponse>(fetcher, `${apiBase}/repos/${spec.owner}/${spec.repo}`);
  const metadata = checkedMetadata(repo);
  const commit = await requireGitHubJson<GitHubCommitResponse>(
    fetcher,
    `${apiBase}/repos/${metadata.canonical.owner}/${metadata.canonical.repo}/commits/${spec.revision}`,
  );
  if (!isGitHubRevision(commit.sha) || commit.sha.toLowerCase() !== spec.revision.toLowerCase()) {
    throw new GitHubApiError("GitHub revision does not resolve to the requested commit", 422);
  }
  const tree = await requireGitHubJson<GitHubTreeResponse>(
    fetcher,
    `${apiBase}/repos/${metadata.canonical.owner}/${metadata.canonical.repo}/git/trees/${spec.revision}?recursive=1`,
  );
  const entry = skillEntries(tree).find(({ skillPath }) => skillPath === spec.skillPath);
  if (!entry) throw new GitHubApiError("SKILL.md was not found at the requested path or exceeds the size limit", 422);

  return {
    ...spec,
    owner: metadata.canonical.owner,
    repo: metadata.canonical.repo,
    name: spec.skillPath ? spec.skillPath.split("/").at(-1)! : metadata.canonical.repo,
    description: metadata.description,
    license: metadata.license,
    updatedAt: metadata.updatedAt,
    stars: metadata.stars,
    url: fixedGitHubInstallSource({ ...spec, owner: metadata.canonical.owner, repo: metadata.canonical.repo }),
    skillFileSize: entry.size,
    skillBlobSha: entry.blobSha,
  };
}
