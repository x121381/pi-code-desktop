import type { PluginUiPresentation } from "../contract.js";
/**
 * 从 ToolCallRow 的 legacy raw.display 读出插件 UI 呈现信息。display.ui 由 agent 投影、经 strict schema
 * 校验持久化；这里再校验一次是为了防御旧快照或手改数据，失败即回退到普通 McpToolCallBlock。
 */
export declare function readPluginUiPresentation(raw: unknown): PluginUiPresentation | null;
/** 解析 display.ui 里以 JSON 文本持久化的 structuredContent / widgetMeta；非法 JSON 视为缺失。 */
export declare function parseJsonText(text: string | undefined): unknown;
//# sourceMappingURL=readPluginUiPresentation.d.ts.map