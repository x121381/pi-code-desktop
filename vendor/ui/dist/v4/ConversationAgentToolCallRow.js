import { jsx as _jsx } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { TID_V4_ROW, TID_V4_SUBAGENT_OPEN_SIDE_PANE, testId } from "@zcode/shared";
import { ToolCallBlock } from "../ToolCallBlocks.js";
import { getAgentPrimaryText } from "../ToolCallBlocks/renderers/agentHelpers.js";
import { toolCallRowToLegacyNode } from "../v4/toolCallRowAdapter.js";
import { runUserAction } from "../lib/userActionTelemetry.js";
export function openSubagentSessionFromSummary({ backgrounded: _backgrounded = false, childSessionId, context, subagentType, title, }) {
    const parentSessionId = context.sessionId;
    const onOpenSubagentSession = context.onOpenSubagentSession;
    if (!childSessionId || !parentSessionId || !onOpenSubagentSession) {
        return false;
    }
    onOpenSubagentSession({
        rootSessionId: context.rootSessionId ?? parentSessionId,
        parentSessionId,
        childSessionId,
        subagentType,
        title,
    });
    return true;
}
export function ConversationAgentToolCallRow({ item, context, }) {
    const toolCallNode = useMemo(() => toolCallRowToLegacyNode(item.row), [item.row]);
    const childSessionId = item.subagentRow.childSessionId;
    const subagentType = item.subagentRow.subagentType;
    // 与 Agent 摘要行复用同一 title resolver，保证右侧 tab 和用户点击的可见标题逐字一致。
    const title = getAgentPrimaryText(toolCallNode.toolCall, "");
    const canOpenChildSession = Boolean(childSessionId && context.sessionId && context.onOpenSubagentSession);
    const handleOpenChildSession = useCallback(() => {
        runUserAction({
            input: { featureId: "conversation.subagent", action: "open_side_pane", trigger: "button" },
            operation: () => openSubagentSessionFromSummary({ childSessionId, context, subagentType, title }),
            completed: { resultSource: "local_commit" },
            failureStage: "subagent_open",
        });
    }, [childSessionId, context, subagentType, title]);
    const agentSummaryAction = useMemo(() => canOpenChildSession && childSessionId
        ? {
            onActivate: handleOpenChildSession,
            testId: testId(TID_V4_SUBAGENT_OPEN_SIDE_PANE, childSessionId),
        }
        : undefined, [canOpenChildSession, childSessionId, handleOpenChildSession]);
    // Agent 工具行和普通工具行同属工作流，不能在配对壳上额外加 px-4，
    // 否则会和未配对 toolCall 行产生左右缩进差异。
    return (_jsx("div", { "data-row-id": item.row.rowId, "data-conversation-selectable": "true", "data-testid": testId(TID_V4_ROW, String(item.row.rowId)), children: _jsx(ToolCallBlock, { toolCallNode: toolCallNode, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showTodoToolCalls: context.messageStreamShowTodos === true, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain, agentSummaryAction: agentSummaryAction, authoritativeAgentType: subagentType }) }));
}
//# sourceMappingURL=ConversationAgentToolCallRow.js.map