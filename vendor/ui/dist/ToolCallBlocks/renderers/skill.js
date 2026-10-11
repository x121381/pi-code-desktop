import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { WandSparkles } from "lucide-react";
import { useCallback, useMemo } from "react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { ToolSnapshotFieldNotice } from "../../ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { ToolLayout } from "../ToolLayout.js";
const SKILL_TOOL_ICON = _jsx(WandSparkles, { className: "size-4 shrink-0 text-foreground-subtle" });
function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
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
function getSkillName(toolCall) {
    if (isPlainRecord(toolCall.input)) {
        const directSkill = readFirstStringField(toolCall.input, ["skill", "name"]);
        if (directSkill) {
            return directSkill;
        }
    }
    return undefined;
}
function getSkillArgs(toolCall) {
    if (typeof toolCall.input === "string") {
        const trimmed = toolCall.input.trim();
        return trimmed.length > 0 ? trimmed : undefined;
    }
    if (isPlainRecord(toolCall.input)) {
        return readFirstStringField(toolCall.input, ["args", "arg", "path", "prompt", "input"]);
    }
    return undefined;
}
function extractSkillText(value) {
    if (value == null) {
        return null;
    }
    if (typeof value === "string") {
        const trimmed = value.trim();
        return trimmed.length > 0 ? trimmed : null;
    }
    if (Array.isArray(value)) {
        const text = value
            .map((item) => extractSkillText(item))
            .filter((item) => item != null)
            .join("\n");
        return text.length > 0 ? text : null;
    }
    if (!isPlainRecord(value)) {
        return null;
    }
    const directText = readFirstStringField(value, [
        "output",
        "text",
        "content",
        "message",
        "rawOutput",
        "result",
    ]);
    if (directText) {
        return directText;
    }
    if (Array.isArray(value.content)) {
        const contentText = value.content
            .map((item) => {
            if (!isPlainRecord(item)) {
                return extractSkillText(item);
            }
            return extractSkillText(item.content ?? item);
        })
            .filter((item) => item != null)
            .join("\n");
        return contentText.length > 0 ? contentText : null;
    }
    return null;
}
export function SkillToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall } = context.toolCallNode;
    const skillName = getSkillName(toolCall);
    const skillArgs = getSkillArgs(toolCall);
    const outputText = extractSkillText(toolCall.output);
    const rawOutputText = isPlainRecord(toolCall.raw)
        ? extractSkillText(toolCall.raw.rawOutput)
        : null;
    const detailText = toolCall.status === "failed"
        ? (context.errorText ?? outputText ?? rawOutputText ?? undefined)
        : (outputText ?? rawOutputText ?? undefined);
    const skillFallbackLabel = intl.formatMessage({ id: "chat.toolCall.skill.label" });
    const skillUnknownLabel = intl.formatMessage({ id: "chat.toolCall.skill.unknown" });
    const skillArgsLabel = intl.formatMessage({ id: "chat.toolCall.skill.args" });
    const skillNoOutputLabel = intl.formatMessage({ id: "chat.toolCall.skill.noOutput" });
    const primaryText = useMemo(() => (_jsx("span", { className: "truncate font-mono text-foreground-subtlest", children: skillName ?? toolCall.title ?? skillFallbackLabel })), [skillFallbackLabel, skillName, toolCall.title]);
    const secondaryText = useMemo(() => (skillArgs ? _jsx("code", { className: "truncate font-mono", children: skillArgs }) : null), [skillArgs]);
    const renderContent = useCallback(() => (_jsxs("div", { className: "space-y-3 mb-2 rounded-xl border border-border bg-panel px-4 py-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-ui-base text-foreground", children: [_jsx("span", { className: "text-foreground-subtle", children: skillFallbackLabel }), _jsx("code", { className: "rounded-md bg-surface px-2 py-1 font-mono text-ui-base text-foreground", children: skillName ?? toolCall.title ?? skillUnknownLabel })] }), skillArgs ? (_jsxs("div", { className: "flex items-start gap-2 font-mono text-ui-base text-foreground", children: [_jsx("span", { className: "shrink-0 text-foreground-subtle", children: skillArgsLabel }), _jsx("pre", { className: "min-w-0 flex-1 whitespace-pre-wrap break-words text-foreground-subtle", children: skillArgs })] })) : null] }), detailText ? (_jsx("div", { className: "space-y-1", children: _jsx("pre", { className: "max-h-25 overflow-auto whitespace-pre-wrap break-words font-mono text-ui-base text-foreground-subtle", children: detailText }) })) : (!context.isRunning && (_jsx("div", { className: "space-y-1", children: _jsx("p", { className: "font-mono text-ui-base text-foreground-subtle", children: skillNoOutputLabel }) })))] })), [
        context.isRunning,
        detailText,
        skillArgs,
        skillArgsLabel,
        skillFallbackLabel,
        skillName,
        skillNoOutputLabel,
        skillUnknownLabel,
        toolCall.title,
    ]);
    return (_jsxs(_Fragment, { children: [_jsx(ToolLayout, { toolId: toolCall.toolId, icon: SKILL_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: context.canToggle ?? true, forceOpen: context.forceOpen ?? false, hideSecondaryTextWhenOpen: true, kindLabel: context.kindLabelOverride ??
                    intl.formatMessage({
                        id: context.isRunning ? "chat.toolCall.skill.running" : "chat.toolCall.kind.skill",
                    }), sourceLabel: context.sourceLabel, primaryText: primaryText, secondaryText: secondaryText, statusLabel: context.statusLabel, statusTooltip: toolCall.status === "failed" ? detailText : undefined, showFailureStatus: toolCall.status === "failed", isRunning: context.isRunning, title: toolCall.title, renderContent: renderContent }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: context.onLoadFullToolCallFields
                    ? () => context.onLoadFullToolCallFields?.(toolCall.toolId)
                    : undefined })] }));
}
//# sourceMappingURL=skill.js.map