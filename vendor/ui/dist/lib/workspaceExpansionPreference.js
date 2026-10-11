export const WORKSPACE_EXPANSION_STORAGE_KEY = "zcode-workspace-expansion";
function getBrowserStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch {
        return null;
    }
}
function normalizeWorkspaceExpansionState(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return {};
    }
    return Object.fromEntries(Object.entries(value).filter((entry) => typeof entry[0] === "string" && typeof entry[1] === "boolean"));
}
export function readWorkspaceExpansionState(storage = getBrowserStorage()) {
    const rawValue = storage?.getItem(WORKSPACE_EXPANSION_STORAGE_KEY);
    if (!rawValue) {
        return {};
    }
    try {
        return normalizeWorkspaceExpansionState(JSON.parse(rawValue));
    }
    catch {
        return {};
    }
}
function persistWorkspaceExpansionState(state, storage = getBrowserStorage()) {
    storage?.setItem(WORKSPACE_EXPANSION_STORAGE_KEY, JSON.stringify(normalizeWorkspaceExpansionState(state)));
}
export function persistWorkspaceExpandedPreference(workspacePath, expanded, storage = getBrowserStorage()) {
    const currentState = readWorkspaceExpansionState(storage);
    if (currentState[workspacePath] === expanded) {
        return;
    }
    persistWorkspaceExpansionState({
        ...currentState,
        [workspacePath]: expanded,
    }, storage);
}
export function resolveExpandedWorkspacePaths(workspacePaths, expansionState) {
    return new Set(workspacePaths.filter((workspacePath) => expansionState[workspacePath] !== false));
}
//# sourceMappingURL=workspaceExpansionPreference.js.map