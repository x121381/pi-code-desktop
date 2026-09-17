import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { parseSkillsPackage, reviewGitHubSkill, reviewSkillsPackage } =
  await jiti.import("./github-skill-review.ts");
const { SkillContentError } = await jiti.import("./skill-content.ts");

const API = "https://api.github.test";
const SHA = "0123456789abcdef0123456789abcdef01234567";
const BLOB_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const OTHER_BLOB_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function repository() {
  return {
    name: "skills",
    owner: { login: "acme" },
    html_url: "https://github.com/acme/skills",
    description: "Repository description",
    default_branch: "main",
    stargazers_count: 7,
    updated_at: "2026-09-01T00:00:00Z",
    license: { spdx_id: "MIT" },
  };
}

function githubFixture(source, options = {}) {
  const input = Buffer.from(source, "utf8");
  const skillPath = options.skillPath ?? "skills/review";
  const requests = [];
  const fetcher = async (url, init) => {
    const href = String(url);
    requests.push({ href, init });
    if (href.endsWith("/repos/acme/skills")) return json(repository());
    if (href.endsWith("/commits/main") || href.endsWith(`/commits/${SHA}`)) {
      return json({ sha: SHA });
    }
    if (href.includes(`/git/trees/${SHA}`)) {
      return json({
        truncated: false,
        tree: [{
          path: `${skillPath}/SKILL.md`,
          type: "blob",
          mode: "100644",
          size: input.byteLength,
          sha: BLOB_SHA,
        }],
      });
    }
    if (href.endsWith(`/git/blobs/${BLOB_SHA}`)) {
      return json({
        content: input.toString("base64"),
        encoding: "base64",
        sha: BLOB_SHA,
        size: input.byteLength,
        ...options.blob,
      });
    }
    return json({}, 404);
  };
  return { fetcher, input, requests, skillPath };
}

test("parses canonical skills.sh package identifiers", () => {
  assert.deepEqual(parseSkillsPackage("acme/skills@code-review"), {
    owner: "acme",
    repo: "skills",
    skillName: "code-review",
  });
  assert.equal(parseSkillsPackage("acme/skills"), null);
  assert.equal(parseSkillsPackage("acme/skills@../../code-review"), null);
});

test("reviews a pinned GitHub blob and uses validated frontmatter metadata", async () => {
  const source = "---\nname: code-review\ndescription: Review changes safely\n---\nBody\n";
  const fixture = githubFixture(source);
  const result = await reviewGitHubSkill(fixture.fetcher, API, {
    host: "github.com",
    owner: "acme",
    repo: "skills",
    revision: SHA,
    skillPath: fixture.skillPath,
  });

  assert.equal(result.name, "code-review");
  assert.equal(result.description, "Review changes safely");
  assert.equal(result.content, source);
  assert.equal(result.contentHash, createHash("sha256").update(fixture.input).digest("hex"));
  assert.equal(result.skillBlobSha, BLOB_SHA);
  assert.equal(result.skillFileSize, fixture.input.byteLength);
  assert.equal(result.url, `https://github.com/acme/skills/tree/${SHA}/skills/review`);
  assert.equal(fixture.requests.at(-1).href, `${API}/repos/acme/skills/git/blobs/${BLOB_SHA}`);
  assert.deepEqual(fixture.requests.map(({ init }) => init), Array(4).fill({ cache: "no-store" }));
});

test("rejects blob content whose metadata does not match the inspected tree", async () => {
  const source = "---\nname: code-review\ndescription: Review changes safely\n---\n";
  const fixture = githubFixture(source, { blob: { sha: OTHER_BLOB_SHA } });

  await assert.rejects(
    reviewGitHubSkill(fixture.fetcher, API, {
      host: "github.com",
      owner: "acme",
      repo: "skills",
      revision: SHA,
      skillPath: fixture.skillPath,
    }),
    (error) => error instanceof SkillContentError
      && error.message === "GitHub returned invalid SKILL.md content metadata",
  );
});

test("package review falls back to validated frontmatter names", async () => {
  const source = "---\nname: requested-skill\ndescription: Found by metadata\n---\n";
  const fixture = githubFixture(source, { skillPath: "skills/different-folder" });
  const result = await reviewSkillsPackage(
    fixture.fetcher,
    API,
    "acme/skills@requested-skill",
  );

  assert.equal(result.name, "requested-skill");
  assert.equal(result.skillPath, "skills/different-folder");
});
