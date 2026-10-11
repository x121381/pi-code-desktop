import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Fragment } from "react";
import { cn } from "@/components/lib/utils.js";
import { Badge } from "@/components/ui/badge.js";
import { ContentPartView, EmptyState, summarizeRecords } from "@/ModelTrajectoryPaneDetails.js";
import { ExpandableTrajectoryMessage } from "@/ModelTrajectoryExpandableMessage.js";
import { ModelTrajectoryErrorBlock } from "@/ModelTrajectoryErrorBlock.js";
import { formatTrajectoryClockTime, formatTrajectoryDateTime, formatTrajectoryDuration, } from "@/ModelTrajectoryFormat.js";
import { trajectoryRoleTextClass } from "@/ModelTrajectoryRoleStyles.js";
import { TrajectorySectionTitle } from "@/ModelTrajectorySectionTitle.js";
export { EmptyState, summarizeRecords } from "@/ModelTrajectoryPaneDetails.js";
export function CallCard({ record, index, inputMessages, expansionKeyPrefix, intl, }) {
    const response = record.response;
    const usage = response?.usage;
    const hasInput = inputMessages.length > 0;
    return (_jsxs("article", { "data-trajectory-call": "", className: "col-span-full grid grid-cols-subgrid", children: [_jsxs("div", { "data-trajectory-call-summary": "", className: "sticky top-0 z-10 col-span-full flex w-full min-w-0 items-center gap-1.5 border-b border-border/50 bg-surface/90 px-3 py-2 text-left supports-[backdrop-filter]:backdrop-blur-sm", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center font-mono text-ui-xs text-foreground-subtlest", children: String(index + 1).padStart(2, "0") }), _jsxs("span", { className: "flex min-w-0 flex-1 items-center gap-1.5", children: [_jsx(SourceTitle, { record: record, intl: intl }), response?.finishReason ? (_jsx(Badge, { "data-trajectory-finish-pill": "", "data-trajectory-finish-reason": response.finishReason, variant: "outline", className: "h-5 shrink-0 rounded-full border-border bg-tag px-2 text-ui-xs text-foreground-subtle", children: finishReasonLabel(response.finishReason, intl) })) : null] }), _jsx(CallMetadata, { record: record, usage: usage })] }), _jsxs("div", { "data-trajectory-call-content": "", className: "col-span-full grid grid-cols-subgrid gap-y-2 p-2", children: [hasInput ? (_jsxs("section", { "data-trajectory-section": "", className: "col-span-full grid grid-cols-subgrid overflow-hidden rounded-lg border border-card-border", children: [_jsx(TrajectorySectionTitle, { kind: "input", label: intl.formatMessage({ id: "modelTrajectory.inputSection" }) }), inputMessages.map((message, messageIndex) => (_jsxs(Fragment, { children: [_jsx(TrajectoryRowDivider, {}), _jsx(MessageBlock, { message: message, callStartedAt: record.startedAt, callDurationMs: record.durationMs, isAlt: messageIndex % 2 === 1, expansionKey: expansionKeyPrefix ? `${expansionKeyPrefix}:input:${messageIndex}` : undefined, intl: intl })] }, `${index}:${messageIndex}`)))] })) : null, response ? (_jsx(ResponseBlock, { response: response, callStartedAt: record.startedAt, callDurationMs: record.durationMs, startRowIndex: inputMessages.length, expansionKeyPrefix: expansionKeyPrefix, intl: intl })) : null, record.error ? _jsx(ModelTrajectoryErrorBlock, { error: record.error }) : null] }), _jsx("div", { "data-trajectory-call-divider": "", className: "col-span-full h-px bg-border" })] }));
}
function SourceTitle({ record, intl }) {
    const callSource = record.callSource ?? {
        kind: "main",
    };
    const labelId = sourceLabelId(callSource);
    return (_jsx("span", { "data-trajectory-source-title": "", "data-trajectory-source-kind": callSource.kind, "data-trajectory-query-source": callSource.querySource, className: "min-w-0 shrink truncate text-ui-sm font-medium text-foreground", title: callSource.querySource ? `querySource: ${callSource.querySource}` : undefined, children: intl.formatMessage({ id: labelId }) }));
}
function sourceLabelId(callSource) {
    switch (callSource.querySource) {
        case "main_turn":
            return "modelTrajectory.source.main";
        case "session_title":
            return "modelTrajectory.source.sessionTitle";
        case "compact":
            return "modelTrajectory.source.compact";
        case "prompt_enhance":
            return "modelTrajectory.source.promptEnhance";
        case "target_completion_verification":
            return "modelTrajectory.source.targetCompletion";
        case "subagent":
            return "modelTrajectory.source.subagent";
        default:
            break;
    }
    switch (callSource.kind) {
        case "main":
            return "modelTrajectory.source.main";
        case "subagent":
            return "modelTrajectory.source.subagent";
        case "compact":
            return "modelTrajectory.source.compact";
        case "sidecar":
            return "modelTrajectory.source.sidecar";
        case "unknown":
            return "modelTrajectory.source.unknown";
    }
}
function MessageBlock({ message, callStartedAt, callDurationMs, isAlt, expansionKey, intl, }) {
    // 只有已知角色才有 i18n key，未知角色直接展示原始 role，避免触发缺失 key。
    const knownRole = ["system", "user", "assistant", "tool"].includes(message.role);
    const roleLabel = knownRole
        ? intl.formatMessage({ id: `modelTrajectory.role.${message.role}` })
        : message.role;
    if ((message.role === "system" || message.role === "user" || message.role === "tool") &&
        message.parts.length > 0) {
        return (_jsx(ExpandableTrajectoryMessage, { message: message, role: message.role, roleLabel: roleLabel, callDurationLabel: typeof callDurationMs === "number" ? formatTrajectoryDuration(callDurationMs) : "—", callDatetimeLabel: formatTrajectoryDateTime(callStartedAt), callDatetimeTitle: callStartedAt, isAlt: isAlt, expansionKey: expansionKey, intl: intl }));
    }
    return (_jsxs("div", { "data-trajectory-message-role": message.role, "data-trajectory-search-target-key": expansionKey, "data-trajectory-row-alt": isAlt || undefined, className: cn("col-span-full grid min-h-8 min-w-0 grid-cols-subgrid px-3", isAlt && "bg-surface/30"), children: [_jsx("span", { "data-trajectory-role-label": knownRole ? message.role : "unknown", className: cn("pr-1 pt-0.5 font-mono text-ui-sm uppercase", knownRole
                    ? trajectoryRoleTextClass(message.role === "tool"
                        ? "tool-result"
                        : message.role)
                    : "text-foreground-subtlest"), children: roleLabel }), _jsx("div", { "data-trajectory-search-field": "content", className: "col-span-2 flex min-w-0 flex-col gap-1.5", children: message.parts.length === 0 ? (_jsx("span", { className: "text-ui-sm text-foreground-subtlest", children: "\u2014" })) : (message.parts.map((part, partIndex) => (_jsx(ContentPartView, { part: part, intl: intl }, partIndex)))) })] }));
}
function ResponseBlock({ response, callStartedAt, callDurationMs, startRowIndex, expansionKeyPrefix, intl, }) {
    const hasContent = Boolean(response.text) || Boolean(response.reasoningText) || response.toolCalls.length > 0;
    if (!hasContent) {
        return null;
    }
    const rows = [];
    if (response.reasoningText) {
        rows.push({
            key: "reasoning",
            message: { role: "assistant", parts: [{ kind: "text", text: response.reasoningText }] },
            roleLabel: intl.formatMessage({ id: "modelTrajectory.reasoning" }),
            visualRole: "reasoning",
        });
    }
    if (response.text) {
        rows.push({
            key: "message",
            message: { role: "assistant", parts: [{ kind: "text", text: response.text }] },
            roleLabel: intl.formatMessage({ id: "modelTrajectory.role.assistant" }),
        });
    }
    response.toolCalls.forEach((toolCall, toolCallIndex) => {
        rows.push({
            key: `${toolCall.kind}:${toolCallIndex}`,
            message: { role: "assistant", parts: [toolCall] },
            roleLabel: intl.formatMessage({ id: "modelTrajectory.toolCall" }),
        });
    });
    return (_jsxs("section", { "data-trajectory-section": "", "data-trajectory-response-section": "", className: "col-span-full grid grid-cols-subgrid overflow-hidden rounded-lg border border-card-border", children: [_jsx(TrajectorySectionTitle, { kind: "output", label: intl.formatMessage({ id: "modelTrajectory.outputSection" }) }), rows.map((row, rowIndex) => (_jsxs(Fragment, { children: [_jsx(TrajectoryRowDivider, {}), _jsx(ResponseMessageRow, { message: row.message, roleLabel: row.roleLabel, visualRole: row.visualRole, callStartedAt: callStartedAt, callDurationMs: callDurationMs, isAlt: (startRowIndex + rowIndex) % 2 === 1, expansionKey: expansionKeyPrefix ? `${expansionKeyPrefix}:output:${row.key}` : undefined, intl: intl })] }, row.key)))] }));
}
function TrajectoryRowDivider() {
    return _jsx("div", { "data-trajectory-row-divider": "", className: "col-span-full h-px bg-border/50" });
}
function ResponseMessageRow({ message, roleLabel, visualRole, callStartedAt, callDurationMs, isAlt, expansionKey, intl, }) {
    return (_jsx(ExpandableTrajectoryMessage, { message: message, role: "assistant", visualRole: visualRole, roleLabel: roleLabel, callDurationLabel: typeof callDurationMs === "number" ? formatTrajectoryDuration(callDurationMs) : "—", callDatetimeLabel: formatTrajectoryDateTime(callStartedAt), callDatetimeTitle: callStartedAt, isAlt: isAlt, expansionKey: expansionKey, intl: intl }));
}
function CallMetadata({ record, usage, }) {
    const items = [];
    if (typeof usage?.inputTokens === "number") {
        items.push({ text: `IN ${usage.inputTokens.toLocaleString()}` });
    }
    if (typeof usage?.outputTokens === "number") {
        items.push({ text: `OUT ${usage.outputTokens.toLocaleString()}` });
    }
    if (typeof record.durationMs === "number") {
        items.push({ text: formatTrajectoryDuration(record.durationMs) });
    }
    items.push({ text: formatTrajectoryClockTime(record.startedAt), title: record.startedAt });
    return (_jsx("span", { "data-trajectory-call-metadata": "", className: "ml-auto flex shrink-0 items-center gap-1 font-mono text-ui-xs text-foreground-subtlest", children: items.map((item, index) => (_jsxs("span", { title: item.title, children: [index > 0 ? "· " : "", item.text] }, `${item.text}:${index}`))) }));
}
function finishReasonLabel(reason, intl) {
    switch (reason.toLowerCase().replaceAll("_", "-")) {
        case "stop":
            return intl.formatMessage({ id: "modelTrajectory.finish.stop" });
        case "tool-call":
        case "tool-calls":
            return intl.formatMessage({ id: "modelTrajectory.finish.toolCalls" });
        case "length":
            return intl.formatMessage({ id: "modelTrajectory.finish.length" });
        case "content-filter":
            return intl.formatMessage({ id: "modelTrajectory.finish.contentFilter" });
        default:
            return reason;
    }
}
//# sourceMappingURL=ModelTrajectoryPaneParts.js.map