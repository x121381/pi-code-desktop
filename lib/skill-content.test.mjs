import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { inspectSkillContent, SkillContentError } = await jiti.import("./skill-content.ts");

function bytes(value) {
  return Buffer.from(value, "utf8");
}

test("validates metadata while preserving decoded content and hashing original bytes", () => {
  const source = "\uFEFF---\r\nname: code-review\r\ndescription:  Focused review  \r\n---\r\nBody\r\n";
  const input = bytes(source);
  const result = inspectSkillContent(input);

  assert.equal(result.content, source.slice(1));
  assert.equal(result.name, "code-review");
  assert.equal(result.description, "Focused review");
  assert.equal(result.contentHash, createHash("sha256").update(input).digest("hex"));
});

test("rejects invalid text and missing frontmatter", () => {
  const cases = [
    [new Uint8Array(), "SKILL.md is empty or exceeds the size limit"],
    [Uint8Array.of(0xff), "SKILL.md must be valid UTF-8 text"],
    [bytes("---\nname: demo\ndescription: bad\0data\n---\n"), "SKILL.md contains invalid text data"],
    [bytes("# no frontmatter\n"), "SKILL.md must begin with YAML frontmatter"],
    [bytes("---\nname: demo\ndescription: missing terminator\n"), "SKILL.md frontmatter is not terminated"],
  ];

  for (const [input, message] of cases) {
    assert.throws(
      () => inspectSkillContent(input),
      (error) => error instanceof SkillContentError && error.message === message,
    );
  }
});

test("rejects unsafe YAML document shapes", () => {
  assert.throws(
    () => inspectSkillContent(bytes("---\n- name: demo\n- description: list\n---\n")),
    (error) => error instanceof SkillContentError
      && error.message === "SKILL.md frontmatter must be a mapping",
  );
  assert.throws(
    () => inspectSkillContent(bytes("---\nname: first\nname: second\ndescription: duplicate\n---\n")),
    (error) => error instanceof SkillContentError
      && error.message === "SKILL.md frontmatter is invalid YAML",
  );
  assert.throws(
    () => inspectSkillContent(bytes("---\nname: demo\ndescription: &text reusable\nother: *text\n---\n")),
    (error) => error instanceof SkillContentError
      && error.message === "SKILL.md frontmatter cannot use YAML anchors or aliases",
  );
});

test("requires normalized skill names and bounded descriptions", () => {
  for (const source of [
    "---\nname: Invalid_Name\ndescription: valid\n---\n",
    "---\nname: invalid--name\ndescription: valid\n---\n",
    `---\nname: ${"a".repeat(65)}\ndescription: valid\n---\n`,
  ]) {
    assert.throws(
      () => inspectSkillContent(bytes(source)),
      (error) => error instanceof SkillContentError
        && error.message === "SKILL.md has an invalid skill name",
    );
  }

  for (const source of [
    "---\nname: valid\ndescription: \n---\n",
    `---\nname: valid\ndescription: ${"a".repeat(1025)}\n---\n`,
  ]) {
    assert.throws(
      () => inspectSkillContent(bytes(source)),
      (error) => error instanceof SkillContentError
        && error.message === "SKILL.md has an invalid skill description",
    );
  }
});

test("requires the closing frontmatter marker to occupy its own line", () => {
  const source = "---\nname: demo\ndescription: valid\n---not-a-delimiter\nBody\n";
  assert.throws(
    () => inspectSkillContent(bytes(source)),
    (error) => error instanceof SkillContentError
      && error.message === "SKILL.md frontmatter is not terminated",
  );
});
