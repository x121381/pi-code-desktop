export interface ToolEntry {
  name: string;
  description: string;
  active: boolean;
}

export type PermissionMode = "restricted" | "approval" | "full";
export type LegacyToolPreset = "none" | "default" | "full";

export const RESTRICTED_TOOLS: string[] = ["read", "grep", "find", "ls"];
export const FULL_TOOLS: string[] = ["bash", "read", "edit", "write", "grep", "find", "ls"];

const BUILTIN_TOOL_NAMES = new Set(FULL_TOOLS);

export function getPermissionModeFromTools(tools: ToolEntry[]): PermissionMode {
  const activeTools = tools.filter((t) => t.active);
  if (activeTools.length === 0) return "restricted";

  const active = activeTools
    .map((t) => t.name)
    .filter((name) => BUILTIN_TOOL_NAMES.has(name))
    .sort()
    .join(",");

  if (active === [...RESTRICTED_TOOLS].sort().join(",")) return "restricted";
  return "approval";
}

export function getToolNamesForPermissionMode(mode: PermissionMode): string[] {
  return mode === "restricted" ? [...RESTRICTED_TOOLS] : [...FULL_TOOLS];
}

/** Compatibility for callers outside the React permission-mode flow. */
export function getToolNamesForPreset(preset: LegacyToolPreset): string[] {
  if (preset === "none") return [];
  if (preset === "full") return [...FULL_TOOLS];
  return ["read", "bash", "edit", "write"];
}
