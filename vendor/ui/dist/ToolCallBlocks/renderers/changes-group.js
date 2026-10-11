import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { PencilIcon } from "lucide-react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { getFileDisplayPath } from "../../lib/fileDisplay.js";
import { ToolCallBlock } from "../../ToolCallBlocks.js";
import { ToolLayout } from "../../ToolCallBlocks/ToolLayout.js";
import { buildEditCodeViewerSource } from "../../ToolCallBlocks/renderers/edit.js";
import { readRawToolCallFileSummaries, } from "../../ToolCallBlocks/shared.js";
import { getEditKindLabelMessageId, renderDiffCount, renderFileChip, renderFilePath, } from "../../ToolCallBlocks/renderers.js";
const CHANGES_GROUP_ICON = _jsx(PencilIcon, { className: "size-4 shrink-0 text-foreground-subtle" });
const FILE_CHIP_GAP_PX = 8;
const FILE_CHIP_TRAILING_SPACE_PX = 24;
export function resolveFileChipAvailableWidth({ boundaryRight, listLeft, trailingWidth, }) {
    return Math.max(0, boundaryRight - listLeft - trailingWidth);
}
export function resolveResponsiveFileChipCount({ availableWidth, chipWidths, overflowWidth, gap, }) {
    if (chipWidths.length === 0)
        return 0;
    // 零可用宽度表示当前一枚 chip 都放不下，不能误解为无需裁剪。
    // 返回 0 才会保留完整的 +N 提示，避免窄屏只露出被截断的文件名。
    if (availableWidth <= 0)
        return 0;
    const allChipsWidth = chipWidths.reduce((total, width) => total + width, 0) +
        gap * Math.max(0, chipWidths.length - 1);
    if (allChipsWidth <= availableWidth)
        return chipWidths.length;
    let visibleWidth = 0;
    let visibleCount = 0;
    for (const chipWidth of chipWidths) {
        const nextCount = visibleCount + 1;
        const nextVisibleWidth = visibleWidth + chipWidth;
        // 仍有隐藏项时，布局包含 visible chips、+N 和两者之间的所有 gap。
        const requiredWidth = nextVisibleWidth + gap * nextCount + overflowWidth;
        if (requiredWidth > availableWidth)
            break;
        visibleWidth = nextVisibleWidth;
        visibleCount = nextCount;
    }
    return visibleCount;
}
function ResponsiveFileChipList({ files, workspacePath, onOpenCodeViewer, }) {
    const containerRef = useRef(null);
    const chipRefs = useRef([]);
    const overflowMeasureRef = useRef(null);
    const [visibleCount, setVisibleCount] = useState(files.length);
    useLayoutEffect(() => {
        const container = containerRef.current;
        if (!container)
            return;
        const boundary = container.closest("[data-tool-call-id]");
        const updateVisibleCount = () => {
            // summary 是 shrink-to-content，按自身宽度测量会在隐藏 chip 后继续收缩。
            // 以整行 ToolCall 的右边界计算，才能稳定得到当前真正可用的空间。
            const containerRect = container.getBoundingClientRect();
            const boundaryRight = boundary?.getBoundingClientRect().right ?? containerRect.right;
            const nextVisibleCount = resolveResponsiveFileChipCount({
                availableWidth: resolveFileChipAvailableWidth({
                    boundaryRight,
                    listLeft: containerRect.left,
                    trailingWidth: FILE_CHIP_TRAILING_SPACE_PX,
                }),
                chipWidths: files.map((_, index) => chipRefs.current[index]?.offsetWidth ?? 0),
                overflowWidth: overflowMeasureRef.current?.offsetWidth ?? 0,
                gap: FILE_CHIP_GAP_PX,
            });
            setVisibleCount((current) => (current === nextVisibleCount ? current : nextVisibleCount));
        };
        updateVisibleCount();
        if (typeof ResizeObserver === "undefined")
            return;
        const observer = new ResizeObserver(updateVisibleCount);
        observer.observe(boundary ?? container);
        window.addEventListener("resize", updateVisibleCount);
        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateVisibleCount);
        };
    }, [files]);
    const resolvedVisibleCount = Math.min(visibleCount, files.length);
    const hiddenCount = files.length - resolvedVisibleCount;
    return (_jsxs("span", { ref: containerRef, className: "relative inline-flex min-w-0 max-w-full flex-1 items-center gap-2 overflow-hidden", children: [files.map((summary, index) => {
                const isVisible = index < resolvedVisibleCount;
                return (_jsx("span", { ref: (element) => {
                        chipRefs.current[index] = element;
                    }, "aria-hidden": isVisible ? undefined : true, className: isVisible
                        ? "inline-flex min-w-0 shrink-0"
                        : "pointer-events-none invisible absolute inline-flex shrink-0", children: renderFileChip({
                        summary,
                        clickable: isVisible && Boolean(onOpenCodeViewer),
                        basePath: workspacePath,
                        onClick: () => onOpenCodeViewer?.(buildEditCodeViewerSource(summary)),
                    }) }, summary.path));
            }), hiddenCount > 0 ? _jsxs("span", { className: "shrink-0", children: ["+", hiddenCount] }) : null, _jsxs("span", { ref: overflowMeasureRef, "aria-hidden": "true", className: "pointer-events-none invisible absolute shrink-0", children: ["+", files.length] })] }));
}
export function ChangesGroupToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall, childToolCalls } = context.toolCallNode;
    const childSummaries = useMemo(() => childToolCalls.map((child) => ({
        child,
        summaries: readRawToolCallFileSummaries(child.toolCall.raw, child.toolCall),
    })), [childToolCalls]);
    const files = useMemo(() => {
        const unique = new Map();
        for (const entry of childSummaries) {
            for (const summary of entry.summaries) {
                const fileKey = getFileDisplayPath(summary.path, context.workspacePath).replaceAll("\\", "/");
                if (!unique.has(fileKey))
                    unique.set(fileKey, summary);
            }
        }
        return [...unique.values()];
    }, [childSummaries, context.workspacePath]);
    const latest = childSummaries.findLast((entry) => entry.summaries.length > 0);
    const latestFile = latest?.summaries.at(-1);
    const hasResolvedFiles = files.length > 0;
    const count = hasResolvedFiles ? files.length : childToolCalls.length;
    // Write/Edit 的流式 JSON 可能先到 content、后到 file_path。
    // 路径尚不可解析时按已进入分组的 tool 计数，避免悬空分隔符和误导性的 0 files。
    const countText = intl.formatMessage({
        id: hasResolvedFiles
            ? files.length === 1
                ? "chat.toolCall.changesGroup.file.one"
                : "chat.toolCall.changesGroup.file.other"
            : count === 1
                ? "chat.toolCall.changesGroup.tool.one"
                : "chat.toolCall.changesGroup.tool.other",
    }, { count: String(count) });
    const actionText = latest
        ? intl.formatMessage({
            id: getEditKindLabelMessageId(latest.summaries.map((summary) => summary.operationKind), latest.summaries.map((summary) => summary.actionLabel), true, latest.child.toolCall),
        })
        : null;
    const fileList = useMemo(() => (_jsx(ResponsiveFileChipList, { files: files, workspacePath: context.workspacePath, onOpenCodeViewer: context.onOpenCodeViewer })), [context.onOpenCodeViewer, context.workspacePath, files]);
    const completedSummary = useMemo(() => files.length === 1 ? (fileList) : (_jsxs("span", { className: "inline-flex min-w-0 max-w-full flex-1 items-center gap-2", children: [_jsx("span", { className: "shrink-0", children: countText }), files.length > 0 ? (_jsxs(_Fragment, { children: [_jsx("span", { children: "\u00B7" }), fileList] })) : null] })), [countText, fileList, files.length]);
    const runningPrimaryText = useMemo(() => _jsx("span", { className: "shrink-0", children: countText }), [countText]);
    const runningSecondaryText = useMemo(() => latestFile ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "shrink-0 text-foreground-subtlest", children: "\u00B7" }), actionText ? (_jsx("span", { className: "shrink-0 text-foreground-subtle", children: actionText })) : null, renderFileChip({
                summary: latestFile,
                basePath: context.workspacePath,
            }), renderFilePath(latestFile.filePath, context.workspacePath)] })) : undefined, [actionText, context.workspacePath, latestFile]);
    const runningDiffCount = useMemo(() => renderDiffCount(latestFile?.changeStat, { animateInitial: true }), [latestFile?.changeStat]);
    const renderContent = useCallback(() => (_jsx("div", { className: "ml-2 space-y-2 border-border border-l pl-3.5", children: childToolCalls.map((child) => (_jsx(ToolCallBlock, { toolCallNode: child, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showIcon: false, animateDiffCountOnMount: true, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain, onLoadFullToolCallFields: context.onLoadFullToolCallFields }, child.toolCall.toolId))) })), [
        childToolCalls,
        context.onOpenBrowserUrl,
        context.onOpenCodeViewer,
        context.onOpenFileLink,
        context.onOpenAutomationsMain,
        context.onLoadFullToolCallFields,
        context.theme,
        context.codePreviewSettings,
        context.workspacePath,
    ]);
    return (_jsx(ToolLayout, { toolId: toolCall.toolId, icon: CHANGES_GROUP_ICON, canToggle: !context.isOfficeMode && (context.canToggle ?? true), forceOpen: !context.isOfficeMode && (context.forceOpen ?? false), kindLabel: intl.formatMessage({ id: "chat.toolCall.changesGroup.label" }), primaryText: context.isRunning ? runningPrimaryText : completedSummary, secondaryText: context.isRunning ? runningSecondaryText : undefined, summaryContentSeparator: "\u00B7", expandedPrimaryText: countText, expandedSecondaryText: null, diffCount: !context.isOfficeMode && context.isRunning ? runningDiffCount : undefined, hideDiffCountWhenOpen: true, animateSummaryContent: context.isRunning, disableSummaryContentAnimation: context.disableSummaryContentAnimation, summaryContentKey: `changes:${toolCall.toolId}:${context.isRunning ? `${latest?.child.toolCall.toolId ?? "running"}:${actionText ?? "changing"}:${latestFile?.path ?? "file"}` : files.map((file) => file.path).join("|")}`, isRunning: context.isRunning, title: toolCall.title, renderContent: renderContent }));
}
//# sourceMappingURL=changes-group.js.map