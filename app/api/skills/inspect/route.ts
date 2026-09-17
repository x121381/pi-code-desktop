import { NextResponse } from "next/server";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import type { SkillReviewRequest, SkillReviewResponse } from "@/lib/api-types";
import { reviewGitHubSkill, reviewSkillsPackage } from "@/lib/github-skill-review";
import {
  GITHUB_HOST,
  GitHubApiError,
  isGitHubOwner,
  isGitHubRepo,
  isGitHubRevision,
  isSafeSkillPath,
  isValidSkillsPackage,
} from "@/lib/skill-catalog";
import { SkillContentError } from "@/lib/skill-content";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = 8 * 1024;
const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_INSPECT_TIMEOUT_MS = 8000;

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

function parseReviewRequest(value: unknown): SkillReviewRequest | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  if (body.source === "skills.sh" && isValidSkillsPackage(body.package)) {
    return { source: "skills.sh", package: body.package };
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
    };
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
    const request = parseReviewRequest(await parseJsonWithinLimit(req, MAX_REQUEST_BYTES));
    if (!request) return NextResponse.json({ error: "Invalid skill inspection request" }, { status: 400 });
    const reviewed = request.source === "github"
      ? await reviewGitHubSkill(githubFetch, GITHUB_API_BASE, request)
      : await reviewSkillsPackage(githubFetch, GITHUB_API_BASE, request.package);
    const response: SkillReviewResponse = {
      source: "github",
      host: GITHUB_HOST,
      owner: reviewed.owner,
      repo: reviewed.repo,
      revision: reviewed.revision,
      skillPath: reviewed.skillPath,
      name: reviewed.name,
      description: reviewed.description ?? "",
      content: reviewed.content,
      reviewHash: reviewed.contentHash,
    };
    return NextResponse.json(response);
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
    return NextResponse.json({ error: "Skill inspection failed" }, { status: 500 });
  }
}
