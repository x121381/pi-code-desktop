import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Gauge } from "lucide-react";
import { useCallback, useMemo } from "react";
import { CodeBlock, CodeBlockHeader } from "../../components/ai-elements/code-block.js";
import { RUN_STATUS_TEXT, readWorkflowRunStopReason, workflowRunStopReasonMessageId, } from "../../components/workflow-graph/run-status-presentation.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatWorkflowAge, formatWorkflowTokenCount } from "../../lib/workflowObservationFormat.js";
import { WorkflowRunSubagentRoster } from "../../ToolCallBlocks/renderers/get-workflow-run-roster.js";
import { WorkflowRunHealthLine, WorkflowRunPhaseTrack, } from "../../ToolCallBlocks/renderers/get-workflow-run-situation.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { readToolResultDisplay } from "../../ToolCallBlocks/toolResultDisplay.js";
import { ToolLayout } from "../../ToolCallBlocks/ToolLayout.js";
const ICON = _jsx(Gauge, { className: "size-4 shrink-0 text-foreground-subtle" });
export function GetWorkflowRunToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const display = readToolResultDisplay(toolCall.raw);
    const running = context.isRunning;
    // 查询错误与 run 执行失败是两个状态层级；错误查询不能继续展示旧 display。
    const failed = !running && toolCall.status === "failed";
    const run = !running && !failed && display?.kind === "get_workflow_run" ? display : undefined;
    const fallback = typeof toolCall.output === "string" ? toolCall.output.trim() : undefined;
    const failureLabel = intl.formatMessage({ id: "chat.toolCall.status.failed" });
    const error = context.errorText || fallback || failureLabel;
    const primaryText = useMemo(() => run ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "min-w-0 truncate", children: run.label ?? intl.formatMessage({ id: "chat.toolCall.workflow.fallbackName" }) }), _jsx("span", { "aria-hidden": true, children: "\u00B7" }), run.summary === undefined || run.summary.length === 0 ? (_jsx("span", { className: "shrink-0 tabular-nums", children: intl.formatMessage({ id: "chat.toolCall.workflow.card.steps" }, {
                    done: run.usage.nodesCompleted + run.usage.nodesFailed,
                    total: run.usage.nodesObserved,
                }) })) : (_jsx("span", { className: "min-w-0 truncate", "data-testid": "workflow-run-summary-line", children: run.summary }))] })) : undefined, [intl, run]);
    const hasDetails = !running && (failed || run !== undefined || Boolean(fallback));
    const renderContent = useCallback(() => {
        if (failed || !run)
            return (_jsx("p", { "data-testid": "workflow-status-body", className: "mb-2 max-h-80 overflow-auto whitespace-pre-wrap break-words text-ui-base text-foreground-subtle", children: failed ? error : fallback }));
        return _jsx(GetWorkflowRunBody, { display: run, theme: context.theme });
    }, [failed, run, error, fallback, context.theme]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: ICON, showIcon: context.showIcon !== false, kindLabel: context.kindLabelOverride ??
                    intl.formatMessage({
                        id: running
                            ? "chat.toolCall.workflow.getRun.fetching"
                            : "chat.toolCall.workflow.getRun.fetched",
                    }), sourceLabel: context.sourceLabel, primaryText: primaryText, isRunning: running, showFailureStatus: failed, statusLabel: failed ? failureLabel : undefined, statusTooltip: failed ? error : undefined, canToggle: hasDetails && (context.canToggle ?? true), forceOpen: hasDetails && (context.forceOpen ?? false), renderContent: hasDetails ? renderContent : undefined, title: toolCall.title }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
