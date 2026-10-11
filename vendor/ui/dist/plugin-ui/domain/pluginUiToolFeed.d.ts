import type { McpAppsToolResultPayload } from "@zcode/shared/mcp-apps";
import type { ConversationRow, ToolCallRow } from "@zcode/shared/zcode-protocol-v4";
import type { PluginUiPresentation } from "../contract.js";
/** 内联卡片与侧栏共用的 legacy ChatToolCall 子集（toolCallRowAdapter 输出）。 */
export interface PluginUiLegacyToolCall {
    status: string;
    input: unknown;
    output?: unknown;
}
export declare function readPluginUiToolInput(toolCall: PluginUiLegacyToolCall | null): Record<string, unknown> | undefined;
/** 被停止的工具不再伪装成普通结果，而是走 ui/notifications/tool-cancelled。 */
export declare function isPluginUiToolCancelled(toolCall: PluginUiLegacyToolCall | null): boolean;
/**
 * 工具行 → MCP Apps tool-result 通知载荷。legacy 状态词表：pending / in_progress / completed / failed / stopped；
 * 未完成不产出；stopped 不产出（改发 cancelled 通知）。structuredContent / widgetMeta 从 display.ui 的 JSON 文本恢复。
 */
export declare function buildPluginUiToolResult(toolCall: PluginUiLegacyToolCall | null, presentation: PluginUiPresentation | null): McpAppsToolResultPayload | undefined;
export declare function findToolRowById(rows: readonly ConversationRow[], toolCallId: string): ToolCallRow | null;
/** 面板投喂快照里的一条工具行摘要。 */
export interface PluginUiSurfaceFeedEntry {
    rowId: number;
    toolCallId: string;
    status: ToolCallRow["status"];
    presentation: PluginUiPresentation;
    input: Record<string, unknown> | undefined;
}
/**
 * 面板（surface）投喂快照。`latest` 是该 surface 最新一条工具行（任意状态，投喂 tool-input、
 * 判断 cancelled）；`result` 是最后一次成功结果，running / failed / cancelled / MCP isError 不覆盖它——面板在下一次成功前
 * 一直显示上一份好结果。两者只按 rowId 单调前进，投影窗口被裁掉旧行时快照仍在。
 */
export interface PluginUiSurfaceFeed {
    latest: PluginUiSurfaceFeedEntry | null;
    result: (PluginUiSurfaceFeedEntry & {
        toolResult: McpAppsToolResultPayload;
    }) | null;
}
export declare const EMPTY_PLUGIN_UI_SURFACE_FEED: PluginUiSurfaceFeed;
/**
 * 纯归约：把一批投影行并进快照。同一 rowId 只在状态变化时更新 `latest`；`result` 在成功行首次出现时构造一次，
 * 之后同 rowId 不重建（保持引用稳定，宿主据引用判断是否重发 tool-result）。无变化时返回原对象。
 */
export declare function reducePluginUiSurfaceFeed(previous: PluginUiSurfaceFeed, rows: readonly ConversationRow[], surfaceId: string, pluginId: string, binding?: {
    serverName?: string;
    resourceUri: string;
}): PluginUiSurfaceFeed;
/** 两份快照按 rowId 取新（store 合并用）：谁的行更新用谁的。 */
export declare function mergePluginUiSurfaceFeed(current: PluginUiSurfaceFeed, candidate: PluginUiSurfaceFeed): PluginUiSurfaceFeed;
//# sourceMappingURL=pluginUiToolFeed.d.ts.map