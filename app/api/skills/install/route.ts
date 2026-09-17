import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getAgentDir } from "@earendil-works/pi-coding-agent";
import { runNpx } from "@/lib/npx";
import { buildReviewedSkillInstallArgs, didInstallReviewedSkill } from "@/lib/skill-install";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { getAllowedFileRoots, isExistingFilePathAllowed } from "@/lib/file-access";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";
import { getProjectTrustStatus } from "@/lib/project-trust";
import { reviewGitHubSkill, reviewSkillsPackage } from "@/lib/github-skill-review";
import {
  GitHubApiError,
  GITHUB_HOST,
  isGitHubOwner,
  isGitHubRepo,
  isGitHubRevision,
  isSafeSkillPath,
  isValidSkillsPackage,
} from "@/lib/skill-catalog";
import { SkillContentError } from "@/lib/skill-content";
import type { SkillInstallRequest, SkillInstallScope } from "@/lib/api-types";

export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 8 * 1024;
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_INSPECT_TIMEOUT_MS = 8000;
const REVIEW_HASH_RE = /^[0-9a-f]{64}$/;

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
  const timeout = setTimeout(() => controller.abort(), GITHUB_INSPECT_TIMEOUT_MS);
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

function isScope(value: unknown): value is SkillInstallScope {
  return value === "global" || value === "project";
}

function parseInstallRequest(value: unknown): SkillInstallRequest | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (
    !isScope(body.scope)
    || (body.cwd !== undefined && typeof body.cwd !== "string")
    || typeof body.reviewHash !== "string"
    || !REVIEW_HASH_RE.test(body.reviewHash)
  ) return null;

  if (body.source === "skills.sh" && isValidSkillsPackage(body.package)) {
    return {
      source: "skills.sh",
      package: body.package,
      reviewHash: body.reviewHash,
      scope: body.scope,
      cwd: body.cwd,
    };
  }

  if (
    body.source === "github"
    && body.host === GITHUB_HOST
    && isGitHubOwner(body.owner)
    && isGitHubRepo(body.repo)
    && isGitHubRevision(body.revision)
    && isSafeSkillPath(body.skillPath)
  ) {
    return {
      source: "github",
      host: GITHUB_HOST,
      owner: body.owner,
      repo: body.repo,
      revision: body.revision.toLowerCase(),
      skillPath: body.skillPath,
      reviewHash: body.reviewHash,
      scope: body.scope,
      cwd: body.cwd,
    };
  }

  return null;
}

function reviewMatches(expected: string, actual: string): boolean {
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(actual, "hex"));
}

async function validateProjectScope(scope: SkillInstallScope, cwd: string | undefined): Promise<NextResponse | null> {
  if (scope === "global") return null;
  if (!cwd) return NextResponse.json({ error: "cwd required for project install" }, { status: 400 });
  const allowedRoots = await getAllowedFileRoots();
  if (!isExistingFilePathAllowed(cwd, allowedRoots)) {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }
  if (!getProjectTrustStatus(cwd, getAgentDir()).trusted) {
    return NextResponse.json(
      { error: "Project resources must be trusted before installing project skills" },
      { status: 403 },
    );
  }
  return null;
}

export async function POST(req: Request) {
  if (!isApiRequestAllowed(req)) {
    return NextResponse.json({ error: "Untrusted API request" }, { status: 403 });
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
  }

  try {
    const request = parseInstallRequest(await parseJsonWithinLimit(req, MAX_REQUEST_BYTES));
    if (!request) return NextResponse.json({ error: "Invalid skill install request" }, { status: 400 });

    const scopeError = await validateProjectScope(request.scope, request.cwd);
    if (scopeError) return scopeError;

    const reviewed = request.source === "github"
      ? await reviewGitHubSkill(githubFetch, GITHUB_API_BASE, request)
      : await reviewSkillsPackage(githubFetch, GITHUB_API_BASE, request.package);
    if (!reviewMatches(request.reviewHash, reviewed.contentHash)) {
      return NextResponse.json(
        { error: "Skill content changed after review; inspect it again before installing" },
        { status: 409 },
      );
    }
    const args = buildReviewedSkillInstallArgs(reviewed, request.scope);
    const { stdout } = await runNpx(args, {
      timeout: 60000,
      cwd: request.scope === "project" ? request.cwd : undefined,
      env: { ...process.env, FORCE_COLOR: "0" },
    });

    if (!didInstallReviewedSkill(stdout, reviewed.name)) {
      return NextResponse.json({ error: "Skill installation did not complete" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json({ error: "Request body is too large" }, { status: 413 });
    }
    if (error instanceof GitHubApiError) {
      const response = NextResponse.json({ error: error.message }, { status: error.responseStatus });
      if (error.retryAfter) response.headers.set("Retry-After", error.retryAfter);
      return response;
    }
    if (error instanceof SkillContentError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return NextResponse.json(
      { error: "Skill installation failed" },
      { status: 500 },
    );
  }
}
