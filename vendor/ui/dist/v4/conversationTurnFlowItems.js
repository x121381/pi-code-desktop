function isUserInputRow(row) {
    return row.kind === "userInput";
}
function isAssistantTextRow(row) {
    return row.kind === "assistantText";
}
function isAssistantWorkRow(row) {
    return row.kind !== "turnHeader" && row.kind !== "userInput";
}
function appendGroupedAssistantFlowItem(items, kind, row) {
    const previous = items.at(-1);
    if (previous?.kind === kind) {
        previous.rows.push(row);
        return;
    }
    items.push({ kind, rows: [row] });
}
export function buildConversationFlowItems(options) {
    const historyRowIds = new Set(options.assistantHistoryRows.map((row) => row.rowId));
    const followingRowIds = new Set(options.assistantFollowingRows.map((row) => row.rowId));
    const tailRowIds = new Set(options.assistantTailRows.map((row) => row.rowId));
    const items = [];
    for (const row of options.orderedRows) {
        if (isUserInputRow(row)) {
            items.push({ kind: "userInput", row });
            continue;
        }
        if (!isAssistantWorkRow(row))
            continue;
        // 轮尾 boundary 已从 assistant flow 拆成 assistantTailRows；若再把它追加回
        // flowItems，renderer 会把它渲染在定时任务卡片、文件 summary 和消息操作栏之前。
        // 这里只保留真实 flow；boundary 由 TurnGroup 在全部 turn-local 附属 UI 之后统一收尾。
        if (tailRowIds.has(row.rowId))
            continue;
        if (isAssistantTextRow(row) &&
            (row.rowId === options.visibleAssistantTextRow?.rowId || !historyRowIds.has(row.rowId)) &&
            !followingRowIds.has(row.rowId) &&
            !tailRowIds.has(row.rowId) &&
            !options.timelineOnly) {
            items.push({
                kind: "assistantText",
                row,
                latest: row.rowId === options.latestAssistantTextRow?.rowId,
            });
            continue;
        }
        appendGroupedAssistantFlowItem(items, historyRowIds.has(row.rowId) && !options.timelineOnly ? "assistantHistory" : "assistantWork", row);
    }
    return items;
}
//# sourceMappingURL=conversationTurnFlowItems.js.map