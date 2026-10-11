function readMcpToolCallRow(row) {
    return row.kind === "toolCall" ? row : null;
}
/**
 * 取窗口内最新一条带不可用标识的官方 MCP 工具调用。
 *
 * 取"最新"而不是"第一条"：同一会话里可能先撞额度、后换了连接又撞权益，提示要跟随最近事实。
 * 注意 rows 是窗口视图，滚动很远后旧标识会离开窗口、提示随之消失——刚发生的调用一定在窗口内，
 * 这是可接受的取舍。
 */
export function resolveMcpUnavailableNotice(rows) {
    if (!rows || rows.length === 0)
        return null;
    const seenTools = new Set();
    for (let index = rows.length - 1; index >= 0; index -= 1) {
        const row = rows[index];
        if (!row)
            continue;
        const toolCallRow = readMcpToolCallRow(row);
        if (!toolCallRow)
            continue;
        const display = toolCallRow.display;
        if (display?.kind !== "mcp_tool")
            continue;
        const toolKey = `${display.serverName}\u0000${display.toolName}`;
        if (seenTools.has(toolKey))
            continue;
        seenTools.add(toolKey);
        // 同一工具的最新成功事实覆盖旧失败；继续查找其它工具仍未被成功覆盖的失败。
        if (!display.unavailable)
            continue;
        return {
            code: display.unavailable.code,
            rowId: toolCallRow.rowId,
            serverName: display.serverName,
            toolName: display.toolName,
        };
    }
    return null;
}
//# sourceMappingURL=mcpUnavailableBannerNotice.js.map