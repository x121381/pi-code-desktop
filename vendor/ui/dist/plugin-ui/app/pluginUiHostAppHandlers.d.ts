import type { McpUiDisplayMode, McpUiHostContext } from "@modelcontextprotocol/ext-apps/app-bridge";
import type { IPluginUiBridgeService, PluginUiPluginScope } from "@zcode/services";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
/**
 * 页面发起的规范请求 / 通知接到官方 AppBridge：`ui/request-display-mode`、`tools/call`、`ui/open-link`、
 * `ui/notifications/size-changed`、`ui/notifications/request-teardown`、`notifications/message`。
 * 会话交互（ui/message 等）在 pluginUiInteractionPorts，资源请求在 pluginUiResourceSubscriptions。
 */
export interface PluginUiHostAppHandlerDeps {
    currentContext(): McpUiHostContext;
    /** 宿主裁决后的模式写回 hostContext 并（已握手时）推 host-context-changed。 */
    applyDisplayMode(mode: McpUiDisplayMode): void;
    onDisplayModeRequest(mode: McpUiDisplayMode): McpUiDisplayMode;
    pluginScope(): PluginUiPluginScope;
    bridge: Pick<IPluginUiBridgeService, "callTool" | "cancelToolCall">;
    createCallId(): string;
    /** 进行中的页面工具调用 id；controller dispose 时逐个取消到 agent。 */
    activeCalls: Set<string>;
    onBusyChange?(): void;
    onOpenExternal(url: string): void;
}
export declare function installPluginUiHostAppHandlers(bridge: PluginUiHostBridge, deps: PluginUiHostAppHandlerDeps): void;
export declare function installPluginUiHostNotificationHandlers(bridge: PluginUiHostBridge, deps: {
    pluginId: string;
    onHeight(height: number): void;
    log?: (message: string, detail?: Record<string, unknown>) => void;
}): void;
//# sourceMappingURL=pluginUiHostAppHandlers.d.ts.map