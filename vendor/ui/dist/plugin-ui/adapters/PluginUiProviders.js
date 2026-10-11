import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { createPluginUiSessionActions } from "../../plugin-ui/adapters/pluginUiSessionBinding.js";
import { registerPluginUiSessionActions } from "../../plugin-ui/adapters/pluginUiSessionActions.js";
import { usePluginUiResourceDeltaFeed } from "../../plugin-ui/adapters/pluginUiResourceDeltaFeed.js";
const WorkspaceActions = createContext(undefined);
const SessionScope = createContext(null);
/** Shell 只在边界提供面板动作，中间布局组件不感知插件请求。 */
export function PluginUiWorkspaceProvider({ onOpenSidePane, children, }) {
    return _jsx(WorkspaceActions.Provider, { value: onOpenSidePane, children: children });
}
export function useOpenPluginUi() {
    return useContext(WorkspaceActions);
}
/** SessionPane 拥有命令入口；本适配器只绑定作用域与挂载生命周期。 */
export function PluginUiSessionProvider({ workspacePath, workspaceIdentity, remoteSessionId, sessionId, readOnly, sendText, uploadAttachment, projectionStore, children, }) {
    const scope = useMemo(() => (sessionId ? { workspacePath, workspaceIdentity, remoteSessionId, sessionId } : null), [workspacePath, workspaceIdentity, remoteSessionId, sessionId]);
    const port = useRef({ sendText, uploadAttachment });
    port.current = { sendText, uploadAttachment };
    usePluginUiResourceDeltaFeed(projectionStore, scope);
    useEffect(() => {
        if (!scope || readOnly)
            return;
        // 修复：发送配置变更会重建回调，但不应让同一挂载中的待确认请求失效。
        return registerPluginUiSessionActions(scope, createPluginUiSessionActions(scope, {
            sendText: (...args) => port.current.sendText(...args),
            uploadAttachment: (...args) => port.current.uploadAttachment(...args),
        }));
    }, [scope, readOnly]);
    return _jsx(SessionScope.Provider, { value: scope, children: children });
}
export function usePluginUiToolBinding(toolCallId) {
    const scope = useContext(SessionScope);
    const open = useOpenPluginUi();
    return useMemo(() => scope
        ? {
            scope: { ...scope, toolCallId },
            ...(open
                ? {
                    onOpenSidePane: (request) => open({
                        ...request,
                        workspacePath: scope.workspacePath,
                        workspaceIdentity: scope.workspaceIdentity,
                        remoteSessionId: scope.remoteSessionId,
                        parentSessionId: scope.sessionId,
                    }),
                }
                : {}),
        }
        : undefined, [open, scope, toolCallId]);
}
//# sourceMappingURL=PluginUiProviders.js.map