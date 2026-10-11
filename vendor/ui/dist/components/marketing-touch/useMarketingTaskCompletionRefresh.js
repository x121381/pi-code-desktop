import { createContext, useContext, useEffect } from "react";
import { useServices } from "@/hooks/useServices.js";
import { acquireSessionsIndex, releaseSessionsIndex, } from "@/v4/sessionsIndexRegistry.js";
export const MarketingRefreshContext = createContext(null);
/** 仅观察任务完成边沿；活动查询仍由窗口唯一 poller 调度。 */
export function useMarketingTaskCompletionRefresh({ workspacePath, workspaceIdentity, endpointKey, rpcReady, }) {
    const refresh = useContext(MarketingRefreshContext);
    const { zcodeAgentService } = useServices();
    useEffect(() => {
        if (!refresh || !rpcReady)
            return;
        const identity = workspaceIdentity?.trim();
        const scope = {
            workspaceKey: identity || workspacePath,
            workspacePath,
            ...(identity ? { workspaceIdentity: identity } : {}),
            ...(endpointKey ? { endpointKey } : {}),
        };
        const store = acquireSessionsIndex(scope, zcodeAgentService);
        let previous = null;
        const observe = () => {
            // 初次历史与断连恢复只建立基线，避免把旧完成状态当成新完成事件。
            if (store.getStatus() !== "live") {
                previous = null;
                return;
            }
            const sessions = store.getSessions();
            const completed = sessions.some((session) => {
                const phase = previous?.get(session.sessionId);
                return (phase !== undefined &&
                    phase !== "completedSuccess" &&
                    session.phase === "completedSuccess");
            });
            previous = new Map(sessions.map((session) => [session.sessionId, session.phase]));
            if (completed)
                refresh();
        };
        const unsubscribe = store.subscribe(observe);
        observe();
        return () => {
            unsubscribe();
            releaseSessionsIndex(scope, store);
        };
    }, [endpointKey, refresh, rpcReady, workspaceIdentity, workspacePath, zcodeAgentService]);
}
//# sourceMappingURL=useMarketingTaskCompletionRefresh.js.map