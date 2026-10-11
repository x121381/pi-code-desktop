import type { McpAppsDownloadFileItem, PluginSandboxHandle, PluginSandboxPlatformPort } from "@zcode/shared/mcp-apps";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
/** 宿主实例注入的交互回调；缺省时对应请求回 -32601（能力声明与回调一一对应）。 */
export interface PluginUiInteractionCallbacks {
    /** sendFollowUpMessage 返回 reject 表示用户取消或无权限。 */
    onSendFollowUpMessage?(payload: {
        prompt: string;
        content?: Array<Record<string, unknown>>;
        structuredContent?: unknown;
    }, context: {
        consumeUserGesture(): Promise<boolean>;
        assertCurrent(): void;
    }): Promise<void>;
    onUpdateModelContext?(payload: {
        content: Array<Record<string, unknown>>;
        structuredContent?: unknown;
    }): Promise<void>;
    /** 页面 `ui/set-widget-state { widgetState }`；宿主同步写内存 store 后回包。 */
    onUpdateWidgetState?(widgetState: unknown): Promise<void>;
    /** `ui/download-file`；逐项保存，取消 / 失败回 `{ isError: true }`。 */
    onDownloadFile?(contents: McpAppsDownloadFileItem[]): Promise<{
        isError?: boolean;
    }>;
}
/**
 * 会话交互（ui/message、ui/update-model-context、ui/download-file、ZCode 扩展 ui/set-widget-state）接到官方
 * AppBridge：缺省回调回 -32601；ui/message 的手势 token 由 main 在 guest input-event 记录、一次性消费，没有句柄视为无手势。
 */
export declare function wirePluginUiInteractions(bridge: PluginUiHostBridge, deps: PluginUiInteractionCallbacks, platform: Pick<PluginSandboxPlatformPort, "consumeUserGesture">, currentHandle: () => PluginSandboxHandle | null): void;
//# sourceMappingURL=pluginUiInteractionPorts.d.ts.map