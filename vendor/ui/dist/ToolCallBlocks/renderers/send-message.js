import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { SendIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
import { readToolResultDisplay } from "@/ToolCallBlocks/toolResultDisplay.js";
const SEND_MESSAGE_TOOL_ICON = _jsx(SendIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
function toRecord(value) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        return value;
    }
    if (typeof value !== "string" || value.trim().length === 0) {
        return undefined;
    }
    try {
        const parsed = JSON.parse(value);
        return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)
            ? parsed
            : undefined;
    }
    catch {
        return undefined;
    }
}
function readStringField(value, keys) {
    for (const key of keys) {
        const candidate = value?.[key];
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
        }
    }
    return undefined;
}
function readRawRecord(raw, keys) {
    const record = toRecord(raw);
    if (!record) {
        return undefined;
    }
    for (const key of keys) {
        const candidate = toRecord(record[key]);
        if (candidate) {
            return candidate;
        }
    }
    return undefined;
}
function readText(value) {
    return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}
function readRawResultContent(raw) {
    const rawRecord = toRecord(raw);
    const result = toRecord(rawRecord?.result);
    return result?.content;
}
function DetailField({ label, value, mono = false, }) {
    return (_jsxs("div", { className: "space-y-1", children: [_jsx("dt", { className: "text-ui-base font-medium text-foreground-subtle", children: label }), _jsx("dd", { className: mono
                    ? "whitespace-pre-wrap break-words font-mono text-ui-base text-foreground"
                    : "whitespace-pre-wrap break-words text-ui-base leading-5 text-foreground", children: value })] }));
}
export function SendMessageToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const display = readToolResultDisplay(toolCall.raw);
    const messageDisplay = display?.kind === "local_agent_message" ? display : undefined;
    const input = toRecord(toolCall.input) ?? readRawRecord(toolCall.raw, ["rawInput", "input"]);
    const directOutput = toRecord(toolCall.output);
    const rawResultContent = readRawResultContent(toolCall.raw);
    const rawResultOutput = toRecord(rawResultContent);
    const output = directOutput ?? readRawRecord(toolCall.raw, ["rawOutput", "output"]) ?? rawResultOutput;
    const outputText = (directOutput ? undefined : readText(toolCall.output)) ??
        (rawResultOutput ? undefined : readText(rawResultContent));
    const summary = readStringField(input, ["summary"]);
    const target = readStringField(input, ["to"]);
    const message = readStringField(input, ["message"]);
    // streaming input 首帧可能还没有字段，不能为一个空详情面板提供展开入口。
    const hasDetails = Boolean(target || summary || message);
    const outputMessage = readStringField(output, ["message"]);
    const outputError = readStringField(output, ["error"]);
    const outputStatus = readStringField(output, ["status"]);
    const isDenied = toolCall.status === "denied";
    const isStopped = toolCall.status === "stopped";
    const isFailed = !isDenied &&
        !isStopped &&
        (toolCall.status === "failed" ||
            messageDisplay?.status === "failed" ||
            outputStatus === "failed");
    const failureMessage = isFailed
        ? (context.errorText ??
            messageDisplay?.error ??
            messageDisplay?.message ??
            outputError ??
            outputMessage ??
            outputText)
        : undefined;
    const kindLabelId = context.isRunning
        ? "chat.toolCall.sendMessage.sending"
        : "chat.toolCall.kind.message";
    const statusLabelId = isFailed
        ? "chat.toolCall.status.failed"
        : isDenied
            ? "chat.toolCall.status.denied"
            : isStopped
                ? "chat.toolCall.status.stopped"
                : undefined;
    const primaryText = useMemo(() => _jsx("span", { className: "min-w-0 truncate", children: summary ?? toolCall.title ?? "SendMessage" }), [summary, toolCall.title]);
    const secondaryText = useMemo(() => target ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-1", children: [_jsx("span", { className: "shrink-0", children: intl.formatMessage({ id: "chat.toolCall.sendMessage.to" }) }), _jsx("code", { className: "min-w-0 truncate font-mono", children: target })] })) : undefined, [intl, target]);
    const renderContent = useCallback(() => (_jsx("div", { className: "rounded-lg border border-border bg-panel px-4 py-3", children: _jsxs("dl", { className: "space-y-3", children: [target ? (_jsx(DetailField, { label: intl.formatMessage({ id: "chat.toolCall.sendMessage.target" }), value: target, mono: true })) : null, summary ? (_jsx(DetailField, { label: intl.formatMessage({ id: "chat.toolCall.sendMessage.summary" }), value: summary })) : null, message ? (_jsx(DetailField, { label: intl.formatMessage({ id: "chat.toolCall.sendMessage.message" }), value: message })) : null] }) })), [intl, message, summary, target]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: SEND_MESSAGE_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: hasDetails && (context.canToggle ?? true), forceOpen: hasDetails && (context.forceOpen ?? false), hideSecondaryTextWhenOpen: true, kindLabel: intl.formatMessage({ id: kindLabelId }), sourceLabel: context.sourceLabel, primaryText: primaryText, secondaryText: secondaryText, statusLabel: statusLabelId ? intl.formatMessage({ id: statusLabelId }) : undefined, showStatusLabel: statusLabelId != null, statusTooltip: isFailed ? failureMessage : undefined, showFailureStatus: isFailed, isRunning: context.isRunning, title: toolCall.title, renderContent: hasDetails ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=send-message.js.map