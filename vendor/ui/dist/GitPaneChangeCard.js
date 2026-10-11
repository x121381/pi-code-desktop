import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { ChevronDownIcon, CopyIcon, FolderOpenIcon, ListTreeIcon } from "lucide-react";
import { DiffViewer } from "./components/ui/diff-viewer.js";
import { cn } from "./components/lib/utils.js";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, } from "./components/ui/context-menu.js";
import { getDiffFallbackMessageId, getGitPaneDiffPreviewPlan } from "./GitPane/helpers.js";
import { FileDisplayInline } from "./lib/fileDisplay.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { LightweightDiffPreview } from "./components/ui/lightweight-diff-preview.js";
export function GitPaneChangeCard({ change, contextMenuLabels, diffState, isDiffLoading, isExpanded, canRevealInFileManager, codePreviewSettings, resolvedTheme, onCopyAbsolutePath, onCopyRelativePath, onOpenChange, onRevealInFileManager, onRevealInFileTree, }) {
    const { intl } = useZCodeIntl();
    const diffPreviewPlan = useMemo(() => getGitPaneDiffPreviewPlan(diffState), [diffState]);
    const multiFileDiffFiles = useMemo(() => {
        if (diffState?.availability !== "patch" || diffState.afterContent === null) {
            return null;
        }
        // DiffViewer 是 memo 组件，oldFile/newFile 如果在 JSX 里内联创建，
        // 父级任意刷新都会让大 diff 视图浅比较失效。
        return {
            oldFile: {
                name: change.workspaceRelativePath,
                contents: diffState.beforeContent ?? "",
                cacheKey: `old:${diffState.path}:${diffState.beforeContent?.length ?? 0}:${diffState.beforeContent?.slice(0, 100) ?? ""}:${diffState.beforeContent?.slice(-100) ?? ""}`,
            },
            newFile: {
                name: change.workspaceRelativePath,
                contents: diffState.afterContent,
                cacheKey: `new:${diffState.path}:${diffState.afterContent.length}:${diffState.afterContent.slice(0, 100)}:${diffState.afterContent.slice(-100)}`,
            },
        };
    }, [
        change.workspaceRelativePath,
        diffState?.afterContent,
        diffState?.availability,
        diffState?.beforeContent,
        diffState?.path,
    ]);
    return (_jsxs("div", { className: "w-full min-w-0", children: [_jsxs(ContextMenu, { children: [_jsx(ContextMenuTrigger, { asChild: true, children: _jsxs("button", { type: "button", "aria-expanded": isExpanded, className: cn("sticky top-0 z-10 flex h-8 w-full items-center gap-3 bg-background px-3 text-left transition-colors hover:bg-surface-hover supports-[backdrop-filter]:backdrop-blur-sm", isExpanded && "bg-surface-hover"), onClick: () => onOpenChange(change, !isExpanded), children: [_jsx("div", { className: "min-w-0 flex-1 overflow-hidden", children: _jsx("div", { className: "flex min-w-0 items-center gap-2 overflow-hidden", children: _jsx(FileDisplayInline, { path: change.workspaceRelativePath, options: {
                                                showFilePath: true,
                                                className: "inline-flex min-w-0 max-w-full items-center gap-2",
                                                fileNameClassName: "truncate text-ui-base text-foreground",
                                                filePathClassName: "truncate text-ui-base text-foreground-subtlest",
                                            } }) }) }), _jsxs("div", { className: "flex shrink-0 items-center justify-end gap-3 pl-3", children: [_jsxs("div", { className: "shrink-0 whitespace-nowrap text-ui-base", children: [_jsxs("span", { className: "text-diff-added", children: ["+", change.added] }), _jsxs("span", { className: "ml-2 text-diff-removed", children: ["-", change.removed] })] }), _jsx(ChevronDownIcon, { className: cn("size-4 shrink-0 text-foreground-subtle transition-transform", isExpanded && "rotate-180") })] })] }) }), _jsxs(ContextMenuContent, { className: "w-56", children: [_jsxs(ContextMenuItem, { disabled: !canRevealInFileManager, onSelect: () => onRevealInFileManager(change), children: [_jsx(FolderOpenIcon, { className: "size-4" }), contextMenuLabels.revealInFileManager] }), _jsxs(ContextMenuItem, { onSelect: () => onCopyAbsolutePath(change), children: [_jsx(CopyIcon, { className: "size-4" }), contextMenuLabels.copyAbsolutePath] }), _jsxs(ContextMenuItem, { onSelect: () => onCopyRelativePath(change), children: [_jsx(CopyIcon, { className: "size-4" }), contextMenuLabels.copyRelativePath] }), _jsx(ContextMenuSeparator, {}), _jsxs(ContextMenuItem, { disabled: !onRevealInFileTree, onSelect: () => onRevealInFileTree?.(change), children: [_jsx(ListTreeIcon, { className: "size-4" }), contextMenuLabels.revealInFileTree] })] })] }), isExpanded ? (_jsx("div", { className: "w-full min-w-0 overflow-x-auto overflow-y-hidden bg-background", children: isDiffLoading ? (_jsx("div", { className: "flex items-center justify-center py-4 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "common.loading" }) })) : diffState?.availability === "patch" && diffPreviewPlan.kind === "plain-text" ? (_jsx("div", { className: "w-full min-w-0", children: _jsx(GitPanePlainTextDiffPreview, { lines: diffPreviewPlan.lines, codePreviewSettings: codePreviewSettings }) })) : diffState?.availability === "patch" &&
                    diffPreviewPlan.kind === "patch" &&
                    diffState.patch ? (_jsx("div", { className: "w-full min-w-0", children: _jsx(DiffViewer, { patch: diffState.patch, diffClassName: "block", fontSizePx: codePreviewSettings.fontSizePx, lightTheme: codePreviewSettings.lightTheme, darkTheme: codePreviewSettings.darkTheme, themeType: resolvedTheme }) })) : diffState?.availability === "patch" &&
                    diffState.afterContent !== null &&
                    multiFileDiffFiles ? (_jsx("div", { className: "w-full min-w-0", children: _jsx(DiffViewer, { oldFile: multiFileDiffFiles.oldFile, newFile: multiFileDiffFiles.newFile, diffClassName: "block", fontSizePx: codePreviewSettings.fontSizePx, lightTheme: codePreviewSettings.lightTheme, darkTheme: codePreviewSettings.darkTheme, themeType: resolvedTheme }) })) : (_jsx("div", { className: "px-4 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                        id: getDiffFallbackMessageId(diffState?.availability ?? "unavailable"),
                    }) })) })) : null] }));
}
function GitPanePlainTextDiffPreview({ lines, codePreviewSettings, }) {
    // 超大 patch 或深 hunk 进入富 diff 渲染会把主线程耗在同步解析/DOM 构建上。
    // 轻量 hunk 预览复用共享 diff 行号/gutter 样式，避免和右侧 DiffViewer 视觉分叉。
    return (_jsx(LightweightDiffPreview, { codePreviewSettings: codePreviewSettings, "data-git-plain-text-diff-preview": true, lines: lines }));
}
//# sourceMappingURL=GitPaneChangeCard.js.map