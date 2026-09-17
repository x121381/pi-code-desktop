import type { ResourceDiagnostic } from "@earendil-works/pi-coding-agent";

export type SkillSearchProvenance =
  | { source: "skills.sh"; package: string }
  | { source: "github"; host: "github.com"; owner: string; repo: string };

export interface SkillSearchResult {
  id: string;
  name: string;
  description?: string;
  url: string;
  provenance: SkillSearchProvenance;
  popularity: {
    installs?: number;
    stars?: number;
  };
  revision?: string;
  skillPath?: string;
  license?: string;
  updatedAt?: string;
  inspected: boolean;
}

export interface SkillSearchResponse {
  results: SkillSearchResult[];
  catalogVersion?: string;
  notice: string;
}

export type SkillReviewRequest =
  | { source: "skills.sh"; package: string }
  | {
      source: "github";
      host: "github.com";
      owner: string;
      repo: string;
      revision: string;
      skillPath: string;
    };

export interface SkillReviewResponse {
  source: "github";
  host: "github.com";
  owner: string;
  repo: string;
  revision: string;
  skillPath: string;
  name: string;
  description: string;
  content: string;
  reviewHash: string;
}

export type SkillInstallRequest =
  | {
      source: "skills.sh";
      package: string;
      reviewHash: string;
      scope: SkillInstallScope;
      cwd?: string;
    }
  | {
      source: "github";
      host: "github.com";
      owner: string;
      repo: string;
      skillPath: string;
      revision: string;
      reviewHash: string;
      scope: SkillInstallScope;
      cwd?: string;
    };

export type SkillInstallScope = "global" | "project";

export interface SkillInstallInfo {
  package: string;
  scope: SkillInstallScope;
  source: string;
  sourceType?: string;
  skillsShUrl?: string;
  skillPath?: string;
  ref?: string;
  versionHash?: string;
  canCheckForUpdates: boolean;
}

export type SkillUpdateState =
  | "up-to-date"
  | "update-available"
  | "unsupported"
  | "error";

export interface SkillUpdateResult {
  package: string;
  scope: SkillInstallScope;
  state: SkillUpdateState;
  currentVersion?: string;
  latestVersion?: string;
  message?: string;
}

export interface SkillInfo {
  name: string;
  description: string;
  filePath: string;
  baseDir: string;
  disableModelInvocation: boolean;
  sourceInfo: {
    source?: string;
    scope?: string;
  };
  install?: SkillInstallInfo;
}

export interface SkillsResponse {
  skills: SkillInfo[];
  diagnostics: ResourceDiagnostic[];
  projectResourcesLoaded: boolean;
}

export interface ProjectTrustStatus {
  requiresTrust: boolean;
  trusted: boolean;
}

export type PluginScope = "global" | "project";
export type PluginResourceKind = "extension" | "skill" | "prompt" | "theme";

export interface PluginResourceCounts {
  extensions: number;
  skills: number;
  prompts: number;
  themes: number;
}

export interface PluginDiagnostic {
  type: "warning" | "error";
  message: string;
  source?: string;
  path?: string;
}

export interface PluginResourceInfo {
  kind: PluginResourceKind;
  name: string;
  path: string;
  relativePath: string;
}

export interface PluginPackageInfo {
  source: string;
  scope: PluginScope;
  filtered: boolean;
  disabled: boolean;
  installedPath?: string;
  packageName?: string;
  version?: string;
  configuredVersion?: string;
  counts: PluginResourceCounts;
  resources: PluginResourceInfo[];
  status: "loaded" | "installed" | "missing" | "disabled";
}

export interface PluginsResponse {
  packages: PluginPackageInfo[];
  totals: PluginResourceCounts;
  diagnostics: PluginDiagnostic[];
  projectResourcesLoaded: boolean;
}
