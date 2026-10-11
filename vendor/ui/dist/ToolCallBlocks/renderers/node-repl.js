import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useMemo } from "react";
import { ChevronRightIcon, ExternalLinkIcon, SquareMousePointerIcon } from "lucide-react";
import { Button } from "@/components/ui/button.js";
import { CodeBlock, CodeBlockActions, CodeBlockCopyButton, CodeBlockHeader, CodeBlockTitle, CodeBlockWrapButton, } from "@/components/ai-elements/code-block.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { cuaAppKeyToIconRequest } from "@/lib/cuaAppIconRequest.js";
import { buildNodeReplDisplayModel } from "@/lib/nodeReplToolDisplay.js";
import { CuaAppSummaryIcon } from "@/ToolCallBlocks/renderers/cuaAppSummaryIcon.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
import { NodeReplImageGrid } from "@/ToolCallBlocks/renderers/nodeReplImageGrid.js";
const NODE_REPL_TOOL_ICON = (_jsx(SquareMousePointerIcon, { className: "size-4 shrink-0 text-foreground-subtle" }));
// Radix 会在浏览器工具及执行详情打开时立即测量高度；代码块默认的 200px 离屏占位
// 会让动画先展开过头再回落。两层内容都只在对应区域展开时挂载，使用真实布局不会损失长会话性能。
const COLLAPSIBLE_CODE_LAYOUT_STYLE = {
    containIntrinsicSize: "none",
    contentVisibility: "visible",
};
const COMPACT_RESULT_MAX_LENGTH = 160;
function looksLikeJson(value) {
    const trimmed = value.trim();
    if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
        return false;
    }
    try {
        JSON.parse(trimmed);
        return true;
    }
    catch {
        return false;
    }
}
function isCompactResult(value) {
    const trimmed = value.trim();
    return (trimmed.length > 0 &&
        trimmed.length <= COMPACT_RESULT_MAX_LENGTH &&
        !trimmed.includes("\n") &&
        !looksLikeJson(trimmed));
}
function getSummary(model, status, isRunning, formatMessage) {
    const isFailed = status === "failed";
    const isDenied = status === "denied";
    const isStopped = status === "stopped";
    if (isDenied || isStopped) {
        return {
            title: formatMessage(isDenied ? "chat.toolCall.nodeRepl.denied" : "chat.toolCall.nodeRepl.stopped"),
        };
    }
    if (model.operation === "reset") {
        return {
            title: formatMessage(isFailed
                ? "chat.toolCall.nodeRepl.resetFailed"
                : isRunning
                    ? "chat.toolCall.nodeRepl.resetting"
                    : "chat.toolCall.nodeRepl.reset"),
        };
    }
    if (model.operation === "add-module-dir") {
        return {
            title: formatMessage(isFailed
                ? "chat.toolCall.nodeRepl.configureFailed"
                : isRunning
                    ? "chat.toolCall.nodeRepl.configuring"
                    : "chat.toolCall.nodeRepl.configured"),
            detail: model.moduleDirectory,
        };
    }
    const fallbackTitle = formatMessage(isFailed
        ? "chat.toolCall.nodeRepl.failed"
        : isRunning
            ? "chat.toolCall.nodeRepl.processing"
            : "chat.toolCall.nodeRepl.finished");
    return {
        title: model.userTitle ?? fallbackTitle,
        status: model.userTitle
            ? formatMessage(isFailed
                ? "chat.toolCall.nodeRepl.failed"
                : isRunning
                    ? "chat.toolCall.nodeRepl.processing"
                    : "chat.toolCall.nodeRepl.completed")
            : undefined,
    };
}
function FriendlyCodeBlock({ cardSurface = false, code, copyLabel, eagerLayout = false, label, language, wrapLabel, }) {
    return (_jsx(CodeBlock, { className: cardSurface ? "bg-card" : undefined, code: code, enableSyntaxHighlighting: language !== "log", language: language, renderMermaid: false, style: eagerLayout ? COLLAPSIBLE_CODE_LAYOUT_STYLE : undefined, wrapLongLines: true, children: _jsxs(CodeBlockHeader, { className: "pl-3 pr-2 pt-2", children: [_jsx(CodeBlockTitle, { children: _jsx("span", { className: "text-ui-base font-medium text-foreground-subtle", children: label }) }), _jsxs(CodeBlockActions, { children: [_jsx(CodeBlockWrapButton, { "aria-label": wrapLabel, title: wrapLabel }), _jsx(CodeBlockCopyButton, { "aria-label": copyLabel, title: copyLabel })] })] }) }));
}
export function NodeReplToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const model = useMemo(() => buildNodeReplDisplayModel(toolCall), [toolCall]);
    const formatMessage = useCallback((id) => intl.formatMessage({ id }), [intl]);
    const summary = useMemo(() => getSummary(model, toolCall.status, context.isRunning, formatMessage), [context.isRunning, formatMessage, model, toolCall.status]);
    // Computer Use 的 cell 携带目标应用身份时，leading icon 换成该应用的真实图标 —— 连续
    // CUA 步骤据此一眼看出各步操作的是哪个 app。图标由平台服务按
    // locator 现取，取不到时保持 node_repl 自己的图标，不切换成另一个指针图形。
    const leadingIcon = useMemo(() => {
        if (!model.app)
            return NODE_REPL_TOOL_ICON;
        const iconRequest = cuaAppKeyToIconRequest(model.app.appKey);
        if (!iconRequest)
            return NODE_REPL_TOOL_ICON;
        return (_jsx(CuaAppSummaryIcon, { iconRequest: iconRequest, name: model.app.displayName ?? model.app.appKey, fallback: NODE_REPL_TOOL_ICON }));
    }, [model.app]);
    const resultLabel = formatMessage("chat.toolCall.nodeRepl.result");
    const noResultLabel = formatMessage("chat.toolCall.nodeRepl.noResult");
    const detailsLabel = formatMessage("chat.toolCall.nodeRepl.details");
    const detailContentLabel = formatMessage("chat.toolCall.nodeRepl.detailContent");
    const technicalDetailsLabel = formatMessage("chat.toolCall.nodeRepl.technicalDetails");
    const copyResultLabel = formatMessage("chat.toolCall.nodeRepl.copyResult");
    const copyDetailsLabel = formatMessage("chat.toolCall.nodeRepl.copyDetails");
    const wrapLinesLabel = formatMessage("chat.toolCall.nodeRepl.wrapLines");
    const resultImageLabel = formatMessage("chat.toolCall.nodeRepl.resultImage");
    const fullResultLabel = model.persistedResult
        ? intl.formatMessage({ id: "chat.toolCall.nodeRepl.fullResult" }, { size: model.persistedResult.sizeLabel })
        : undefined;
    const visibleError = toolCall.status === "failed" ? (model.error?.summary ?? context.errorText) : undefined;
    const hasTechnicalDetails = Boolean(model.code || model.error?.stack);
    const hasVisibleResult = Boolean(visibleError || model.resultText || model.images.length > 0 || model.persistedResult);
    const hasDetails = model.operation === "run"
        ? hasVisibleResult || hasTechnicalDetails
        : toolCall.status === "failed" && (hasVisibleResult || hasTechnicalDetails);
    const canToggle = context.canToggle ?? hasDetails;
    const summaryText = useMemo(() => (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "min-w-0 truncate font-medium text-foreground-subtle", children: summary.title }), summary.status ? (_jsxs("span", { className: "shrink-0 text-foreground-subtlest", children: ["\u00B7 ", summary.status] })) : null, summary.detail ? (_jsx("code", { className: "min-w-0 truncate font-mono text-foreground-subtlest", children: summary.detail })) : null] })), [summary.detail, summary.status, summary.title]);
    const renderContent = useCallback(() => (_jsxs("div", { className: "mb-2 space-y-3 py-1", "data-testid": "node-repl-expanded-content", children: [visibleError ? (_jsxs("section", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-ui-base font-medium text-destructive", children: resultLabel }), _jsx("p", { className: "whitespace-pre-wrap break-words rounded-lg bg-destructive/10 px-3 py-2 text-ui-base text-destructive", children: visibleError })] })) : model.resultText && isCompactResult(model.resultText) ? (_jsx("p", { className: "break-words rounded-xl border border-border bg-card px-3 py-2 text-ui-base text-foreground-subtle", "data-testid": "node-repl-result-surface", children: model.resultText.trim() })) : model.resultText ? (_jsx("div", { className: "max-h-72 overflow-auto rounded-xl border border-border bg-card", "data-testid": "node-repl-result-surface", children: _jsx(FriendlyCodeBlock, { cardSurface: true, code: model.resultText, copyLabel: copyResultLabel, eagerLayout: true, label: resultLabel, language: looksLikeJson(model.resultText) ? "json" : "log", wrapLabel: wrapLinesLabel }) })) : !context.isRunning && model.images.length === 0 ? (_jsx("p", { className: "text-ui-base text-foreground-subtle", children: noResultLabel })) : null, model.images.length > 0 ? (_jsx(NodeReplImageGrid, { images: model.images, resultImageLabel: resultImageLabel })) : null, model.persistedResult && fullResultLabel ? (_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-ui-base text-foreground-subtle", children: [_jsx("span", { children: fullResultLabel }), context.onOpenCodeViewer ? (_jsxs(Button, { type: "button", variant: "link", size: "xs", className: "px-0", onClick: () => context.onOpenCodeViewer?.({
                            type: "file",
                            title: resultLabel,
                            path: model.persistedResult.artifactPath,
                        }), children: [formatMessage("chat.toolCall.nodeRepl.openFullResult"), _jsx(ExternalLinkIcon, { className: "size-3" })] })) : null] })) : null, hasTechnicalDetails ? (_jsxs(Collapsible, { className: "group/details", children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "ghost", size: "sm", className: "-ml-2 text-foreground-subtlest hover:bg-transparent hover:text-foreground aria-expanded:bg-transparent aria-expanded:text-foreground", children: [_jsx(ChevronRightIcon, { className: "size-3.5 transition-transform group-data-[state=open]/details:rotate-90" }), detailsLabel] }) }), _jsx(CollapsibleContent, { children: _jsxs("div", { className: "space-y-2 pt-2", children: [model.code ? (_jsx("div", { className: "max-h-72 overflow-auto rounded-xl border border-border bg-card", "data-testid": "node-repl-detail-surface", children: _jsx(FriendlyCodeBlock, { cardSurface: true, code: model.code, copyLabel: copyDetailsLabel, eagerLayout: true, label: detailContentLabel, language: "javascript", wrapLabel: wrapLinesLabel }) })) : null, model.error?.stack ? (_jsx("div", { className: "max-h-72 overflow-auto rounded-xl border border-border bg-card", "data-testid": "node-repl-detail-surface", children: _jsx(FriendlyCodeBlock, { cardSurface: true, code: model.error.stack, copyLabel: copyDetailsLabel, eagerLayout: true, label: technicalDetailsLabel, language: "log", wrapLabel: wrapLinesLabel }) })) : null] }) })] })) : null] })), [
        context.isRunning,
        context.onOpenCodeViewer,
        copyDetailsLabel,
        copyResultLabel,
        detailContentLabel,
        detailsLabel,
        formatMessage,
        fullResultLabel,
        hasTechnicalDetails,
        model,
        noResultLabel,
        resultImageLabel,
        resultLabel,
        technicalDetailsLabel,
        visibleError,
        wrapLinesLabel,
    ]);
    if (model.displaySource === "browser_turn_end") {
        return _jsx(NodeReplImageGrid, { images: model.images, resultImageLabel: resultImageLabel });
    }
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: leadingIcon, showIcon: context.showIcon !== false, canToggle: canToggle, forceOpen: context.forceOpen ?? false, kindLabel: null, sourceLabel: context.sourceLabel, primaryText: summaryText, statusLabel: formatMessage("chat.toolCall.nodeRepl.failed"), statusTooltip: visibleError, showFailureStatus: toolCall.status === "failed" && Boolean(model.userTitle), isRunning: context.isRunning, title: summary.title, renderContent: hasDetails ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=node-repl.js.map