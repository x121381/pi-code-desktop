import { toolCallRowToLegacyNode } from "@/v4/toolCallRowAdapter.js";
const OFFICIAL_CUA_TOOL_PREFIXES = [
    "mcp__computer-use__",
    "mcp__plugin_zcode-cua_computer-use__",
];
export const ENABLE_CUA_TOOL_CALL_GROUPING = true;
function isToolCallRow(row) {
    return row.kind === "toolCall";
}
export function isOfficialCuaToolCallRow(row) {
    return (isToolCallRow(row) &&
        OFFICIAL_CUA_TOOL_PREFIXES.some((prefix) => row.toolName.startsWith(prefix)));
}
function buildCuaGroup(events, active, flowKind, assistantResponseId, anchorRow) {
    const rows = events.flatMap((event) => (event.kind === "tool" ? [event.row] : []));
    const firstRow = anchorRow ?? rows[0];
    const identity = assistantResponseId
        ? `cua-response:${assistantResponseId}`
        : `cua:${firstRow?.rowId ?? "unknown"}`;
    const virtualToolId = assistantResponseId ? identity : `cua:${firstRow?.toolCallId ?? "unknown"}`;
    return {
        kind: "cuaGroup",
        // 以首个 ToolCall 为身份无法在正文流式阶段表达 response，也会让工具到达时
        // Group 被重建。新投影以持久 assistant message id 锚定 response，旧快照才退回 tool row。
        key: identity,
        rowId: firstRow?.rowId ?? 0,
        rows,
        events,
        active,
        flowKind,
        assistantResponseIds: assistantResponseId ? [assistantResponseId] : [],
        node: {
            toolCall: {
                toolId: virtualToolId,
                toolName: "CuaGroup",
                kind: "cuaGroup",
                title: "Computer Use",
                input: {},
                status: active ? "in_progress" : "completed",
                startedAt: typeof firstRow?.startedAt === "number" ? firstRow.startedAt : undefined,
            },
            childToolCalls: rows.map(toolCallRowToLegacyNode),
        },
    };
}
function classifyResponses(sourceItems) {
    const classifications = new Map();
    const visit = (row) => {
        if (row.kind !== "toolCall" || !row.assistantResponseId)
            return;
        const current = classifications.get(row.assistantResponseId) ?? {
            hasOfficialCua: false,
            hasNonCuaTool: false,
        };
        if (isOfficialCuaToolCallRow(row)) {
            current.hasOfficialCua = true;
            current.firstCuaRow ??= row;
        }
        else {
            current.hasNonCuaTool = true;
        }
        classifications.set(row.assistantResponseId, current);
    };
    for (const item of sourceItems) {
        if (item.kind === "assistantHistory" || item.kind === "assistantWork") {
            for (const row of item.rows)
                visit(row);
        }
    }
    return classifications;
}
function appendFlowRow(items, kind, row) {
    const previous = items.at(-1);
    if (previous?.kind === kind)
        previous.rows.push(row);
    else
        items.push({ kind, rows: [row] });
}
export function prepareCuaGroupFlowItems(sourceItems, options) {
    if (!options.enabled)
        return [...sourceItems];
    const prepared = [];
    const responseClassifications = classifyResponses(sourceItems);
    let activeGroup = null;
    const closeGroup = () => {
        if (activeGroup) {
            activeGroup.active = false;
            activeGroup.node.toolCall.status = "completed";
        }
        activeGroup = null;
    };
    const ensureGroup = (flowKind, assistantResponseId, anchorRow) => {
        if (activeGroup) {
            if (assistantResponseId && !activeGroup.assistantResponseIds.includes(assistantResponseId)) {
                activeGroup.assistantResponseIds.push(assistantResponseId);
            }
            return activeGroup;
        }
        activeGroup = buildCuaGroup([], true, flowKind, assistantResponseId, anchorRow);
        prepared.push(activeGroup);
        return activeGroup;
    };
    const appendCua = (row, flowKind) => {
        const event = {
            kind: "tool",
            row,
            node: toolCallRowToLegacyNode(row),
        };
        const group = ensureGroup(flowKind, row.assistantResponseId, row);
        group.events.push(event);
        group.rows.push(row);
        group.node.childToolCalls.push(event.node);
    };
    const appendAssistantMessage = (row, flowKind, classification) => {
        const group = ensureGroup(flowKind, row.assistantResponseId, classification.firstCuaRow);
        group.events.push({ kind: "assistantMessage", row });
    };
    const appendReasoning = (row, flowKind, classification) => {
        const group = ensureGroup(flowKind, row.assistantResponseId, classification.firstCuaRow);
        group.events.push({ kind: "reasoning", row });
    };
    const handleAssistantMessage = (row, flowKind, appendOutside) => {
        const responseId = row.assistantResponseId;
        const classification = responseId ? responseClassifications.get(responseId) : undefined;
        if (classification?.hasOfficialCua && !classification.hasNonCuaTool) {
            appendAssistantMessage(row, flowKind, classification);
            return;
        }
        if (responseId && !classification && row.state === "streaming") {
            // 把活动 Group 后尚未分类的 streaming response 提前收纳会让正文
            // 在滚动摘要出现后还可能被移回外部。没有 tool 事实前只原位显示，且不关闭旧 Group。
            appendOutside();
            return;
        }
        closeGroup();
        appendOutside();
    };
    const handleReasoning = (row, flowKind, appendOutside) => {
        const responseId = row.assistantResponseId;
        const classification = responseId ? responseClassifications.get(responseId) : undefined;
        if (classification?.hasOfficialCua && !classification.hasNonCuaTool) {
            appendReasoning(row, flowKind, classification);
            return;
        }
        if (!responseId || !classification) {
            // reasoning 往往先于正文和工具完成；仅凭当前没有 tool 就关闭活动 Group，
            // 会把随后确认的纯 CUA response 错切成新组。未分类阶段和旧无 ID 数据都只原位展示；
            // 后者保持“不构成工具边界”的兼容语义，且不猜相邻 response。
            appendOutside();
            return;
        }
        closeGroup();
        appendOutside();
    };
    for (const item of sourceItems) {
        if (item.kind === "cuaGroup") {
            closeGroup();
            prepared.push(item);
            continue;
        }
        if (item.kind === "userInput") {
            closeGroup();
            prepared.push(item);
            continue;
        }
        if (item.kind === "assistantText") {
            handleAssistantMessage(item.row, "assistantWork", () => prepared.push(item));
            continue;
        }
        for (const row of item.rows) {
            if (row.kind === "toolCall" && isOfficialCuaToolCallRow(row)) {
                appendCua(row, item.kind);
            }
            else if (row.kind === "toolCall") {
                closeGroup();
                appendFlowRow(prepared, item.kind, row);
            }
            else if (row.kind === "assistantText") {
                handleAssistantMessage(row, item.kind, () => appendFlowRow(prepared, item.kind, row));
            }
            else if (row.kind === "reasoning") {
                handleReasoning(row, item.kind, () => appendFlowRow(prepared, item.kind, row));
            }
            else {
                // marker、todo/status 只在 Group 外展示，不构成 response 工具边界。
                appendFlowRow(prepared, item.kind, row);
            }
        }
    }
    if (activeGroup && !options.stageTailIsRunning)
        closeGroup();
    return prepared;
}
/** 仅供 timeline-only/旧工作项路径兼容；正常 product turn 在 flow 层完成混合聚合。 */
export function prepareCuaGroups(rows, enabled, stageTailIsRunning) {
    const projected = prepareCuaGroupFlowItems([{ kind: "assistantWork", rows: [...rows] }], {
        enabled,
        stageTailIsRunning,
    });
    const flattened = [];
    for (const item of projected) {
        if (item.kind === "cuaGroup")
            flattened.push(item);
        else if (item.kind === "assistantHistory" || item.kind === "assistantWork") {
            flattened.push(...item.rows);
        }
        else if (item.kind === "assistantText") {
            flattened.push(item.row);
        }
    }
    return flattened;
}
//# sourceMappingURL=conversationCuaGroups.js.map