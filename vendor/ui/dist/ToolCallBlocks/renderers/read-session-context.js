import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BookOpenTextIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { MessageResponse } from "../../components/ai-elements/message.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "../../ToolCallBlocks/ToolLayout.js";
const READ_SESSION_CONTEXT_TOOL_ICON = (_jsx(BookOpenTextIcon, { className: "size-4 shrink-0 text-foreground-subtle" }));
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readStringField(value, keys) {
    for (const key of keys) {
        const candidate = value[key];
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
        }
    }
    return undefined;
}
function readNestedRecordField(value, keys) {
    if (!isPlainRecord(value)) {
        return undefined;
    }
    for (const key of keys) {
        const candidate = value[key];
        if (isPlainRecord(candidate)) {
            return candidate;
        }
    }
    return undefined;
}
function extractTextContent(value) {
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? value : undefined;
    }
    if (Array.isArray(value)) {
        const parts = value
            .map((item) => extractTextContent(item))
            .filter((item) => item !== undefined);
        return parts.length > 0 ? parts.join("\n") : undefined;
    }
    if (!isPlainRecord(value)) {
        if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
            return String(value);
        }
        return undefined;
    }
    const directText = readStringField(value, [
        "content",
        "output",
        "result",
        "text",
        "message",
        "error",
    ]);
    if (directText) {
        return directText;
    }
    const nestedRecord = readNestedRecordField(value, ["rawOutput", "output"]);
    if (nestedRecord) {
        const nestedText = extractTextContent(nestedRecord);
        if (nestedText) {
            return nestedText;
        }
    }
    const content = value.content;
    if (Array.isArray(content)) {
        const contentText = extractTextContent(content);
        if (contentText) {
            return contentText;
        }
    }
    return undefined;
}
function readRawInput(raw) {
    if (!isPlainRecord(raw)) {
        return undefined;
    }
    return raw.rawInput ?? raw.input;
}
function readRawOutput(raw) {
    if (!isPlainRecord(raw)) {
        return undefined;
    }
    return raw.rawOutput ?? raw.output;
}
function extractQuery(toolCall) {
    if (typeof toolCall.input === "string") {
        const trimmed = toolCall.input.trim();
        return trimmed.length > 0 ? toolCall.input : undefined;
    }
    for (const candidate of [
        toolCall.input,
        toolCall.output,
        readRawInput(toolCall.raw),
        readRawOutput(toolCall.raw),
    ]) {
        if (!isPlainRecord(candidate)) {
            continue;
        }
        const query = readStringField(candidate, ["query", "prompt", "question"]);
        if (query) {
            return query;
        }
    }
    return undefined;
}
function extractSessionId(toolCall) {
    for (const candidate of [
        toolCall.input,
        toolCall.output,
        readRawInput(toolCall.raw),
        readRawOutput(toolCall.raw),
    ]) {
        if (!isPlainRecord(candidate)) {
            continue;
        }
        const sessionId = readStringField(candidate, ["sessionId", "session_id"]);
        if (sessionId) {
            return sessionId;
        }
    }
    return undefined;
}
function extractResultContent(toolCall) {
    const outputText = extractTextContent(toolCall.output);
    if (outputText) {
        return outputText;
    }
    return extractTextContent(readRawOutput(toolCall.raw));
}
export function ReadSessionContextToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCallNode, isRunning, statusLabel, errorText } = context;
    const { toolCall } = toolCallNode;
    const query = extractQuery(toolCall);
    const sessionId = extractSessionId(toolCall);
    const resultContent = extractResultContent(toolCall);
    const visibleResult = toolCall.status === "failed" ? errorText : resultContent;
    const fallbackTitle = intl.formatMessage({ id: "chat.toolCall.sessionContext.title" });
    const primaryText = useMemo(() => _jsx("span", { className: "min-w-0 truncate", children: query ?? toolCall.title ?? fallbackTitle }), [fallbackTitle, query, toolCall.title]);
    const secondaryText = useMemo(() => sessionId ? (_jsx("code", { className: "min-w-0 truncate rounded-md bg-surface px-1.5 py-0.5 font-mono text-ui-base text-foreground-subtle", children: sessionId })) : undefined, [sessionId]);
    const renderContent = useCallback(() => (_jsxs("div", { className: "space-y-3 rounded-xl border border-border bg-panel px-4 py-3", children: [query ? (_jsxs("section", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-ui-base font-medium uppercase text-foreground-subtle", children: intl.formatMessage({
                            id: "chat.toolCall.sessionContext.query",
                        }) }), _jsx("p", { className: "whitespace-pre-wrap break-words text-ui-base text-foreground", children: query })] })) : null, _jsxs("section", { className: "space-y-1.5", children: [_jsx("h4", { className: "text-ui-base font-medium uppercase text-foreground-subtle", children: intl.formatMessage({
                            id: "chat.toolCall.sessionContext.result",
                        }) }), visibleResult ? (_jsx(MessageResponse, { className: "min-w-0 break-words text-ui-base", workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenExternalUrl: context.onOpenBrowserUrl, children: visibleResult })) : (_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                            id: "chat.toolCall.sessionContext.noResult",
                        }) }))] })] })), [
        context.codePreviewSettings,
        context.onOpenBrowserUrl,
        context.onOpenCodeViewer,
        context.onOpenFileLink,
        context.theme,
        context.workspacePath,
        intl,
        query,
        visibleResult,
    ]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: READ_SESSION_CONTEXT_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: context.canToggle ?? true, forceOpen: context.forceOpen ?? false, hideSecondaryTextWhenOpen: true, kindLabel: intl.formatMessage({
                    id: isRunning
                        ? "chat.toolCall.sessionContext.reading"
                        : "chat.toolCall.kind.sessionContext",
                }), sourceLabel: context.sourceLabel, primaryText: primaryText, secondaryText: secondaryText, statusLabel: statusLabel, statusTooltip: toolCall.status === "failed" ? errorText : undefined, showFailureStatus: toolCall.status === "failed", isRunning: isRunning, title: toolCall.title, renderContent: renderContent }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=read-session-context.js.map