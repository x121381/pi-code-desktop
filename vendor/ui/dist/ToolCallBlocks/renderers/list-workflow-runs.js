import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { History } from "lucide-react";
import { useMemo } from "react";
import { RUN_STATUS_DOT, RUN_STATUS_TEXT, readWorkflowRunStopReason, workflowRunStopReasonMessageId, } from "@/components/workflow-graph/run-status-presentation.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatWorkflowTimestamp, formatWorkflowTokenCount, } from "@/lib/workflowObservationFormat.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { readToolResultDisplay } from "@/ToolCallBlocks/toolResultDisplay.js";
import { ToolLayout } from "../ToolLayout.js";
const LIST_WORKFLOW_RUNS_TOOL_ICON = _jsx(History, { className: "size-4 shrink-0 text-foreground-subtle" });
/**
 * ListWorkflowRuns 的聊天卡。
 *
 * 折叠行：kindLabel + 计数（单复数独立 key 的既有惯例）。展开：行式列表
 * ［状态点词 | label mono | 短时间 | tokens］，本会话 run 加边框小签，possiblyInterrupted
 * 行尾给警示标注——「可能已中断」是读面标注不是状态改写，卡片上同样只标注。
 */
export function ListWorkflowRunsToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const display = readToolResultDisplay(toolCall.raw);
    const listDisplay = display?.kind === "list_workflow_runs" ? display : undefined;
    const kindLabel = intl.formatMessage({
        id: context.isRunning
            ? "chat.toolCall.workflow.listRuns.listing"
            : "chat.toolCall.workflow.listRuns.listed",
    });
    const emptyLabel = intl.formatMessage({ id: "chat.toolCall.workflow.listRuns.empty" });
    const runCount = listDisplay?.runs.length ?? 0;
    const countLabel = intl.formatMessage({
        id: runCount === 1
            ? "chat.toolCall.workflow.listRuns.countOne"
            : "chat.toolCall.workflow.listRuns.count",
    }, { count: runCount });
    const primaryText = useMemo(() => (_jsx("span", { className: "truncate text-foreground-subtlest", children: runCount === 0 ? emptyLabel : countLabel })), [countLabel, emptyLabel, runCount]);
    const rows = useMemo(() => {
        if (listDisplay === undefined)
            return null;
        return _jsx(ListWorkflowRunsBody, { runs: listDisplay.runs });
    }, [listDisplay]);
    const fallbackText = listDisplay === undefined && typeof toolCall.output === "string"
        ? toolCall.output.trim()
        : undefined;
    const renderContent = useMemo(() => {
        if (listDisplay !== undefined) {
            return () => (_jsxs("div", { className: "mb-2 space-y-2", children: [rows, listDisplay.truncated ? (_jsx("p", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.listRuns.truncated" }) })) : null] }));
        }
        if (fallbackText === undefined || fallbackText.length === 0)
            return undefined;
        return () => (_jsx("pre", { className: "mb-2 max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-panel px-4 py-3 font-mono text-ui-base text-foreground-subtle", children: fallbackText }));
    }, [fallbackText, intl, listDisplay, rows]);
    const hasDetails = (listDisplay !== undefined && runCount > 0) ||
        (fallbackText !== undefined && fallbackText.length > 0);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: LIST_WORKFLOW_RUNS_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: hasDetails && (context.canToggle ?? true), forceOpen: hasDetails && (context.forceOpen ?? false), kindLabel: context.kindLabelOverride ?? kindLabel, sourceLabel: context.sourceLabel, primaryText: primaryText, statusLabel: toolCall.status === "failed" ? context.statusLabel : undefined, statusTooltip: context.errorText, showFailureStatus: toolCall.status === "failed", isRunning: context.isRunning, title: toolCall.title, renderContent: hasDetails ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
function ListWorkflowRunsBody({ runs }) {
    const { intl } = useZCodeIntl();
    const ownSessionLabel = intl.formatMessage({ id: "chat.toolCall.workflow.listRuns.ownSession" });
    const interruptedLabel = intl.formatMessage({
        id: "chat.toolCall.workflow.listRuns.interrupted",
    });
    if (runs.length === 0) {
        const emptyLabel = intl.formatMessage({ id: "chat.toolCall.workflow.listRuns.empty" });
        return _jsx("p", { className: "text-ui-sm text-foreground-subtlest", children: emptyLabel });
    }
    return (_jsx("div", { className: "space-y-1", "data-workflow-run-list": "true", children: runs.map((run) => {
            const statusWord = intl.formatMessage({
                id: `chat.toolCall.workflow.run.status.${run.status}`,
            });
            const stopReason = readWorkflowRunStopReason(run);
            return (_jsxs("div", { className: "flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5", "data-workflow-run-row": run.runId, "data-workflow-run-row-status": run.status, children: [_jsxs("span", { className: "flex shrink-0 items-center gap-1.5", children: [_jsx("span", { "aria-hidden": "true", className: cn("size-1.5 rounded-full", RUN_STATUS_DOT[run.status]) }), _jsx("span", { className: cn("text-ui-sm", RUN_STATUS_TEXT[run.status]), children: statusWord }), stopReason ? (_jsx("span", { className: "text-ui-xs text-foreground-subtlest", children: intl.formatMessage({ id: workflowRunStopReasonMessageId(stopReason) }) })) : null] }), _jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-ui-base text-foreground-subtle", title: run.runId, children: run.label }), run.ownedByThisSession ? (_jsx("span", { className: "shrink-0 rounded-xs border border-border px-1.5 py-0.5 text-ui-xs leading-none text-foreground-subtlest", children: ownSessionLabel })) : null, run.possiblyInterrupted === true ? (_jsx("span", { className: "shrink-0 text-ui-xs text-warning", children: interruptedLabel })) : null, _jsx("span", { className: "shrink-0 font-mono text-ui-xs tabular-nums text-foreground-subtlest", children: formatWorkflowTimestamp(run.updatedAt) }), _jsx("span", { className: "shrink-0 font-mono text-ui-xs tabular-nums text-foreground-subtlest", children: formatWorkflowTokenCount(run.spentTokens) })] }, run.runId));
        }) }));
}
//# sourceMappingURL=list-workflow-runs.js.map