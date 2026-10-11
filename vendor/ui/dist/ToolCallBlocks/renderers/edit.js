import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- Edit 工具块同时维护单文件、多文件子块和 diff 预览引用稳定性；当前变更先保持同文件收口，避免为行数拆分引入展示回归。 */
import { PencilIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { ToolCallBody } from "@/ToolCallBlocks/ToolCallBody.js";
import { ToolSnapshotFieldNotice } from "@/ToolCallBlocks/ToolSnapshotFieldNotice.js";
import { getFileDisplayPath } from "@/lib/fileDisplay.js";
import { ToolLayout } from "../ToolLayout.js";
import { EditInlineDiffContent } from "@/ToolCallBlocks/renderers/EditInlineDiffContent.js";
import { getEditKindLabelMessageId, renderDiffCount, renderFilePath, renderJoinedFileChips, renderFileChip, } from "../shared.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
const EDIT_TOOL_ICON = _jsx(PencilIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
const EDIT_SINGLE_LAYOUT = {
    canToggle: true,
    forceOpen: false,
};
const EDIT_CHILD_LAYOUT = {
    canToggle: true,
    forceOpen: false,
};
function isRawToolCallFailed(raw) {
    if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
        return false;
    }
    const { status } = raw;
    return typeof status === "string" && status === "failed";
}
export function buildEditCodeViewerSource(summary) {
    if (!summary.patch) {
        return {
            type: "file",
            title: summary.fileName,
            path: summary.path,
        };
    }
    return {
        type: "patch",
        title: summary.fileName,
        // summary.filePath 是 fileDisplay 生成的目录展示路径，不是可打开的文件路径。
        // 传给 side pane 后会按目录解析图标，导致 .ts/.tsx diff tab 退回通用文件图标。
        path: summary.path,
        patch: summary.patch,
    };
}
function buildEditInlinePreview(summary) {
    if (!summary?.patch) {
        return undefined;
    }
    // edit 摘要层已经能从 rawFileSummaries 拿到单文件 patch，
    // 但展开区之前只认 displayModel.inlinePreview，导致卡片自动展开后看不到 diff preview。
    // 这里把当前文件的 patch 直接转成 content 里的 diff 块，避免 ToolCallBody 再次抢走这份预览。
    const source = buildEditCodeViewerSource(summary);
    if (source.type !== "patch") {
        return undefined;
    }
    return {
        type: "patch",
        source,
    };
}
export function EditToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCallNode, rawFileSummaries, isRunning, statusLabel, errorText, onOpenCodeViewer } = context;
    const { toolCall } = toolCallNode;
    const hasMultipleFiles = rawFileSummaries.length > 1;
    const isFailed = toolCall.status === "failed" || isRawToolCallFailed(toolCall.raw) || Boolean(errorText);
    const effectiveStatusLabel = isFailed
        ? intl.formatMessage({ id: "chat.toolCall.status.failed" })
        : statusLabel;
    const openFilePreview = useCallback((summary) => {
        if (!onOpenCodeViewer) {
            return;
        }
        onOpenCodeViewer(buildEditCodeViewerSource(summary));
    }, [onOpenCodeViewer]);
    const primaryText = useMemo(() => rawFileSummaries.length > 0
        ? renderJoinedFileChips(rawFileSummaries, {
            clickable: Boolean(onOpenCodeViewer),
            basePath: context.workspacePath,
            onClick: openFilePreview,
        })
        : null, [context.workspacePath, onOpenCodeViewer, openFilePreview, rawFileSummaries]);
    const secondaryText = useMemo(() => rawFileSummaries.length === 1
        ? renderFilePath(rawFileSummaries[0]?.filePath, context.workspacePath)
        : undefined, [context.workspacePath, rawFileSummaries]);
    const totalChangeStat = useMemo(() => rawFileSummaries.reduce((acc, summary) => {
        if (!summary.changeStat) {
            return acc;
        }
        return {
            added: acc.added + summary.changeStat.added,
            removed: acc.removed + summary.changeStat.removed,
        };
    }, { added: 0, removed: 0 }), [rawFileSummaries]);
    const diffCount = useMemo(() => renderDiffCount(totalChangeStat, {
        animateInitial: context.animateDiffCountOnMount,
    }), [context.animateDiffCountOnMount, totalChangeStat]);
    const kindLabel = intl.formatMessage({
        id: getEditKindLabelMessageId(rawFileSummaries.map((summary) => summary.operationKind), rawFileSummaries.map((summary) => summary.actionLabel), isRunning, {
            kind: toolCall.kind,
            title: toolCall.title,
            input: toolCall.input,
            output: toolCall.output,
            raw: toolCall.raw,
        }),
    });
    const layoutConfig = hasMultipleFiles
        ? {
            canToggle: true,
            forceOpen: false,
            autoOpen: false,
        }
        : EDIT_SINGLE_LAYOUT;
    const expandedPrimaryText = useMemo(() => rawFileSummaries.length > 1 ? (_jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.edit.multipleFiles" }, { count: String(rawFileSummaries.length) }) })) : (primaryText), [intl, primaryText, rawFileSummaries.length]);
    const singleFileInlinePreview = buildEditInlinePreview(rawFileSummaries.length === 1 ? (rawFileSummaries[0] ?? null) : null);
    const handleLoadFullToolCallFields = context.onLoadFullToolCallFields;
    const renderContent = useCallback(() => rawFileSummaries.length === 0 ? (_jsxs(_Fragment, { children: [_jsx(ToolCallBody, { childToolList: null, displayModel: context.displayModel, toolCall: toolCall, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: handleLoadFullToolCallFields
                    ? () => handleLoadFullToolCallFields(toolCall.toolId)
                    : undefined })] })) : (_jsx(_Fragment, { children: hasMultipleFiles ? (_jsxs("div", { className: "ml-2 space-y-2 border-border border-l pl-3.5 border-border", children: [rawFileSummaries.map((summary, index) => (_jsx(EditFileSummaryBlock, { summary: summary, isRunning: isRunning, statusLabel: effectiveStatusLabel, errorText: errorText, toolId: `${toolCall.toolId}:${index}`, isFailed: isFailed, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, childToolList: null, displayModel: context.displayModel, toolCall: toolCall, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, animateDiffCountOnMount: context.animateDiffCountOnMount, showIcon: false, sourceLabel: context.sourceLabel }, `${summary.path}:${index}`))), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: handleLoadFullToolCallFields
                        ? () => handleLoadFullToolCallFields(toolCall.toolId)
                        : undefined })] })) : (_jsxs("div", { className: "space-y-3", children: [singleFileInlinePreview?.type === "patch" ? (_jsx(EditInlineDiffContent, { preview: singleFileInlinePreview.source, theme: context.theme, codePreviewSettings: context.codePreviewSettings })) : null, _jsx(ToolCallBody, { childToolList: context.childToolList, displayModel: context.displayModel, inlinePreviewOverride: singleFileInlinePreview?.type === "patch" ? { type: "none" } : undefined, toolCall: toolCall, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl }), _jsx(ToolSnapshotFieldNotice, { refs: toolCall.snapshotRefs ?? [], onLoadFullToolCallFields: handleLoadFullToolCallFields
                        ? () => handleLoadFullToolCallFields(toolCall.toolId)
                        : undefined })] })) })), [
        context.childToolList,
        context.codePreviewSettings,
        context.displayModel,
        context.onOpenBrowserUrl,
        context.onOpenCodeViewer,
        context.onOpenFileLink,
        context.sourceLabel,
        context.theme,
        context.workspacePath,
        effectiveStatusLabel,
        errorText,
        handleLoadFullToolCallFields,
        hasMultipleFiles,
        isFailed,
        isRunning,
        rawFileSummaries,
        singleFileInlinePreview,
        toolCall,
    ]);
    return (_jsx(_Fragment, { children: _jsx(ToolLayout, { toolId: toolCall.toolId, icon: EDIT_TOOL_ICON, showIcon: context.showIcon !== false, ...layoutConfig, canToggle: !context.isOfficeMode && layoutConfig.canToggle, forceOpen: !context.isOfficeMode && layoutConfig.forceOpen, kindLabel: context.kindLabelOverride ?? kindLabel, sourceLabel: context.sourceLabel, primaryText: primaryText, prioritizePrimaryText: true, expandedPrimaryText: expandedPrimaryText, secondaryText: secondaryText, diffCount: context.isOfficeMode ? undefined : diffCount, hideDiffCountWhenOpen: hasMultipleFiles, statusLabel: effectiveStatusLabel, statusTooltip: isFailed ? errorText : undefined, showFailureStatus: isFailed, isRunning: isRunning, title: toolCall.title, renderContent: renderContent }) }));
}
function EditFileSummaryBlock({ summary, isRunning, statusLabel, errorText, toolId, isFailed, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, childToolList, displayModel, toolCall, workspacePath, theme, codePreviewSettings, showIcon = true, sourceLabel, animateDiffCountOnMount = false, }) {
    const { intl } = useZCodeIntl();
    const kindLabel = intl.formatMessage({
        id: getEditKindLabelMessageId([summary.operationKind], [summary.actionLabel], isRunning),
    });
    const inlinePreviewOverride = buildEditInlinePreview(summary);
    const openFilePreview = useCallback(() => {
        if (!onOpenCodeViewer) {
            return;
        }
        onOpenCodeViewer(buildEditCodeViewerSource(summary));
    }, [onOpenCodeViewer, summary]);
    const primaryText = useMemo(() => renderFileChip({
        summary,
        clickable: Boolean(onOpenCodeViewer),
        basePath: workspacePath,
        onClick: openFilePreview,
    }), [onOpenCodeViewer, openFilePreview, summary, workspacePath]);
    const secondaryText = useMemo(() => renderFilePath(summary.filePath, workspacePath), [summary.filePath, workspacePath]);
    const diffCount = useMemo(() => renderDiffCount(summary.changeStat, {
        animateInitial: animateDiffCountOnMount,
    }), [animateDiffCountOnMount, summary.changeStat]);
    const title = useMemo(() => getFileDisplayPath(summary.filePath ?? summary.path, workspacePath), [summary.filePath, summary.path, workspacePath]);
    const renderContent = useCallback(() => (_jsxs("div", { className: "space-y-3", children: [inlinePreviewOverride?.type === "patch" ? (_jsx(EditInlineDiffContent, { preview: inlinePreviewOverride.source, theme: theme, codePreviewSettings: codePreviewSettings })) : null, _jsx(ToolCallBody, { childToolList: childToolList, displayModel: displayModel, inlinePreviewOverride: inlinePreviewOverride?.type === "patch" ? { type: "none" } : undefined, toolCall: toolCall, workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenBrowserUrl: onOpenBrowserUrl })] })), [
        childToolList,
        codePreviewSettings,
        displayModel,
        inlinePreviewOverride,
        onOpenBrowserUrl,
        onOpenCodeViewer,
        onOpenFileLink,
        theme,
        toolCall,
        workspacePath,
    ]);
    return (_jsx(_Fragment, { children: _jsx(ToolLayout, { toolId: toolId, icon: EDIT_TOOL_ICON, showIcon: showIcon !== false, ...EDIT_CHILD_LAYOUT, kindLabel: kindLabel, sourceLabel: sourceLabel, primaryText: primaryText, prioritizePrimaryText: true, secondaryText: secondaryText, diffCount: diffCount, statusLabel: statusLabel, statusTooltip: isFailed ? errorText : undefined, showFailureStatus: isFailed, isRunning: isRunning, title: title, renderContent: renderContent }) }));
}
//# sourceMappingURL=edit.js.map