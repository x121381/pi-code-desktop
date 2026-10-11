import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ExecuteCommand } from "@/ToolCallBlocks/renderers/ExecuteCommand.js";
import { bashOutputDisplaySchema, executionOutputPreviewSchema, } from "@zcode/shared/zcode-protocol-v4";
import { ExecuteOutput } from "@/ToolCallBlocks/renderers/ExecuteOutput.js";
import { SquareTerminalIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "../ToolLayout.js";
const EXECUTE_TOOL_ICON = _jsx(SquareTerminalIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function getExecuteSecondaryText(input) {
    if (typeof input === "string") {
        const trimmed = input.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    if (Array.isArray(input) && input.every((item) => typeof item === "string")) {
        const parts = input.map((item) => item.trim()).filter(Boolean);
        if (parts.length === 0) {
            return undefined;
        }
        const shellCommandIndex = parts.findIndex((part) => part === "-lc");
        if (shellCommandIndex >= 0 && parts[shellCommandIndex + 1]) {
            return parts[shellCommandIndex + 1];
        }
        return parts.join(" ");
    }
    if (typeof input !== "object" || input === null) {
        return undefined;
    }
    const record = input;
    const parsedCommand = record.parsed_cmd;
    if (Array.isArray(parsedCommand)) {
        for (const item of parsedCommand) {
            if (typeof item === "string") {
                const trimmed = item.trim();
                if (trimmed.length > 0) {
                    return trimmed;
                }
                continue;
            }
            if (typeof item !== "object" || item === null) {
                continue;
            }
            const parsedRecord = item;
            if (typeof parsedRecord.cmd === "string" && parsedRecord.cmd.trim().length > 0) {
                return parsedRecord.cmd.trim();
            }
        }
    }
    for (const key of ["command", "cmd", "script", "parsed_cmd"]) {
        const candidate = record[key];
        if (typeof candidate !== "string") {
            continue;
        }
        const trimmed = candidate.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return undefined;
}
function readFirstStringField(record, keys) {
    for (const key of keys) {
        const candidate = record[key];
        if (typeof candidate !== "string") {
            continue;
        }
        const trimmed = candidate.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return undefined;
}
function getExecuteContentParts(input) {
    if (typeof input === "string") {
        const trimmed = input.trim();
        if (trimmed.length === 0) {
            return {};
        }
        const shellMatch = trimmed.match(/^(?:\/bin\/)?(?<tool>zsh|bash|sh)\s+-lc\s+(?<command>[\s\S]+)$/i);
        if (shellMatch?.groups) {
            return {
                executionCommand: shellMatch.groups.command?.trim() || undefined,
            };
        }
        return {
            executionCommand: trimmed,
        };
    }
    if (Array.isArray(input) && input.every((item) => typeof item === "string")) {
        const parts = input.map((item) => item.trim()).filter(Boolean);
        if (parts.length === 0) {
            return {};
        }
        const shellCommandIndex = parts.findIndex((part) => part === "-lc");
        if (shellCommandIndex >= 0) {
            return {
                executionCommand: parts[shellCommandIndex + 1] || undefined,
            };
        }
        return {
            executionCommand: parts.slice(1).join(" ") || undefined,
        };
    }
    if (typeof input !== "object" || input === null) {
        return {};
    }
    const record = input;
    if (typeof record.command === "string" && record.command.trim().length > 0) {
        return getExecuteContentParts(record.command);
    }
    if (typeof record.cmd === "string" && record.cmd.trim().length > 0) {
        return getExecuteContentParts(record.cmd);
    }
    if (typeof record.script === "string" && record.script.trim().length > 0) {
        return getExecuteContentParts(record.script);
    }
    const parsedCommand = record.parsed_cmd;
    if (Array.isArray(parsedCommand)) {
        for (const item of parsedCommand) {
            if (typeof item === "string") {
                const parts = getExecuteContentParts(item);
                if (parts.executionCommand) {
                    return parts;
                }
                continue;
            }
            if (typeof item !== "object" || item === null) {
                continue;
            }
            const parsedRecord = item;
            const executionCommand = typeof parsedRecord.cmd === "string" && parsedRecord.cmd.trim().length > 0
                ? parsedRecord.cmd.trim()
                : typeof parsedRecord.command === "string" && parsedRecord.command.trim().length > 0
                    ? parsedRecord.command.trim()
                    : typeof parsedRecord.script === "string" && parsedRecord.script.trim().length > 0
                        ? parsedRecord.script.trim()
                        : undefined;
            if (executionCommand) {
                return { executionCommand };
            }
        }
    }
    return {};
}
function extractExecuteResultText(output) {
    if (output == null) {
        return null;
    }
    if (typeof output === "string") {
        const trimmed = output.trim();
        return trimmed.length > 0 ? output : null;
    }
    if (Array.isArray(output)) {
        const pieces = output
            .map((item) => extractExecuteResultText(item))
            .filter((item) => item != null);
        return pieces.length > 0 ? pieces.join("\n") : null;
    }
    if (isPlainRecord(output)) {
        const directText = readFirstStringField(output, [
            "output",
            "text",
            "content",
            "result",
            "stdout",
            "message",
        ]);
        if (directText) {
            return directText;
        }
        const rawOutput = output.rawOutput;
        if (rawOutput !== undefined) {
            const nestedText = extractExecuteResultText(rawOutput);
            if (nestedText) {
                return nestedText;
            }
        }
        const content = output.content;
        if (Array.isArray(content)) {
            const contentText = content
                .map((item) => {
                if (typeof item === "string") {
                    return item.trim();
                }
                if (isPlainRecord(item)) {
                    return (readFirstStringField(item, [
                        "output",
                        "text",
                        "content",
                        "result",
                        "stdout",
                        "message",
                    ]) ?? "");
                }
                return "";
            })
                .filter(Boolean)
                .join("\n");
            if (contentText.length > 0) {
                return contentText;
            }
        }
    }
    if (typeof output === "number" || typeof output === "boolean" || typeof output === "bigint") {
        return String(output);
    }
    return null;
}
export function ExecuteToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCallNode, isRunning, statusLabel, errorText, isOfficeMode = false } = context;
    const { toolCall } = toolCallNode;
    const secondaryText = getExecuteSecondaryText(toolCall.input);
    const contentParts = getExecuteContentParts(toolCall.input);
    const outputText = extractExecuteResultText(toolCall.output);
    const rawOutputText = isPlainRecord(toolCall.raw)
        ? extractExecuteResultText(toolCall.raw.rawOutput)
        : null;
    const outputDisplay = useMemo(() => {
        if (!isPlainRecord(toolCall.raw))
            return undefined;
        const parsed = bashOutputDisplaySchema.safeParse(toolCall.raw.display);
        return parsed.success ? parsed.data : undefined;
    }, [toolCall.raw]);
    const resultText = outputDisplay?.output ?? outputText ?? rawOutputText;
    const outputPreview = useMemo(() => {
        if (!isRunning || !isPlainRecord(toolCall.raw))
            return undefined;
        const parsed = executionOutputPreviewSchema.safeParse(toolCall.raw.outputPreview);
        return parsed.success ? parsed.data : undefined;
    }, [isRunning, toolCall.raw]);
    const failureVisibleText = toolCall.status === "failed" ? (errorText ?? resultText ?? undefined) : undefined;
    const secondaryTextNode = useMemo(
    // 收起态 command 属于摘要正文，使用 UI sans 与同一行文案保持一致；
    // 展开后的完整命令仍保留 font-mono，便于阅读和复制技术内容。
    () => _jsx("code", { className: "truncate font-sans", children: secondaryText }), [secondaryText]);
    const renderContent = useCallback(() => (_jsxs("div", { "data-testid": "execute-detail", className: "space-y-3 mb-2 rounded-xl border border-border bg-panel px-4 py-3", children: [_jsx("div", { className: "space-y-1", children: _jsx("div", { className: "flex items-start gap-2 font-sans text-ui-base text-foreground", children: _jsx(ExecuteCommand, { command: contentParts.executionCommand }, contentParts.executionCommand) }) }), context.isPermissionPreview ? null : outputPreview || failureVisibleText || resultText ? (_jsx(ExecuteOutput, { text: outputPreview?.fullText ?? failureVisibleText ?? resultText ?? "", running: isRunning })) : (!isRunning && (_jsx("div", { className: "space-y-1", children: _jsx("p", { className: "font-mono text-ui-base text-foreground-subtle", children: intl.formatMessage({
                        id: "chat.toolCall.execute.noOutput",
                    }) }) })))] })), [
        contentParts.executionCommand,
        context.isPermissionPreview,
        failureVisibleText,
        intl,
        isRunning,
        resultText,
        outputPreview,
    ]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: EXECUTE_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: !isOfficeMode && (context.canToggle ?? true), forceOpen: !isOfficeMode && (context.forceOpen ?? false), hideSecondaryTextWhenOpen: true, kindLabel: (isOfficeMode
                    ? intl.formatMessage({
                        id: isRunning
                            ? "chat.toolCall.execute.running"
                            : "chat.toolCall.execute.conciseCompleted",
                    })
                    : context.kindLabelOverride) ??
                    intl.formatMessage({
                        id: isRunning ? "chat.toolCall.execute.running" : "chat.toolCall.kind.terminal",
                    }), sourceLabel: context.sourceLabel, primaryText: isOfficeMode || secondaryText
                    ? null
                    : (toolCall.title ??
                        toolCall.kind ??
                        intl.formatMessage({ id: "chat.toolCall.execute.execute" })), secondaryText: isOfficeMode ? undefined : secondaryTextNode, statusLabel: statusLabel, statusTooltip: isOfficeMode ? undefined : failureVisibleText, showFailureStatus: toolCall.status === "failed", isRunning: isRunning, title: isOfficeMode ? undefined : toolCall.title, renderContent: renderContent }), !isOfficeMode ? (_jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })) : null] }));
}
//# sourceMappingURL=execute.js.map