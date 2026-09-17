export const NO_PROJECT_WORKSPACE_DIRNAME = "workspace";

function isWindowsPath(value: string): boolean {
  return /^[a-zA-Z]:[\\/]/.test(value) || value.startsWith("\\\\") || value.startsWith("//");
}

export function normalizeWorkspaceCwd(cwd: string): string {
  const windowsPath = isWindowsPath(cwd);
  let normalized = cwd.trim().replace(/\\/g, "/");
  const prefix = normalized.startsWith("//") ? "//" : "";
  normalized = prefix + normalized.slice(prefix.length).replace(/\/{2,}/g, "/");
  if (normalized.length > 1 && !/^[a-zA-Z]:\/$/.test(normalized)) {
    normalized = normalized.replace(/\/+$/, "");
  }
  return windowsPath ? normalized.toLocaleLowerCase("en-US") : normalized;
}

export function isNoProjectWorkspace(
  cwd: string | null | undefined,
  noProjectCwd: string | null | undefined,
): boolean {
  if (!cwd || !noProjectCwd) return false;
  return normalizeWorkspaceCwd(cwd) === normalizeWorkspaceCwd(noProjectCwd);
}

export function getNoProjectWorkspaceCwd(agentDir: string): string {
  const separator = isWindowsPath(agentDir) ? "\\" : "/";
  return `${agentDir.replace(/[\\/]+$/, "")}${separator}${NO_PROJECT_WORKSPACE_DIRNAME}`;
}
