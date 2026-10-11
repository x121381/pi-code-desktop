import { useEffect, useState } from "react";
import { useServices } from "@/hooks/useServices.js";
import { isAbsoluteFilePath } from "@/lib/path.js";
const workspaceHomePathCache = new Map();
export function buildWorkspaceHomeCacheKey(params) {
    const workspaceKey = params.workspaceIdentity?.trim() || params.workspacePath;
    return `${workspaceKey}::${params.remoteSessionId?.trim() || "local"}`;
}
function normalizeHostHomePath(homePath) {
    const trimmed = homePath.trim();
    return trimmed && isAbsoluteFilePath(trimmed) ? trimmed : null;
}
export function resetWorkspaceHomePathCacheForTests() {
    workspaceHomePathCache.clear();
}
export function useWorkspaceHomePath(params) {
    const { systemService } = useServices();
    const cacheKey = buildWorkspaceHomeCacheKey(params);
    const [state, setState] = useState(() => {
        const cached = workspaceHomePathCache.get(cacheKey);
        return {
            cacheKey,
            homePath: cached && cached.systemService === systemService ? cached.homePath : undefined,
        };
    });
    useEffect(() => {
        let disposed = false;
        if (typeof systemService?.info !== "function") {
            return () => {
                disposed = true;
            };
        }
        const cached = workspaceHomePathCache.get(cacheKey);
        if (cached && cached.systemService === systemService && cached.homePath) {
            setState({ cacheKey, homePath: cached.homePath });
            return () => {
                disposed = true;
            };
        }
        const promise = cached?.systemService === systemService && cached.promise
            ? cached.promise
            : systemService.info().then((info) => normalizeHostHomePath(info.homedir), () => null);
        workspaceHomePathCache.set(cacheKey, { systemService, promise });
        void promise.then((homePath) => {
            if (disposed)
                return;
            const current = workspaceHomePathCache.get(cacheKey);
            if (!current || current.systemService !== systemService)
                return;
            if (homePath) {
                workspaceHomePathCache.set(cacheKey, { systemService, homePath });
            }
            else {
                workspaceHomePathCache.delete(cacheKey);
            }
            setState({ cacheKey, ...(homePath ? { homePath } : {}) });
        });
        return () => {
            disposed = true;
        };
    }, [cacheKey, systemService]);
    return state.cacheKey === cacheKey ? state.homePath : undefined;
}
//# sourceMappingURL=useWorkspaceHomePath.js.map