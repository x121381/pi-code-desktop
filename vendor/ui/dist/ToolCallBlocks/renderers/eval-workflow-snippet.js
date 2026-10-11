import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { FlaskConical } from "lucide-react";
import { useCallback, useMemo } from "react";
import { CodeBlock, CodeBlockHeader, CodeBlockCopyButton, } from "../../components/ai-elements/code-block.js";
import { useNowTicker } from "../../components/workflow-graph/use-now-ticker.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { readToolResultDisplay } from "../../ToolCallBlocks/toolResultDisplay.js";
import { ToolLayout } from "../../ToolCallBlocks/ToolLayout.js";
import { WorkflowDiagnosticsSection } from "../../ToolCallBlocks/renderers/workflow-diagnostics.js";
import { snippetResponse, snippetValue, } from "../../ToolCallBlocks/renderers/workflow-snippet-presentation.js";
const ICON = _jsx(FlaskConical, { className: "size-4 shrink-0 text-foreground-subtle" });
/** 三态摘要不放结果预览，展开内容按执行状态排序。 */
export function EvalWorkflowSnippetToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const display = readToolResultDisplay(toolCall.raw);
    const snippet = display?.kind === "eval_workflow_snippet" ? display : undefined;
    const running = context.isRunning;
    const failed = !running && (toolCall.status === "failed" || snippet?.ok === false);
    const startedAt = toolCall.startedAt;
    // 进行中按整秒走、每秒一格（与面板里其他计时同一粒度）；终态定格在工具结果的精确毫秒。
    // 不能每 100ms 显示一次毫秒——尾数肉眼读不了，却是聊天区里最频繁的待处理更新
    // （React 嵌套更新计数在投影帧积压时的种子）。
    const now = useNowTicker(running && typeof startedAt === "number");
    const durationText = running
        ? typeof startedAt === "number"
            ? `${Math.max(0, Math.floor((now - startedAt) / 1000))}s`
            : undefined
        : snippet?.durationMs === undefined
            ? undefined
            : `${snippet.durationMs}ms`;
    const durationNode = useMemo(() => !failed && durationText !== undefined ? (_jsx("span", { className: "font-mono tabular-nums", children: durationText })) : undefined, [durationText, failed]);
    const input = toolCall.input;
    const code = typeof input?.code === "string" && input.code.trim() ? input.code : undefined;
    const response = useMemo(() => snippet
        ? snippetResponse(snippet)
        : typeof toolCall.output === "string" && toolCall.output.trim()
            ? toolCall.output
            : undefined, [snippet, toolCall.output]);
    const error = context.errorText ||
        (failed ? response || snippet?.diagnostics.map((d) => d.message).join("\n") : undefined);
    // 展开入口与当前实际展示的内容一致，不能因隐藏的代码/日志留下空面板。
    const hasDetails = running
        ? code !== undefined
        : failed
            ? code !== undefined ||
                !!snippet?.logs.length ||
                !!snippet?.diagnostics.length ||
                !!(response || error)
            : response !== undefined;
    const renderContent = useCallback(() => (_jsx(SnippetBody, { code: code, display: snippet, running: running, failed: failed, response: failed ? response || (!snippet?.diagnostics.length ? error : undefined) : response, theme: context.theme }, running ? "running" : "terminal")), [code, snippet, running, failed, response, error, context.theme]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: ICON, showIcon: context.showIcon !== false, canToggle: hasDetails && (context.canToggle ?? true), forceOpen: hasDetails && (context.forceOpen ?? false), kindLabel: context.kindLabelOverride ??
                    intl.formatMessage({
                        id: running
                            ? "chat.toolCall.workflow.snippet.validating"
                            : "chat.toolCall.workflow.snippet.ran",
                    }), sourceLabel: context.sourceLabel, primaryText: durationNode, summaryContentSeparator: "\u00B7", statusLabel: failed ? intl.formatMessage({ id: "chat.toolCall.status.failed" }) : undefined, statusTooltip: failed ? error : undefined, showFailureStatus: failed, isRunning: running, renderContent: hasDetails ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
function SnippetBody({ code, display, running, failed, response, theme, }) {
    const { intl } = useZCodeIntl();
    if (!failed) {
        const content = running
            ? code === undefined
                ? undefined
                : { code, language: "typescript" }
            : response === undefined
                ? undefined
                : snippetValue(response);
        if (!content)
            return null;
        return (_jsx(SnippetTextPanel, { text: content.code, language: content.language, running: running, truncated: !running && display?.truncated === true }, content.code));
    }
    const codeLabel = intl.formatMessage({ id: "chat.toolCall.workflow.snippet.section.code" });
    const codeBlock = code === undefined ? null : (_jsx(CodeBlock, { code: code, language: "typescript", appTheme: theme, showLineNumbers: true, renderMermaid: false }));
    const value = response === undefined ? undefined : snippetValue(response);
    return (_jsxs("div", { className: "mb-2 space-y-3", "data-testid": "workflow-snippet-body", children: [display?.diagnostics.length ? (_jsx(WorkflowDiagnosticsSection, { diagnostics: display.diagnostics })) : null, value ? (_jsx("section", { className: "space-y-1.5", "data-testid": "snippet-result", children: _jsx("div", { className: "max-h-72 overflow-auto", children: _jsx(CodeBlock, { code: value.code, language: value.language, appTheme: theme, renderMermaid: false, children: _jsxs(CodeBlockHeader, { children: [_jsx("h4", { className: "text-ui-sm font-medium text-foreground-subtlest", children: intl.formatMessage({
                                        id: failed
                                            ? "chat.toolCall.status.failed"
                                            : "chat.toolCall.workflow.snippet.section.response",
                                    }) }), _jsx(CodeBlockCopyButton, {})] }) }) }) })) : null, display?.logs.some((line) => line.trim()) ? (_jsxs("section", { className: "space-y-1.5", "data-testid": "snippet-logs", children: [_jsx("h4", { className: "text-ui-sm font-medium text-foreground-subtlest", children: intl.formatMessage({ id: "chat.toolCall.workflow.snippet.section.logs" }) }), _jsx("pre", { className: "max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-panel px-3 py-2 font-mono text-ui-sm text-foreground-subtle", children: display.logs.join("\n") })] })) : null, codeBlock ? (_jsxs("details", { className: "space-y-2", "data-testid": "snippet-code", children: [_jsx("summary", { className: "cursor-pointer text-ui-sm text-foreground-subtlest", children: codeLabel }), _jsx("div", { className: "max-h-64 overflow-auto", children: codeBlock })] })) : null, display?.truncated ? (_jsx("p", { className: "text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.truncated" }) })) : null] }));
}
/** 共用 Markdown 工具栏，正文独立滚动，避免复制按钮随长内容卷走。 */
function SnippetTextPanel({ text, language, running, truncated, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "mb-2 min-w-0", "data-testid": "workflow-snippet-body", children: [_jsx("div", { "data-testid": running ? "snippet-running-code" : "snippet-result", children: _jsx(CodeBlock, { code: text, language: language, className: "border border-border bg-card", contentClassName: "max-h-80 overflow-auto", wrapLongLines: true, renderMermaid: false, children: _jsx(CodeBlockHeader, { className: "pl-3 pr-2 pt-2", language: language }) }) }), truncated ? (_jsx("p", { className: "mt-1 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.truncated" }) })) : null] }));
}
//# sourceMappingURL=eval-workflow-snippet.js.map