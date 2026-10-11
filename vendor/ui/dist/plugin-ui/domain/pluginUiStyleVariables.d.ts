import type { McpAppsStyleVariables } from "@zcode/shared/mcp-apps";
/**
 * ZCode 主题 token（DESIGN.md / docs/design/zcode-tokens.md）→ MCP Apps 标准样式变量
 * （官方 `McpUiStyleVariableKey`）。每个标准键给出来源 token 与兜底字面量：token 读不到（非 DOM 环境、
 * 旧主题缺项）时用兜底，保证页面拿到的每个键都是可用的 CSS 值。颜色值原样透传（含 color-mix()）。
 */
export interface PluginUiStyleVariableSource {
    token?: string;
    fallback: string;
}
export declare const PLUGIN_UI_STYLE_VARIABLE_SOURCES: Record<string, PluginUiStyleVariableSource>;
/** `readToken` 返回宿主根元素上该 token 的计算值（空串 / undefined 视为缺失）。 */
export declare function buildPluginUiStyleVariables(readToken: (token: string) => string | undefined): McpAppsStyleVariables;
//# sourceMappingURL=pluginUiStyleVariables.d.ts.map