import assert from "node:assert/strict";
import test from "node:test";
import {
  fixedGitHubInstallSource,
  GitHubApiError,
  inspectGitHubRepository,
  isGitHubRevision,
  isPopularCatalogQuery,
  isSafeSkillPath,
  isValidSkillsPackage,
  revalidateGitHubSkill,
} from "./skill-catalog.ts";

const SHA = "0123456789abcdef0123456789abcdef01234567";
const BLOB_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const OTHER_BLOB_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";
const API = "https://api.github.test";

function json(data, status = 200, headers) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function repository() {
  return {
    name: "skills",
    owner: { login: "acme" },
    full_name: "acme/skills",
    html_url: "https://github.com/acme/skills",
    description: "Focused agent skills",
    default_branch: "main",
    stargazers_count: 42,
    updated_at: "2026-09-01T00:00:00Z",
    license: { spdx_id: "MIT" },
  };
}

test("empty and whitespace queries select the versioned popular catalog", () => {
  assert.equal(isPopularCatalogQuery(""), true);
  assert.equal(isPopularCatalogQuery("   \n"), true);
  assert.equal(isPopularCatalogQuery("react"), false);
});

test("repository inspection returns one result per valid SKILL.md path", async () => {
  const fetcher = async (url) => {
    if (String(url).endsWith("/repos/acme/skills")) return json(repository());
    if (String(url).endsWith("/commits/main")) return json({ sha: SHA });
    if (String(url).includes(`/git/trees/${SHA}`)) {
      return json({
        truncated: false,
        tree: [
          { path: "SKILL.md", type: "blob", mode: "100644", size: 100, sha: BLOB_SHA },
          { path: "skills/review/SKILL.md", type: "blob", mode: "100644", size: 200, sha: OTHER_BLOB_SHA },
          { path: "skills/huge/SKILL.md", type: "blob", mode: "100644", size: 999999, sha: BLOB_SHA },
          { path: "README.md", type: "blob", mode: "100644", size: 50, sha: BLOB_SHA },
        ],
      });
    }
    return json({}, 404);
  };

  const result = await inspectGitHubRepository(fetcher, API, "acme", "skills");
  assert.equal(result.revision, SHA);
  assert.deepEqual(result.skills.map((skill) => skill.skillPath), ["", "skills/review"]);
  assert.equal(result.skills[1].license, "MIT");
  assert.equal(result.skills[1].stars, 42);
});

test("repository without a bounded SKILL.md returns no installable skills", async () => {
  const fetcher = async (url) => {
    if (String(url).endsWith("/repos/acme/skills")) return json(repository());
    if (String(url).endsWith("/commits/main")) return json({ sha: SHA });
    return json({
      truncated: false,
      tree: [{ path: "README.md", type: "blob", mode: "100644", size: 10, sha: BLOB_SHA }],
    });
  };
  const result = await inspectGitHubRepository(fetcher, API, "acme", "skills");
  assert.deepEqual(result.skills, []);
});

test("repository inspection rejects SKILL.md symlinks", async () => {
  const fetcher = async (url) => {
    if (String(url).endsWith("/repos/acme/skills")) return json(repository());
    if (String(url).endsWith("/commits/main")) return json({ sha: SHA });
    return json({
      truncated: false,
      tree: [{
        path: "skills/linked/SKILL.md",
        type: "blob",
        mode: "120000",
        size: 20,
        sha: BLOB_SHA,
      }],
    });
  };

  const result = await inspectGitHubRepository(fetcher, API, "acme", "skills");
  assert.deepEqual(result.skills, []);
});

test("skill path and package validation reject traversal and unsafe syntax", () => {
  assert.equal(isSafeSkillPath("skills/review"), true);
  assert.equal(isSafeSkillPath("../review"), false);
  assert.equal(isSafeSkillPath("skills/../review"), false);
  assert.equal(isSafeSkillPath("skills\\review"), false);
  assert.equal(isValidSkillsPackage("owner/repo@review"), true);
  assert.equal(isValidSkillsPackage("github:owner/repo"), false);
  assert.equal(isValidSkillsPackage("owner/repo@../../review"), false);
});

test("revision validation requires a full 40 character commit SHA", () => {
  assert.equal(isGitHubRevision(SHA), true);
  assert.equal(isGitHubRevision(SHA.toUpperCase()), true);
  assert.equal(isGitHubRevision(SHA.slice(0, 39)), false);
  assert.equal(isGitHubRevision("main"), false);
  assert.equal(isGitHubRevision(`${SHA}x`), false);
});

test("fixed GitHub sources retain revision and skill path", () => {
  assert.equal(
    fixedGitHubInstallSource({ host: "github.com", owner: "acme", repo: "skills", revision: SHA, skillPath: "skills/review" }),
    `https://github.com/acme/skills/tree/${SHA}/skills/review`,
  );
  assert.equal(
    fixedGitHubInstallSource({ host: "github.com", owner: "acme", repo: "skills", revision: SHA, skillPath: "" }),
    `https://github.com/acme/skills#${SHA}`,
  );
});

test("install revalidation rejects a revision with no matching SKILL.md", async () => {
  const fetcher = async (url) => {
    if (String(url).endsWith("/repos/acme/skills")) return json(repository());
    if (String(url).endsWith(`/commits/${SHA}`)) return json({ sha: SHA });
    return json({
      truncated: false,
      tree: [{ path: "README.md", type: "blob", mode: "100644", size: 10, sha: BLOB_SHA }],
    });
  };
  await assert.rejects(
    revalidateGitHubSkill(fetcher, API, {
      host: "github.com",
      owner: "acme",
      repo: "skills",
      revision: SHA,
      skillPath: "skills/review",
    }),
    (error) => error instanceof GitHubApiError && error.upstreamStatus === 422,
  );
});

for (const status of [403, 429]) {
  test(`GitHub HTTP ${status} is surfaced as a rate-limit response`, async () => {
    const fetcher = async () => json({ message: "rate limited" }, status, { "retry-after": "30" });
    await assert.rejects(
      inspectGitHubRepository(fetcher, API, "acme", "skills"),
      (error) => error instanceof GitHubApiError
        && error.upstreamStatus === status
        && error.responseStatus === 429
        && error.retryAfter === "30",
    );
  });
}
