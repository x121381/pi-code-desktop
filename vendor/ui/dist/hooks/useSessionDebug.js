import { useEffect, useState } from "react";
import { useServices } from "@/hooks/useServices.js";
const REFRESH_INTERVAL_MS = 1000;
const EMPTY_DEBUG = { rounds: [], networkEntries: [], cache: null };
export function useSessionDebug({ workspacePath, workspaceIdentity, taskId, enabled = true, }) {
    const { zcodeAgentService } = useServices();
    const scopeKey = JSON.stringify([workspaceIdentity?.trim() || workspacePath, taskId]);
    const [result, setResult] = useState(null);
    useEffect(() => {
        if (!enabled || !taskId)
            return;
        let disposed = false;
        let timer;
        const refresh = async () => {
            try {
                const data = await zcodeAgentService.readSessionDebug({
                    workspacePath,
                    workspaceIdentity,
                    sessionId: taskId,
                });
                if (!disposed)
                    setResult({ key: scopeKey, service: zcodeAgentService, data, error: false });
            }
            catch {
                if (!disposed)
                    setResult((previous) => ({
                        key: scopeKey,
                        service: zcodeAgentService,
                        data: previous?.key === scopeKey && previous.service === zcodeAgentService
                            ? previous.data
                            : null,
                        error: true,
                    }));
            }
            finally {
                // 调试查询按完成节拍刷新，不重叠请求；切任务后的旧结果不能覆盖新任务。
                if (!disposed)
                    timer = setTimeout(() => void refresh(), REFRESH_INTERVAL_MS);
            }
        };
        void refresh();
        return () => {
            disposed = true;
            clearTimeout(timer);
        };
    }, [enabled, scopeKey, taskId, workspaceIdentity, workspacePath, zcodeAgentService]);
    const current = result?.key === scopeKey && result.service === zcodeAgentService ? result : null;
    return { ...(current?.data ?? EMPTY_DEBUG), error: current?.error ?? false };
}
//# sourceMappingURL=useSessionDebug.js.map