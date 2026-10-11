import { createOpenInEditorRemoteTarget } from "@zcode/shared";
import { useMemo } from "react";
import { useOptionalTabStore } from "@/store/TabStoreProvider.js";
import { isWorkspaceTab, } from "@/store/tabStore.js";
export function resolveWorkspaceOpenInEditorTarget(tabs, scope) {
    if (!scope.workspacePath) {
        return { isRemoteWorkspace: false, remoteTarget: undefined };
    }
    const requestedIdentity = scope.workspaceIdentity?.trim() || undefined;
    const requestedRemoteSessionId = scope.workspaceRemoteSessionId?.trim() || undefined;
    const workspaceKey = requestedIdentity || scope.workspacePath;
    const matches = tabs.filter((tab) => {
        if (!isWorkspaceTab(tab) || tab.workspacePath !== scope.workspacePath) {
            return false;
        }
        const tabWorkspaceKey = tab.workspaceIdentity?.trim() || tab.workspacePath;
        const tabRemoteSessionId = tab.remoteSessionId?.trim() || undefined;
        return ((!requestedIdentity || tabWorkspaceKey === workspaceKey) &&
            (!requestedRemoteSessionId || tabRemoteSessionId === requestedRemoteSessionId));
    });
    // 修复原因：远程文件动作以前只携带 Linux path，renderer 无法判断它属于哪个 SSH/WSL 目标；
    // identity/session 已提供时精确匹配，旧调用仅在工作区匹配唯一时提取既有脱敏目标。
    const matchedTab = matches.length === 1 ? matches[0] : undefined;
    const hasRemoteMatch = matches.some((tab) => Boolean(tab.workspaceIdentity || tab.remoteSessionId || tab.remoteTarget));
    const remoteTarget = matchedTab?.remoteTarget;
    return {
        isRemoteWorkspace: hasRemoteMatch,
        remoteTarget: remoteTarget ? createOpenInEditorRemoteTarget(remoteTarget) : undefined,
    };
}
export function useWorkspaceOpenInEditorTarget(scope) {
    const tabs = useOptionalTabStore((state) => state.tabs);
    return useMemo(() => resolveWorkspaceOpenInEditorTarget(tabs, scope), [scope.workspaceIdentity, scope.workspacePath, scope.workspaceRemoteSessionId, tabs]);
}
//# sourceMappingURL=useWorkspaceOpenInEditorTarget.js.map