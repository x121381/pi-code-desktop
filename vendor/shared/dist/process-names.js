const ZCODE_PROCESS_PREFIX = "zcode";
const MAX_PROCESS_NAME_SEGMENT_LENGTH = 24;
function sanitizeProcessNameSegment(value) {
    if (!value) {
        return null;
    }
    const normalized = value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    if (!normalized) {
        return null;
    }
    return normalized.slice(0, MAX_PROCESS_NAME_SEGMENT_LENGTH);
}
function joinZCodeProcessName(...segments) {
    const sanitizedSegments = segments
        .map((segment) => sanitizeProcessNameSegment(segment))
        .filter((segment) => Boolean(segment));
    return [ZCODE_PROCESS_PREFIX, ...sanitizedSegments].join("-");
}
function pickWorkspaceTag(workspacePath) {
    const trimmedPath = workspacePath?.trim();
    if (!trimmedPath) {
        return undefined;
    }
    const parts = trimmedPath.split(/[\\/]+/).filter(Boolean);
    return parts.at(-1) ?? trimmedPath;
}
export function formatZCodeMainProcessName() {
    return joinZCodeProcessName("main");
}
export function formatZCodeGpuProcessName() {
    return joinZCodeProcessName("gpu");
}
export function formatZCodeHostProcessName(label) {
    return joinZCodeProcessName("host", label);
}
export function formatZCodeRendererProcessName(windowTitle) {
    const normalizedTitle = windowTitle?.trim();
    if (!normalizedTitle || normalizedTitle === "ZCode") {
        return joinZCodeProcessName("renderer", "main");
    }
    if (normalizedTitle === "Resource Manager") {
        return joinZCodeProcessName("renderer", "resource-manager");
    }
    const remoteWindowPrefix = "ZCode - ";
    if (normalizedTitle.startsWith(remoteWindowPrefix)) {
        return joinZCodeProcessName("renderer", "remote", normalizedTitle.slice(remoteWindowPrefix.length));
    }
    return joinZCodeProcessName("renderer", normalizedTitle);
}
export function formatZCodeAgentProcessName(provider, workspacePath) {
    return joinZCodeProcessName("agent", provider, pickWorkspaceTag(workspacePath));
}
export function formatZCodeUtilityProcessName(name, type = "utility") {
    return joinZCodeProcessName(type, name);
}
//# sourceMappingURL=process-names.js.map