import type { McpUiHostCapabilities } from "@modelcontextprotocol/ext-apps/app-bridge";
/** 宿主实例真实可用的交互；缺省项对应的能力不声明，插件据此降级。 */
export interface PluginUiHostCapabilityInput {
    canSample?: boolean;
    canSendFollowUpMessage: boolean;
    canUpdateModelContext: boolean;
    canSetWidgetState: boolean;
    /** 宿主能代理 resources/subscribe 并把 server 通知路由回本实例。 */
    canSubscribeResources: boolean;
    /** 平台有 saveFile（桌面）才声明 downloadFile。 */
    canDownloadFile: boolean;
    /** 常驻面板实例：宣告 `experimental["zcode/surface"]: { id }`，页面据此判断自己运行在面板里。 */
    surfaceId?: string;
}
/**
 * hostCapabilities 的唯一构造点。声明与 handler 一一对应：没有会话动作绑定就不声明 message，没有 composer 就不声明
 * updateModelContext。ZCode 扩展（widgetState、resourceSubscribe、surface、csp 放宽）一律放 `experimental["zcode/…"]`，
 * 官方 SDK 的 zod 会剥掉标准位之外的未知能力键。
 */
export declare function buildPluginUiHostCapabilities(input: PluginUiHostCapabilityInput): McpUiHostCapabilities;
//# sourceMappingURL=buildPluginUiHostCapabilities.d.ts.map