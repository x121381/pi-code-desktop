import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronRightIcon, Loader2Icon, Undo2Icon } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "../components/ui/collapsible.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { FileDisplayInline } from "../lib/fileDisplay.js";
import { toWorkspaceRelativePath } from "../lib/taskChangeSummary.js";
import { buildChangeSummaryFilePreviewSource } from "../messageChangeSummaryPreview.js";
import { OpenSplitButton } from "../OpenSplitButton.js";
import { logger } from "../logger.js";
import { collectGenUiSourcePaths, matchesGenUiSourcePath } from "../gen-ui/contract.js";
import { ConversationFileRewindDialog } from "../v4/ConversationFileRewindDialog.js";
function formatPatch(path, patches) {
    if (patches.length === 0)
        return "";
    const lines = [`--- a/${path}`, `+++ b/${path}`];
    for (const patch of patches) {
        lines.push(`@@ -${patch.oldStart},${patch.oldLines} +${patch.newStart},${patch.newLines} @@`, ...patch.lines);
    }
    return lines.join("\n");
}
function openDiff(item, context) {
    const patch = formatPatch(item.path, item.patches);
    const { workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenCodeViewer } = context;
    if (!patch || !onOpenCodeViewer)
        return;
    const relativePath = toWorkspaceRelativePath(workspacePath, item.path);
    onOpenCodeViewer({
        type: "patch",
        title: relativePath,
        path: item.path,
        patch,
        workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}),
    });
}
export function ConversationFileSummaryPanel({ header, context, assistantText = "", }) {
    const { intl } = useZCodeIntl();
    const genUiSources = useMemo(() => collectGenUiSourcePaths(assistantText), [assistantText]);
    const filtersSources = genUiSources.length > 0;
    const [open, setOpen] = useState(false);
    const [loadedDetails, setLoadedDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState(null);
    const cachePolicy = header.state === "running" ? "in-flight" : "terminal";
    const fileChangesState = header.fileChanges?.state;
    // header 只有聚合值。按当前投影读取明细后过滤，不能把源文件行数从普通文件中猜着扣除。
    const requestKey = JSON.stringify([
        context.workspaceIdentity?.trim() || context.workspacePath,
        context.workspaceRemoteSessionId,
        context.sessionId,
        header.rowId,
        header.entityId,
        cachePolicy,
        header.fileChanges,
    ]);
    const settled = loadedDetails?.key === requestKey;
    const details = settled ? loadedDetails.result : null;
    const items = useMemo(() => details?.items.filter((item) => !matchesGenUiSourcePath(item.path, genUiSources)) ?? [], [details, genUiSources]);
    const summary = details && items.length !== details.items.length && header.fileChanges
        ? {
            ...header.fileChanges,
            files: items.length,
            additions: items.reduce((sum, item) => sum + (item.additions ?? 0), 0),
            deletions: items.reduce((sum, item) => sum + (item.deletions ?? 0), 0),
        }
        : header.fileChanges;
    const filesChangedLabel = intl.formatMessage({
        id: summary?.files === 1
            ? "chat.changeSummary.filesChanged.one"
            : "chat.changeSummary.filesChanged.other",
    }, { count: String(summary?.files ?? 0) });
    const isReverted = summary?.state === "reverted";
    const canUndo = Boolean(context.applyFileRewind && context.previewFileRewind) &&
        header.actions?.canRewindFiles === true &&
        !isReverted;
    const target = useMemo(() => (header.entityId ? { rowId: header.rowId, entityId: header.entityId } : null), [header.entityId, header.rowId]);
    const needsDetails = open || filtersSources;
    useEffect(() => {
        if (!needsDetails || !context.fetchFileChanges || !target)
            return;
        let disposed = false;
        // 运行中的 fileChanges 是某个 projection revision 的局部结果；turn
        // 进入终态后必须废弃局部 details，并用可持久缓存的终态策略重新读取。
        // requestKey 已同步隔离旧结果；同一摘要展开重读时保留已加载内容，避免卸载按钮丢失焦点。
        setLoadingDetails(true);
        void context
            .fetchFileChanges(target, {
            cachePolicy,
            fileChangesState,
        })
            .then((result) => {
            if (disposed)
                return;
            setLoadedDetails({ key: requestKey, result });
            setLoadingDetails(false);
        }, (loadError) => {
            if (disposed)
                return;
            logger.warn("[ConversationFileSummaryPanel] 读取文件变更详情失败", {
                error: loadError instanceof Error ? loadError.message : String(loadError),
                rowId: target.rowId,
            });
            setLoadedDetails({ key: requestKey, result: null });
            setLoadingDetails(false);
        });
        return () => {
            disposed = true;
        };
    }, [
        cachePolicy,
        context.fetchFileChanges,
        fileChangesState,
        needsDetails,
        open,
        requestKey,
        target,
    ]);
    const handlePreviewRewind = useCallback(async () => {
        if (!context.previewFileRewind || !target)
            return;
        setDialogOpen(true);
        setPreviewLoading(true);
        setError(null);
        try {
            setPreview(await context.previewFileRewind(target));
        }
        catch {
            setError(intl.formatMessage({ id: "chat.changeSummary.rewindDialog.error" }));
        }
        finally {
            setPreviewLoading(false);
        }
    }, [context, intl, target]);
    const handleApply = useCallback(async () => {
        if (!context.applyFileRewind || !preview?.canApply || !target)
            return;
        setApplying(true);
        setError(null);
        try {
            const ack = await context.applyFileRewind(target);
            if (ack.status === "accepted" || ack.status === "duplicate") {
                setDialogOpen(false);
            }
            else {
                setError(ack.message ?? intl.formatMessage({ id: "chat.changeSummary.rewindDialog.error" }));
            }
        }
        catch {
            setError(intl.formatMessage({ id: "chat.changeSummary.rewindDialog.error" }));
        }
        finally {
            setApplying(false);
        }
    }, [context, intl, preview?.canApply, target]);
    useEffect(() => {
        if (!details ||
            !header.fileChanges ||
            header.fileChanges.files <= 0 ||
            details.items.length > 0) {
            return;
        }
        logger.warn("[ConversationFileSummaryPanel] 文件摘要详情为空", {
            expectedFiles: header.fileChanges.files,
            rowId: header.rowId,
            turnId: header.turnId,
        });
    }, [details, header.rowId, header.turnId, header.fileChanges]);
    // 在明细到达前不闪现源文件的聚合统计；读取失败后恢复原摘要，仍可展开重试。
    if (filtersSources && context.fetchFileChanges && target && !settled)
        return null;
    if (!summary || summary.files <= 0)
        return null;
    return (_jsxs(_Fragment, { children: [_jsxs(Collapsible, { open: open, onOpenChange: setOpen, className: "overflow-hidden rounded-xl border border-border bg-card shadow-none", children: [_jsxs("div", { className: "flex h-10 items-center justify-between gap-3 px-2 transition-colors hover:bg-hover", children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", className: "flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-left text-ui-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", "aria-label": intl.formatMessage({
                                        id: open ? "chat.changeSummary.collapse" : "chat.changeSummary.expand",
                                    }), children: [_jsx(ChevronRightIcon, { "aria-hidden": true, className: cn("size-3.5 shrink-0 text-foreground-subtlest transition-transform", open ? "rotate-90" : "rotate-0") }), _jsx("span", { className: "min-w-0 truncate font-medium", children: filesChangedLabel }), _jsxs("span", { className: "shrink-0 tabular-nums", children: [_jsxs("span", { className: "text-diff-added", children: ["+", summary.additions] }), " ", _jsxs("span", { className: "text-diff-removed", children: ["-", summary.deletions] })] }), isReverted ? (_jsx("span", { className: "shrink-0 rounded-sm bg-input px-1.5 py-0.5 text-ui-xs text-foreground-subtle", children: intl.formatMessage({ id: "chat.changeSummary.reverted" }) })) : null] }) }), _jsxs(Button, { type: "button", variant: "ghost", size: "sm", disabled: !canUndo || previewLoading || applying, onClick: handlePreviewRewind, title: intl.formatMessage({ id: "chat.changeSummary.rewind" }), children: [previewLoading || applying ? _jsx(Loader2Icon, { className: "animate-spin" }) : _jsx(Undo2Icon, {}), _jsx("span", { children: intl.formatMessage({ id: "chat.changeSummary.rewind" }) })] })] }), _jsx(CollapsibleContent, { children: _jsx("div", { className: "grid w-full border-t border-border", children: loadingDetails ? (_jsxs("div", { className: "flex h-8 items-center gap-2 px-2 text-ui-base text-foreground-subtle", children: [_jsx(Loader2Icon, { className: "size-3.5 animate-spin" }), intl.formatMessage({
                                        id: "chat.changeSummary.rewindDialog.loading",
                                    })] })) : details && items.length === 0 ? (_jsx("div", { className: "px-2 py-1.5 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                    id: "chat.changeSummary.diffUnavailable",
                                }) })) : (items.map((item) => {
                                const relativePath = toWorkspaceRelativePath(context.workspacePath, item.path);
                                const canReview = item.patches.length > 0 && Boolean(context.onOpenCodeViewer);
                                const filePreviewSource = buildChangeSummaryFilePreviewSource({
                                    path: item.path,
                                    relativePath,
                                    workspacePath: context.workspacePath,
                                    workspaceIdentity: context.workspaceIdentity,
                                    workspaceRemoteSessionId: context.workspaceRemoteSessionId,
                                });
                                return (_jsx("div", { className: "w-full bg-background/50 overflow-hidden", children: _jsxs("div", { "aria-disabled": !canReview, className: cn("flex w-full items-center gap-1 px-2 py-2 text-left transition-colors", canReview ? "cursor-pointer hover:bg-hover/30" : "cursor-default"), onClick: () => openDiff(item, context), onKeyDown: (event) => {
                                            if (event.key !== "Enter" && event.key !== " ")
                                                return;
                                            event.preventDefault();
                                            openDiff(item, context);
                                        }, role: "button", tabIndex: canReview ? 0 : -1, title: item.path, children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [_jsx("div", { className: "min-w-0 flex items-center", children: _jsx(FileDisplayInline, { path: item.path, options: {
                                                                basePath: context.workspacePath,
                                                                showFilePath: true,
                                                                className: "inline-flex min-w-0 max-w-full items-center gap-1.5",
                                                                fileNameClassName: "truncate text-ui-base font-medium text-foreground",
                                                                filePathClassName: "truncate text-ui-base text-foreground-subtlest",
                                                            } }) }), _jsxs("span", { className: "flex shrink-0 items-center gap-2 tabular-nums text-ui-base", children: [item.additions > 0 ? (_jsxs("span", { className: "text-diff-added", children: ["+", item.additions] })) : null, item.deletions > 0 ? (_jsxs("span", { className: "text-diff-removed", children: ["-", item.deletions] })) : null] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [_jsx(Button, { type: "button", variant: "outline", size: "default", "aria-label": intl.formatMessage({
                                                            id: "chat.changeSummary.review",
                                                        }), title: intl.formatMessage({
                                                            id: "chat.changeSummary.review",
                                                        }), disabled: !canReview, className: "h-7 gap-1.5 rounded-lg bg-input px-2 text-ui-base", onClick: (event) => {
                                                            event.stopPropagation();
                                                            openDiff(item, context);
                                                        }, onPointerDown: (event) => event.stopPropagation(), children: _jsx("span", { children: intl.formatMessage({
                                                                id: "chat.changeSummary.review",
                                                            }) }) }), _jsx(OpenSplitButton, { target: {
                                                            type: "file",
                                                            path: item.path,
                                                            title: relativePath,
                                                            label: relativePath,
                                                            previewSource: filePreviewSource,
                                                        }, onOpenCodeViewer: context.onOpenCodeViewer, hideOpenWithMenu: context.compactForRemoteControl === true, stopPropagation: true })] })] }) }, item.path));
                            })) }) })] }), _jsx(ConversationFileRewindDialog, { open: dialogOpen, onOpenChange: setDialogOpen, preview: preview, previewLoading: previewLoading, applying: applying, error: error, onApply: handleApply })] }));
}
//# sourceMappingURL=ConversationFileSummaryPanel.js.map