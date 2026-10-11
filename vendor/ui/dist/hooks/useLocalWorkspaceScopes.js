import { useMemo } from "react";
import { isWorkspaceTab } from "@/store/tabStore.js";
function isLocalWorkspaceTab(tab) {
    return !tab.remoteSessionId && !tab.remoteTarget && !tab.workspaceIdentity;
}
export function useLocalWorkspaceScopes({ workspaceTabs, }) {
    return useMemo(() => workspaceTabs.filter((tab) => {
        // pinned 查询只使用当前窗口已经打开的本地 workspace。
        // 远端 workspace 即使持久化在 lastWorkspaceSession 中，也不能兜底混入本地查询，
        // 否则没有 remoteSessionId 时会落到本地服务，导致同路径任务串读。
        return isWorkspaceTab(tab) && isLocalWorkspaceTab(tab);
    }), [workspaceTabs]);
}
//# sourceMappingURL=useLocalWorkspaceScopes.js.map