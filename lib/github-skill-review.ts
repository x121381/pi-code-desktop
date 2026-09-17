import {
  inspectGitHubRepository,
  isGitHubRevision,
  isValidSkillsPackage,
  MAX_SKILL_MD_BYTES,
  revalidateGitHubSkill,
  type GitHubSkillSpec,
  type InspectedGitHubSkill,
} from "./skill-catalog";
import { inspectSkillContent, SkillContentError } from "./skill-content";

interface GitHubBlobResponse {
  content?: unknown;
  encoding?: unknown;
  sha?: unknown;
  size?: unknown;
}

export interface ReviewedGitHubSkill extends InspectedGitHubSkill {
  content: string;
  contentHash: string;
}

export function parseSkillsPackage(value: string): {
  owner: string;
  repo: string;
  skillName: string;
} | null {
  if (!isValidSkillsPackage(value)) return null;
  const at = value.lastIndexOf("@");
  const [owner, repo] = value.slice(0, at).split("/", 2);
  return { owner, repo, skillName: value.slice(at + 1) };
}

function decodeBase64Blob(raw: GitHubBlobResponse, expected: InspectedGitHubSkill): Uint8Array {
  if (
    raw.encoding !== "base64"
    || raw.sha !== expected.skillBlobSha
    || !isGitHubRevision(raw.sha)
    || typeof raw.content !== "string"
    || typeof raw.size !== "number"
    || raw.size !== expected.skillFileSize
    || raw.size <= 0
    || raw.size > MAX_SKILL_MD_BYTES
  ) {
    throw new SkillContentError("GitHub returned invalid SKILL.md content metadata");
  }
  const encoded = raw.content.replace(/\s/g, "");
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new SkillContentError("GitHub returned invalid SKILL.md content encoding");
  }
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.byteLength !== raw.size) {
    throw new SkillContentError("GitHub returned incomplete SKILL.md content");
  }
  return bytes;
}

async function readReviewedSkill(
  fetcher: typeof fetch,
  apiBase: string,
  inspected: InspectedGitHubSkill,
): Promise<ReviewedGitHubSkill> {
  const response = await fetcher(
    `${apiBase}/repos/${inspected.owner}/${inspected.repo}/git/blobs/${inspected.skillBlobSha}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new SkillContentError(`GitHub SKILL.md inspection failed with HTTP ${response.status}`);
  }
  const bytes = decodeBase64Blob(await response.json() as GitHubBlobResponse, inspected);
  const content = inspectSkillContent(bytes);
  return {
    ...inspected,
    name: content.name,
    description: content.description,
    content: content.content,
    contentHash: content.contentHash,
  };
}

export async function reviewGitHubSkill(
  fetcher: typeof fetch,
  apiBase: string,
  spec: GitHubSkillSpec,
): Promise<ReviewedGitHubSkill> {
  const inspected = await revalidateGitHubSkill(fetcher, apiBase, spec);
  return readReviewedSkill(fetcher, apiBase, inspected);
}

export async function reviewSkillsPackage(
  fetcher: typeof fetch,
  apiBase: string,
  pkg: string,
): Promise<ReviewedGitHubSkill> {
  const parsed = parseSkillsPackage(pkg);
  if (!parsed) throw new SkillContentError("Invalid skills.sh package");
  const repository = await inspectGitHubRepository(fetcher, apiBase, parsed.owner, parsed.repo);
  const exactCandidates = repository.skills.filter((skill) => {
    const folderName = skill.skillPath.split("/").at(-1) || repository.repo;
    return folderName.toLowerCase() === parsed.skillName.toLowerCase();
  });
  const candidates = exactCandidates.length > 0 ? exactCandidates : repository.skills.slice(0, 20);
  for (const candidate of candidates) {
    try {
      const reviewed = await readReviewedSkill(fetcher, apiBase, candidate);
      if (reviewed.name.toLowerCase() === parsed.skillName.toLowerCase()) return reviewed;
    } catch (error) {
      if (error instanceof SkillContentError) continue;
      throw error;
    }
  }
  throw new SkillContentError("The requested skill was not found in the inspected repository");
}
