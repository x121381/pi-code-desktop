import { getPluginWorkspaceKey } from "../settings/PluginScopeMenu.js";
import { isWorkspaceTab } from "../store/tabStore.js";
export function getCommandWorkspaceTabs(tabs) {
    const seen = new Set();
    return tabs.filter(isWorkspaceTab).filter((tab) => {
        const key = getPluginWorkspaceKey(tab);
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}
export function resolveCommandScopeRecovery(params) {
    if (params.scopeKey === "user" ||
        params.workspaceTabs.some((tab) => getPluginWorkspaceKey(tab) === params.scopeKey)) {
        return "keep";
    }
    return params.editing ? "close-editor" : "fallback-user";
}
export function resolveCommandStorageTarget(scopeKey, workspaceTabs) {
    if (scopeKey === "user") {
        return { storageLevel: "user", workspace: null };
    }
    return {
        storageLevel: "project",
        workspace: workspaceTabs.find((tab) => getPluginWorkspaceKey(tab) === scopeKey) ?? null,
    };
}
export function shouldRefreshCurrentCommandList(scopeKey, currentWorkspaceKey) {
    return scopeKey === "user" || scopeKey === currentWorkspaceKey;
}
//# sourceMappingURL=commandWorkspaceScope.js.map