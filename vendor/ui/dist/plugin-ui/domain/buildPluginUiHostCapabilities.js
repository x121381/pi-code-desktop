import { MCP_APPS_RESOURCE_SUBSCRIBE_EXPERIMENTAL_KEY, MCP_APPS_SURFACE_EXPERIMENTAL_KEY, MCP_APPS_WIDGET_STATE_EXPERIMENTAL_KEY, buildMcpAppsCspExperimentalCapability, } from "@zcode/shared/mcp-apps";
/**
 * hostCapabilities 的唯一构造点。声明与 handler 一一对应：没有会话动作绑定就不声明 message，没有 composer 就不声明
 * updateModelContext。ZCode 扩展（widgetState、resourceSubscribe、surface、csp 放宽）一律放 `experimental["zcode/…"]`，
 * 官方 SDK 的 zod 会剥掉标准位之外的未知能力键。
 */
export function buildPluginUiHostCapabilities(input) {
    return {
        openLinks: {},
        serverTools: {},
        serverResources: input.canSubscribeResources ? { listChanged: true } : {},
        logging: {},
        ...(input.canSample ? { sampling: {} } : {}),
        ...(input.canDownloadFile ? { downloadFile: {} } : {}),
        // image 随 text 一起声明（png / jpeg / webp，单张 ≤ 4 MiB）。
        ...(input.canSendFollowUpMessage ? { message: { text: {}, image: {} } } : {}),
        ...(input.canUpdateModelContext
            ? { updateModelContext: { text: {}, structuredContent: {}, image: {} } }
            : {}),
        experimental: {
            ...buildMcpAppsCspExperimentalCapability(),
            ...(input.canSetWidgetState ? { [MCP_APPS_WIDGET_STATE_EXPERIMENTAL_KEY]: {} } : {}),
            ...(input.canSubscribeResources
                ? { [MCP_APPS_RESOURCE_SUBSCRIBE_EXPERIMENTAL_KEY]: {} }
                : {}),
            ...(input.surfaceId ? { [MCP_APPS_SURFACE_EXPERIMENTAL_KEY]: { id: input.surfaceId } } : {}),
        },
    };
}
//# sourceMappingURL=buildPluginUiHostCapabilities.js.map