import type { SkillInstallScope } from "./api-types";
import { fixedGitHubInstallSource, type GitHubSkillSpec } from "./skill-catalog";
import { SKILLS_CLI_PACKAGE } from "./skills-cli";

interface ReviewedSkillInstall extends GitHubSkillSpec {
  name: string;
}

export function buildReviewedSkillInstallArgs(
  reviewed: ReviewedSkillInstall,
  scope: SkillInstallScope,
): string[] {
  const args = [
    SKILLS_CLI_PACKAGE,
    "add",
    fixedGitHubInstallSource(reviewed),
    "--skill",
    reviewed.name,
    "-y",
    "--json",
    "--agent",
    "pi",
  ];
  if (scope === "global") args.push("-g");
  return args;
}

export function didInstallReviewedSkill(stdout: string, expectedName: string): boolean {
  let results: unknown;
  try {
    results = JSON.parse(stdout);
  } catch {
    return false;
  }
  return Array.isArray(results)
    && results.some((result) => (
      result
      && typeof result === "object"
      && (result as Record<string, unknown>).name === expectedName
      && (result as Record<string, unknown>).status === "installed"
    ));
}
