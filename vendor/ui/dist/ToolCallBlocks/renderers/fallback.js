import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { WrenchIcon } from "lucide-react";
import { useCallback } from "react";
import { ToolCallBody } from "@/ToolCallBlocks/ToolCallBody.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { ToolLayout } from "../ToolLayout.js";
const FALLBACK_TOOL_ICON = _jsx(WrenchIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
export function FallbackToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCallNode, isRunning, statusLabel, errorText, childToolList, displayModel, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, } = context;
    const { toolCall } = toolCallNode;
    const kindLabel = toolCall.kind.length > 0
        ? toolCall.kind[0].toUpperCase() + toolCall.kind.slice(1)
        : toolCall.kind;
    const hasInlinePreview = displayModel.inlinePreview.type !== "none";
    const handleLoadFullToolCallFields = context.onLoadFullToolCallFields;
    const renderContent = useCallback(() => (_jsxs(_Fragment, { children: [_jsx(ToolCallBody, { childToolList: childToolList, displayModel: displayModel, toolCall: toolCall, workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenBrowserUrl: onOpenBrowserUrl }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: handleLoadFullToolCallFields
                    ? () => handleLoadFullToolCallFields(toolCall.toolId)
                    : undefined }), !hasInlinePreview && !context.hideRawFallback ? (_jsx("pre", { className: "px-4 py-3 rounded-xl bg-surface text-ui-xs mt-1 text-foreground-subtle max-h-50 overflow-auto", children: JSON.stringify(toolCall, null, 2) })) : null] })), [
        childToolList,
        codePreviewSettings,
        displayModel,
        handleLoadFullToolCallFields,
        hasInlinePreview,
        onOpenBrowserUrl,
        onOpenCodeViewer,
        onOpenFileLink,
        theme,
        toolCall,
        workspacePath,
    ]);
    return (_jsx(ToolLayout, { toolId: toolCall.toolId, icon: context.iconOverride ?? FALLBACK_TOOL_ICON, showIcon: context.showIcon !== false, canToggle: context.canToggle ?? true, forceOpen: context.forceOpen ?? false, kindLabel: context.summaryOnly ? null : (context.kindLabelOverride ?? kindLabel), sourceLabel: context.sourceLabel, primaryText: context.summaryOnly
            ? (context.summaryTextOverride ?? null)
            : (toolCall.title ?? intl.formatMessage({ id: "chat.toolCall.toolCall" })), secondaryText: context.summaryOnly || toolCall.status === "failed" ? undefined : statusLabel, statusLabel: toolCall.status === "failed" ? statusLabel : undefined, statusTooltip: toolCall.status === "failed" ? errorText : undefined, showFailureStatus: toolCall.status === "failed", isRunning: isRunning, title: context.summaryOnly && typeof context.summaryTextOverride === "string"
            ? context.summaryTextOverride
            : toolCall.title, renderContent: renderContent }));
}
//# sourceMappingURL=fallback.js.map