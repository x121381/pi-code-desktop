import { jsx as _jsx } from "react/jsx-runtime";
import { extractPlanToolCallContent } from "../lib/planToolCall.js";
import { ConversationRowView } from "../v4/ConversationRowView.js";
import { toolCallRowToLegacyNode } from "../v4/toolCallRowAdapter.js";
export function ConversationTurnRow({ row, context, onFork, onRetry, onFeedbackChange, onEdit, editWorkspaceRewindAvailability, hideAssistantActions, deferAssistantActions, assistantCopyText, assistantPreviewCards, assistantPreviewCardsAutoOpenKey, assistantCodeCommentCards, assistantCodeCommentProjectionEnabled, reasoningContentVariant, userInputStatus, }) {
    return (_jsx(ConversationRowView, { row: row, context: context, onFork: onFork, onRetry: onRetry, onFeedbackChange: onFeedbackChange, onEdit: onEdit, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability, hideAssistantActions: hideAssistantActions, deferAssistantActions: deferAssistantActions, assistantCopyText: assistantCopyText, assistantPreviewCards: assistantPreviewCards, assistantPreviewCardsAutoOpenKey: assistantPreviewCardsAutoOpenKey, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, reasoningContentVariant: reasoningContentVariant, userInputStatus: userInputStatus }));
}
export function resolveAssistantCopyText(unit) {
    if (!unit.latestAssistantTextRow) {
        return undefined;
    }
    const segments = unit.assistantTextRows.length > 0
        ? unit.assistantTextRows.map((segment) => segment.text)
        : [unit.latestAssistantTextRow.text];
    const includedSegments = new Set(segments);
    for (const row of unit.assistantWorkRows) {
        if (row.kind !== "toolCall" || row.toolName !== "ExitPlanMode")
            continue;
        const markdown = extractPlanToolCallContent(toolCallRowToLegacyNode(row).toolCall, "").markdown;
        if (!markdown || includedSegments.has(markdown))
            continue;
        // 产品边界：assistant 复制代表本轮完整可见回答。计划正文来自原位结构化 tool row，
        // 不能读取被 max-height/mask 裁切的卡片 DOM，也不能顺手混入普通工具输出。
        segments.push(markdown);
        includedSegments.add(markdown);
    }
    return segments.join("\n\n");
}
//# sourceMappingURL=ConversationTurnRow.js.map