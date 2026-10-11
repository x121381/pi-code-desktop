import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { usePluginReferenceCatalog } from "@/hooks/usePluginReferenceCatalog.js";
import { PluginReferenceIconProvider } from "@/v4/pluginReferenceIconContext.js";
import { buildSessionPluginIconMap } from "@/v4/pluginReferenceIconProjection.js";
function ActiveSessionPluginReferenceIconProvider({ children, remoteSessionId, sessionId, workspaceIdentity, workspacePath, }) {
    const catalog = usePluginReferenceCatalog(workspacePath, workspaceIdentity, sessionId, true, {
        dedupeSessionRequest: true,
        preferredRemoteSessionId: remoteSessionId ?? undefined,
        // Timeline 图标是可选展示；Session 尚未就绪或 remote 暂不可用时安静回退 Cable。
        suppressErrorLog: true,
    });
    const iconByPluginId = useMemo(() => buildSessionPluginIconMap(catalog.authority, catalog.entries), [catalog.authority, catalog.entries]);
    const projection = useMemo(() => (catalog.authority === "session" ? { sessionId, iconByPluginId } : null), [catalog.authority, iconByPluginId, sessionId]);
    return _jsx(PluginReferenceIconProvider, { value: projection, children: children });
}
/**
 * 已发送 Plugin chip 的惰性 Session-authority 图标边界。
 *
 * 把 catalog hook 直接挂在 SessionPane 后，即使 disabled 也会先解析
 * workspace services，导致所有无 Plugin 引用的会话产生额外依赖与请求。拆成子组件后，
 * 只有确实含 plugin:// 用户消息且 Session snapshot 就绪时才挂载数据 hook。
 */
export function SessionPluginReferenceIconBoundary({ children, enabled, remoteSessionId, sessionId, workspaceIdentity, workspacePath, }) {
    if (!enabled || !sessionId) {
        return _jsx(PluginReferenceIconProvider, { value: null, children: children });
    }
    return (_jsx(ActiveSessionPluginReferenceIconProvider, { remoteSessionId: remoteSessionId, sessionId: sessionId, workspaceIdentity: workspaceIdentity, workspacePath: workspacePath, children: children }));
}
//# sourceMappingURL=SessionPluginReferenceIconProvider.js.map