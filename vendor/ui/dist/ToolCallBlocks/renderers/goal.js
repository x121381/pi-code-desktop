import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { GoalIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "../../ToolCallBlocks/ToolLayout.js";
const GOAL_TOOL_ICON = _jsx(GoalIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
function readNestedValue(value, path) {
    let current = value;
    for (const key of path) {
        if (!isPlainRecord(current)) {
            return undefined;
        }
        current = current[key];
    }
    return current;
}
function normalizeResultValue(value) {
    if (typeof value !== "string") {
        return value;
    }
    const trimmed = value.trim();
    if (trimmed.length === 0) {
        return undefined;
    }
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return value;
    }
}
function isEmptyResultValue(value) {
    if (value === undefined || value === null) {
        return true;
    }
    if (typeof value === "string") {
        return value.trim().length === 0;
    }
    return false;
}
function stringifyResultValue(value) {
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value);
    }
    catch {
        return String(value);
    }
}
function isSameResultValue(left, right) {
    if (isEmptyResultValue(left) || isEmptyResultValue(right)) {
        return false;
    }
    return stringifyResultValue(left) === stringifyResultValue(right);
}
function readPrimaryResult(toolCall) {
    for (const candidate of [
        toolCall.output,
        readNestedValue(toolCall.raw, ["result", "content"]),
        readNestedValue(toolCall.raw, ["rawOutput"]),
        readNestedValue(toolCall.raw, ["output"]),
    ]) {
        const normalized = normalizeResultValue(candidate);
        if (!isEmptyResultValue(normalized)) {
            return normalized;
        }
    }
    return undefined;
}
function readAdditionalContent(toolCall, primaryResult) {
    for (const candidate of [
        toolCall.content,
        readNestedValue(toolCall.raw, ["content"]),
        readNestedValue(toolCall.raw, ["result", "display"]),
    ]) {
        const normalized = normalizeResultValue(candidate);
        if (!isEmptyResultValue(normalized) && !isSameResultValue(normalized, primaryResult)) {
            return normalized;
        }
    }
    return undefined;
}
function buildGoalResultPayload(toolCall, errorText) {
    const primaryResult = readPrimaryResult(toolCall);
    const content = readAdditionalContent(toolCall, primaryResult);
    const thought = normalizeResultValue(toolCall.thought);
    const payload = {
        status: toolCall.status,
    };
    if (!isEmptyResultValue(primaryResult)) {
        payload.result = primaryResult;
    }
    if (!isEmptyResultValue(content)) {
        payload.content = content;
    }
    if (!isEmptyResultValue(thought) &&
        !isSameResultValue(thought, primaryResult) &&
        !isSameResultValue(thought, content)) {
        payload.thought = thought;
    }
    if (errorText) {
        payload.error = errorText;
    }
    return payload;
}
function formatResultPayload(value) {
    if (typeof value === "string") {
        return value;
    }
    try {
        return JSON.stringify(value, null, 2);
    }
    catch {
        return String(value);
    }
}
export function GoalToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const resultPayload = buildGoalResultPayload(toolCall, context.errorText);
    const resultText = formatResultPayload(resultPayload);
    const goalLabel = intl.formatMessage({ id: "chat.toolCall.goal.label" });
    const primaryText = useMemo(() => _jsx("span", { className: "min-w-0 truncate", children: toolCall.title ?? goalLabel }), [goalLabel, toolCall.title]);
    const handleLoadFullToolCallFields = context.onLoadFullToolCallFields;
    const renderContent = useCallback(() => (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "text-ui-base font-medium uppercase tracking-wide text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.result" }) }), _jsx("pre", { className: "max-h-60 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-surface px-3 py-3 font-mono text-ui-base text-foreground", children: resultText })] }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: handleLoadFullToolCallFields
                    ? () => handleLoadFullToolCallFields(toolCall.toolId)
                    : undefined })] })), [handleLoadFullToolCallFields, intl, resultText, toolCall.snapshotRefs, toolCall.toolId]);
    return (_jsx(_Fragment, { children: _jsx(ToolLayout, { toolId: toolCall.toolId, icon: GOAL_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: context.canToggle ?? true, forceOpen: context.forceOpen ?? false, kindLabel: goalLabel, sourceLabel: context.sourceLabel, primaryText: primaryText, secondaryText: toolCall.status === "failed" ? undefined : context.statusLabel, statusLabel: toolCall.status === "failed" ? context.statusLabel : undefined, statusTooltip: toolCall.status === "failed" ? context.errorText : undefined, showFailureStatus: toolCall.status === "failed", isRunning: context.isRunning, title: toolCall.title, renderContent: renderContent }) }));
}
//# sourceMappingURL=goal.js.map