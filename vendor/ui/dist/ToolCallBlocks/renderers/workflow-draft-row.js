import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { CodeBlock, CodeBlockHeader } from "../../components/ai-elements/code-block.js";
import { cn } from "../../components/lib/utils.js";
import { DRAFT_FEEDBACK_DOT } from "../../components/workflow-graph/run-status-presentation.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatWorkflowFeedbackTooltip, workflowDiagnosticLines, } from "../../ToolCallBlocks/renderers/createWorkflowDisplay.js";
import { WorkflowDiagnosticsSection, workflowFeedbackLedeMessageId, } from "../../ToolCallBlocks/renderers/workflow-diagnostics.js";
export function useWorkflowDraftRowSlots({ draft, compileErrors, inFlight, errorCount, diagnostics, saved, }) {
    const { intl } = useZCodeIntl();
    const ordinal = workflowDraftOrdinalShown(draft, { compileErrors, inFlight });
    const inFlightOrdinal = workflowDraftOrdinalShown(draft, { compileErrors: false, inFlight });
    const inFlightOrdinalText = inFlightOrdinal === undefined
        ? undefined
        : intl.formatMessage({ id: "chat.toolCall.workflow.draftOrdinal" }, { ordinal: String(inFlightOrdinal) });
    const superseded = draft?.superseded === true;
    const lede = intl.formatMessage({ id: workflowFeedbackLedeMessageId(saved) });
    const words = compileErrors
        ? `${intl.formatMessage({ id: "chat.toolCall.workflow.toFix" }, { count: errorCount })} · ${intl.formatMessage({ id: "chat.toolCall.workflow.notRun" })}`
        : undefined;
    // ToolLayout 是 memo 组件：交给它的节点必须按值记忆，否则每次父级渲染都会整行重渲染。
    const secondaryText = useMemo(() => (ordinal === undefined ? undefined : _jsx(WorkflowDraftOrdinal, { ordinal: ordinal })), [ordinal]);
    const statusLabel = useMemo(() => words === undefined ? undefined : _jsx("span", { "data-testid": "workflow-draft-status", children: words }), [words]);
    const statusIndicator = useMemo(() => (compileErrors ? _jsx(WorkflowDraftLamp, { superseded: superseded }) : undefined), [compileErrors, superseded]);
    const statusTooltip = useMemo(() => (compileErrors ? formatWorkflowFeedbackTooltip(lede, diagnostics) : undefined), [compileErrors, diagnostics, lede]);
    return { secondaryText, statusLabel, statusIndicator, statusTooltip, inFlightOrdinalText };
}
/**
 * 反馈行展开后的内容：脚本（带行号，被诊断点名的行号着警示色）、编译反馈卡；没有 display 时退回
 * 纯文本输出。待确认行复用同一块（那时没有诊断，只有脚本）。
 */
export function WorkflowFeedbackContent({ display, fallbackOutputText, saved, scriptText, }) {
    // 按内容记忆：display 不变就是同一个数组，代码块的注入样式不会跟着重建。
    const flaggedLines = useMemo(() => (display?.ok === false ? workflowDiagnosticLines(display.diagnostics) : undefined), [display]);
    return (_jsxs("div", { className: "mb-2 space-y-3", children: [scriptText ? (_jsx("div", { "data-testid": "workflow-script-codeblock", children: _jsx(CodeBlock, { className: "border border-border bg-card", contentClassName: "max-h-80 overflow-auto", code: scriptText, language: "typescript", showLineNumbers: true, ...(flaggedLines === undefined ? {} : { markedLines: flaggedLines }), children: _jsx(CodeBlockHeader, { className: "pl-3 pr-2 pt-2", language: "typescript" }) }) })) : null, display && display.diagnostics.length > 0 ? (_jsx(WorkflowDiagnosticsSection, { count: display.errorCount, diagnostics: display.diagnostics, saved: saved, truncated: display.truncated })) : null, !display && fallbackOutputText ? (_jsx("pre", { className: "max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border bg-panel px-3 py-2 font-mono text-ui-base text-foreground-subtle", children: fallbackOutputText })) : null] }));
}
/**
 * 细节槽里要不要写稿号：编不过的行总是写（宿主给了位置时）；在途行从第 2 稿起写。
 * 运行卡、启动摘要与确认窗不走这里，永远不带稿号。
 */
export function workflowDraftOrdinalShown(draft, phase) {
    if (draft === undefined)
        return undefined;
    if (phase.compileErrors)
        return draft.ordinal;
    return phase.inFlight && draft.ordinal >= 2 ? draft.ordinal : undefined;
}
export function WorkflowDraftOrdinal({ ordinal }) {
    const { intl } = useZCodeIntl();
    return (_jsx("span", { className: "shrink-0 whitespace-nowrap tabular-nums", "data-testid": "workflow-draft-ordinal", children: intl.formatMessage({ id: "chat.toolCall.workflow.draftOrdinal" }, { ordinal: String(ordinal) }) }));
}
/**
 * 空环灯：形状说「什么都没跑」，颜色说注意力是否还悬着（最新一稿警示色，有更新的一稿后褪成中性）。
 * `wf-lamp` 让颜色的变化走过渡，而不是一跳。
 */
export function WorkflowDraftLamp({ superseded }) {
    return (_jsx("span", { "aria-hidden": true, className: cn("wf-lamp size-2 shrink-0 rounded-full", superseded ? DRAFT_FEEDBACK_DOT.settled : DRAFT_FEEDBACK_DOT.open), "data-draft-lamp": superseded ? "settled" : "open", "data-testid": "workflow-draft-lamp" }));
}
//# sourceMappingURL=workflow-draft-row.js.map