function GetWorkflowRunBody({ display, theme, }) {
    const { intl } = useZCodeIntl();
    const terminal = display.status === "completed" || display.status === "errored" || display.status === "stopped";
    const stopReason = readWorkflowRunStopReason(display);
    const tokens = intl.formatMessage({ id: "chat.toolCall.workflow.run.usage.tokens" }, { tokens: formatWorkflowTokenCount(display.usage.spentTokens) });
    let json;
    if (display.result !== undefined) {
        try {
            const value = JSON.parse(display.result);
            if (value !== null && typeof value === "object")
                json = JSON.stringify(value, null, 2);
        }
        catch {
            /* 普通文本结果沿用正文排版。 */
        }
    }
    const logs = display.logTail
        .map((entry) => {
        // 事件落 journal 的时刻有则前缀年龄，没有就只剩正文：情势上线前的 journal 没有这一列，
        // 而一个编出来的「刚刚」比没有年龄更糟。年龄一律对快照时刻算。
        const age = formatWorkflowAge(display.generatedAt, entry.at);
        const prefix = age === undefined
            ? ""
            : `${intl.formatMessage({ id: "chat.toolCall.workflow.getRun.age" }, { age })}  `;
        return `${prefix}${entry.message}`;
    })
        .filter((line) => line.trim())
        .join("\n");
    return (_jsxs("div", { className: "mb-2 min-w-0 space-y-2", "data-testid": "workflow-status-body", children: [display.summary === undefined || display.summary.length === 0 ? null : (_jsx("p", { className: "break-words text-ui-base text-foreground", "data-testid": "workflow-run-summary", children: display.summary })), display.health?.pendingQuestionsKnown === false ? (_jsx("p", { className: "break-words text-ui-sm text-warning", "data-testid": "workflow-run-questions-unknown", children: intl.formatMessage({ id: "chat.toolCall.workflow.getRun.questionsUnknown" }) })) : null, display.error ? (_jsxs("p", { className: "max-h-80 overflow-auto whitespace-pre-wrap break-words text-ui-base text-destructive", children: [display.error.code, ": ", display.error.message] })) : null, display.status === "completed" && display.result ? (json ? (_jsx(CodeBlock, { code: json, language: "json", appTheme: theme, className: "border border-border bg-card", contentClassName: "max-h-80 overflow-auto", wrapLongLines: true, children: _jsx(CodeBlockHeader, { language: "json", className: "pl-3 pr-2 pt-2" }) })) : (_jsx("p", { className: "max-h-80 overflow-auto whitespace-pre-wrap break-words text-ui-base text-foreground", children: display.result }))) : null, display.phases === undefined ? null : (_jsx(WorkflowRunPhaseTrack, { generatedAt: display.generatedAt, phases: display.phases, terminal: terminal })), display.subagents === undefined ? null : (_jsx(WorkflowRunSubagentRoster, { generatedAt: display.generatedAt, subagents: display.subagents })), display.health === undefined ? null : (_jsx(WorkflowRunHealthLine, { generatedAt: display.generatedAt, health: display.health, terminal: terminal })), _jsxs("div", { className: "flex flex-wrap items-center gap-x-2 text-ui-sm text-foreground-subtlest", children: [_jsx("span", { className: RUN_STATUS_TEXT[display.status], children: intl.formatMessage({ id: `chat.toolCall.workflow.run.status.${display.status}` }) }), stopReason ? (_jsx("span", { "data-testid": "workflow-run-stop-reason", children: intl.formatMessage({ id: workflowRunStopReasonMessageId(stopReason) }) })) : null, _jsx("span", { "aria-hidden": true, children: "\u00B7" }), !terminal ? (_jsxs(_Fragment, { children: [_jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.workflow.card.steps" }, {
                                    done: display.usage.nodesCompleted + display.usage.nodesFailed,
                                    total: display.usage.nodesObserved,
                                }) }), _jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.workflow.getRun.runningNodes" }, { count: display.usage.nodesRunning }) }), _jsx("span", { "aria-hidden": true, children: "\u00B7" })] })) : null, _jsx("span", { children: tokens })] }), display.status !== "completed" && logs ? (_jsx("pre", { className: "max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-panel px-3 py-2 font-mono text-ui-sm text-foreground-subtle", children: logs })) : null, display.possiblyInterrupted ? (_jsx("p", { className: "text-ui-sm text-warning", children: intl.formatMessage({ id: "chat.toolCall.workflow.getRun.interruptedHint" }) })) : null, display.truncated ? (_jsx("p", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.getRun.truncated" }) })) : null] }));
}
//# sourceMappingURL=get-workflow-run.js.map