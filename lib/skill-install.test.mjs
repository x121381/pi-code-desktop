import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const { buildReviewedSkillInstallArgs, didInstallReviewedSkill } =
  await createJiti(import.meta.url).import("./skill-install.ts");

const SHA = "0123456789abcdef0123456789abcdef01234567";
const reviewed = {
  host: "github.com",
  owner: "acme",
  repo: "skills",
  revision: SHA,
  skillPath: "skills/code-review",
  name: "code-review",
};

test("builds a pinned non-interactive JSON install command for the reviewed skill", () => {
  assert.deepEqual(buildReviewedSkillInstallArgs(reviewed, "global"), [
    "skills@1.6.0",
    "add",
    `https://github.com/acme/skills/tree/${SHA}/skills/code-review`,
    "--skill",
    "code-review",
    "-y",
    "--json",
    "--agent",
    "pi",
    "-g",
  ]);
  assert.deepEqual(buildReviewedSkillInstallArgs({ ...reviewed, skillPath: "" }, "project"), [
    "skills@1.6.0",
    "add",
    `https://github.com/acme/skills#${SHA}`,
    "--skill",
    "code-review",
    "-y",
    "--json",
    "--agent",
    "pi",
  ]);
});

test("accepts only a matching installed result", () => {
  assert.equal(didInstallReviewedSkill(
    JSON.stringify([{ name: "code-review", status: "installed" }]),
    "code-review",
  ), true);
  assert.equal(didInstallReviewedSkill(
    JSON.stringify([{ name: "other", status: "installed" }]),
    "code-review",
  ), false);
  assert.equal(didInstallReviewedSkill(
    JSON.stringify([{ name: "code-review", status: "skipped" }]),
    "code-review",
  ), false);
  assert.equal(didInstallReviewedSkill("Installation complete", "code-review"), false);
});
