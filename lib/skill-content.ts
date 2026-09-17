import { createHash } from "node:crypto";
import { isAlias, isMap, isScalar, parseDocument, visit } from "yaml";
import { MAX_SKILL_MD_BYTES } from "./skill-catalog";

const MAX_FRONTMATTER_BYTES = 16 * 1024;
const MAX_FRONTMATTER_DEPTH = 8;
const MAX_FRONTMATTER_NODES = 256;
const MAX_NAME_LENGTH = 64;
const MAX_DESCRIPTION_LENGTH = 1024;
const SKILL_NAME_RE = /^(?!-)(?!.*--)[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface InspectedSkillContent {
  content: string;
  contentHash: string;
  name: string;
  description: string;
}

export class SkillContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SkillContentError";
  }
}

function decodeUtf8(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new SkillContentError("SKILL.md must be valid UTF-8 text");
  }
}

function frontmatterSource(content: string): string {
  const normalized = content.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  if (!normalized.startsWith("---\n")) {
    throw new SkillContentError("SKILL.md must begin with YAML frontmatter");
  }
  const closingMarker = normalized.slice(4).match(/^---$/m);
  if (!closingMarker || closingMarker.index === undefined) {
    throw new SkillContentError("SKILL.md frontmatter is not terminated");
  }
  const yaml = normalized.slice(4, 4 + closingMarker.index);
  if (Buffer.byteLength(yaml, "utf8") > MAX_FRONTMATTER_BYTES) {
    throw new SkillContentError("SKILL.md frontmatter exceeds the size limit");
  }
  return yaml;
}

function validateDocumentShape(document: ReturnType<typeof parseDocument>): void {
  if (document.errors.length > 0) {
    throw new SkillContentError("SKILL.md frontmatter is invalid YAML");
  }
  if (!isMap(document.contents)) {
    throw new SkillContentError("SKILL.md frontmatter must be a mapping");
  }

  let nodeCount = 0;
  visit(document, (_key, node, path) => {
    nodeCount += 1;
    if (nodeCount > MAX_FRONTMATTER_NODES) {
      throw new SkillContentError("SKILL.md frontmatter is too complex");
    }
    if (path.length > MAX_FRONTMATTER_DEPTH) {
      throw new SkillContentError("SKILL.md frontmatter is nested too deeply");
    }
    if (isAlias(node) || ("anchor" in Object(node) && typeof Object(node).anchor === "string")) {
      throw new SkillContentError("SKILL.md frontmatter cannot use YAML anchors or aliases");
    }
  });

  const seen = new Set<string>();
  for (const pair of document.contents.items) {
    if (!isScalar(pair.key) || typeof pair.key.value !== "string") {
      throw new SkillContentError("SKILL.md frontmatter keys must be strings");
    }
    if (seen.has(pair.key.value)) {
      throw new SkillContentError("SKILL.md frontmatter contains duplicate keys");
    }
    seen.add(pair.key.value);
  }
}

export function inspectSkillContent(bytes: Uint8Array): InspectedSkillContent {
  if (bytes.byteLength <= 0 || bytes.byteLength > MAX_SKILL_MD_BYTES) {
    throw new SkillContentError("SKILL.md is empty or exceeds the size limit");
  }
  const content = decodeUtf8(bytes);
  if (content.includes("\0")) throw new SkillContentError("SKILL.md contains invalid text data");

  const document = parseDocument(frontmatterSource(content), {
    prettyErrors: false,
    uniqueKeys: true,
  });
  validateDocumentShape(document);
  const metadata = document.toJS({ maxAliasCount: 0 }) as Record<string, unknown>;
  const name = typeof metadata.name === "string" ? metadata.name.trim() : "";
  const description = typeof metadata.description === "string" ? metadata.description.trim() : "";

  if (!SKILL_NAME_RE.test(name) || name.length > MAX_NAME_LENGTH) {
    throw new SkillContentError("SKILL.md has an invalid skill name");
  }
  if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
    throw new SkillContentError("SKILL.md has an invalid skill description");
  }

  return {
    content,
    contentHash: createHash("sha256").update(bytes).digest("hex"),
    name,
    description,
  };
}
