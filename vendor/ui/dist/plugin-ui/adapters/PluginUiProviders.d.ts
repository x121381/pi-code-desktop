import { type ReactNode } from "react";
import type { OpenPluginUiSideTabRequest, PluginUiSessionScope, PluginUiSessionCommandPort, PluginUiToolBinding } from "@/plugin-ui/contract.js";
import type { ConversationProjectionStore } from "@/v4/conversationProjectionStore.js";
/** Shell 只在边界提供面板动作，中间布局组件不感知插件请求。 */
export declare function PluginUiWorkspaceProvider({ onOpenSidePane, children, }: {
    onOpenSidePane: (request: OpenPluginUiSideTabRequest) => void;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useOpenPluginUi(): ((request: OpenPluginUiSideTabRequest) => void) | undefined;
/** SessionPane 拥有命令入口；本适配器只绑定作用域与挂载生命周期。 */
export declare function PluginUiSessionProvider({ workspacePath, workspaceIdentity, remoteSessionId, sessionId, readOnly, sendText, uploadAttachment, projectionStore, children, }: Omit<PluginUiSessionScope, "sessionId"> & {
    sessionId: string | null;
    readOnly: boolean;
    /** 本会话的投影 store（lease 就绪后给出），插件资源通知从它的 live 增量路由到沙箱实例。 */
    projectionStore?: ConversationProjectionStore | null;
    children: ReactNode;
} & PluginUiSessionCommandPort): import("react/jsx-runtime").JSX.Element;
export declare function usePluginUiToolBinding(toolCallId: string): PluginUiToolBinding | undefined;
//# sourceMappingURL=PluginUiProviders.d.ts.map