import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { OfficialMcpToolErrorCode } from "@zcode/shared";
/**
 * 官方 Server MCP 本次会话内被判定不可用的事实（额度耗尽 / 无 Coding Plan）。
 *
 * 事实来源是 tool row 上的 `display.unavailable`——CLI 侧只对官方 MCP 且 isError 的结果填充，
 * 因此这里不需要再判来源。
 */
export interface McpUnavailableNotice {
    code: OfficialMcpToolErrorCode;
    serverName: string;
    toolName: string;
    /** 去重用：同一次调用只提示一次，换一次新的失败调用会重新提示。 */
    rowId: number;
}
/**
 * 取窗口内最新一条带不可用标识的官方 MCP 工具调用。
 *
 * 取"最新"而不是"第一条"：同一会话里可能先撞额度、后换了连接又撞权益，提示要跟随最近事实。
 * 注意 rows 是窗口视图，滚动很远后旧标识会离开窗口、提示随之消失——刚发生的调用一定在窗口内，
 * 这是可接受的取舍。
 */
export declare function resolveMcpUnavailableNotice(rows: readonly ConversationRow[] | undefined): McpUnavailableNotice | null;
//# sourceMappingURL=mcpUnavailableBannerNotice.d.ts.map