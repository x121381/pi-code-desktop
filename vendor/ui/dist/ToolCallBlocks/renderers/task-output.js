import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FileOutputIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
import { readToolResultDisplay } from "@/ToolCallBlocks/toolResultDisplay.js";
const TASK_OUTPUT_TOOL_ICON = _jsx(FileOutputIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
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
function readTaskId(input) {
    const taskId = toRecord(input)?.task_id;
    return typeof taskId === "string" && taskId.trim().length > 0 ? taskId : undefined;
}
function isFailedTaskStatus(status) {
    const normalized = status?.trim().toLowerCase();
    return normalized === "failed" || normalized === "lost";
}
function isStoppedTaskStatus(status) {
    const normalized = status?.trim().toLowerCase();
    return normalized === "cancelled" || normalized === "killed" || normalized === "stopped";
}
export function TaskOutputToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const display = readToolResultDisplay(toolCall.raw);
    const taskOutputDisplay = display?.kind === "task_output" ? display : undefined;
    const taskId = readTaskId(toolCall.input);
    const taskStatus = taskOutputDisplay?.taskStatus;
    const normalizedTaskStatus = taskStatus?.trim().toLowerCase();
    const isDenied = toolCall.status === "denied";
    const isStopped = toolCall.status === "stopped";
    const isExecutionFailed = toolCall.status === "failed";
    const isTaskFailed = isFailedTaskStatus(taskStatus);
    const showFailureStatus = !isDenied && !isStopped && (isExecutionFailed || isTaskFailed);
    const output = taskOutputDisplay?.output;
    const hasOutput = output !== undefined;
    let outcomeLabel;
    if (isExecutionFailed) {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.status.failed" });
    }
    else if (isDenied) {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.status.denied" });
    }
    else if (isStopped) {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.status.stopped" });
    }
    else if (taskOutputDisplay?.retrievalStatus === "not_ready") {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.running" });
    }
    else if (taskOutputDisplay?.retrievalStatus === "timeout") {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.timeout" });
    }
    else if (isTaskFailed) {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.taskFailed" });
    }
    else if (isStoppedTaskStatus(taskStatus)) {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.taskStopped" });
    }
    else if (normalizedTaskStatus === "pending" || normalizedTaskStatus === "running") {
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.running" });
    }
    else if (normalizedTaskStatus && normalizedTaskStatus !== "completed") {
        outcomeLabel = taskStatus ?? normalizedTaskStatus;
    }
    else if (taskOutputDisplay?.retrievalStatus === "success") {
        // 类别标签只能说明这是 TaskOutput，不能替代 display 已确认的成功读取结果。
        outcomeLabel = intl.formatMessage({ id: "chat.toolCall.taskOutput.retrieved" });
    }
    const kindLabel = intl.formatMessage({
        id: context.isRunning ? "chat.toolCall.taskOutput.fetching" : "chat.toolCall.kind.taskOutput",
    });
    const primaryText = useMemo(() => (_jsx("code", { className: "min-w-0 truncate font-mono", children: taskId ?? toolCall.title ?? "TaskOutput" })), [taskId, toolCall.title]);
    const renderContent = useCallback(() => (_jsxs("div", { className: "rounded-lg border border-border bg-panel px-4 py-3", children: [_jsx("pre", { className: "max-h-25 overflow-auto whitespace-pre-wrap break-words font-mono text-ui-base text-foreground-subtle", children: output }), taskOutputDisplay?.truncated === true ? (_jsx("p", { className: "mt-3 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.taskOutput.truncated" }) })) : null] })), [intl, output, taskOutputDisplay?.truncated]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: TASK_OUTPUT_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: hasOutput && (context.canToggle ?? true), forceOpen: hasOutput && (context.forceOpen ?? false), kindLabel: kindLabel, sourceLabel: context.sourceLabel, primaryText: primaryText, statusLabel: outcomeLabel, showStatusLabel: outcomeLabel != null, statusTooltip: isExecutionFailed ? context.errorText : undefined, showFailureStatus: showFailureStatus, isRunning: context.isRunning, title: toolCall.title, renderContent: hasOutput ? renderContent : undefined }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=task-output.js.map