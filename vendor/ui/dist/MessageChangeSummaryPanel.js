import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { TID_CHAT_CHANGE_SUMMARY_TOGGLE_FILES_BUTTON, testId } from "@zcode/shared";
import { ChevronRightIcon, Undo2 } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { FileDisplayInline } from "@/lib/fileDisplay.js";
import { buildTurnChangeSummary, toWorkspaceRelativePath } from "@/lib/taskChangeSummary.js";
import { Button } from "@/components/ui/button.js";
import { OpenSplitButton } from "@/OpenSplitButton.js";
import { cn } from "@/components/lib/utils.js";
import { buildChangeSummaryDiffViewerSource, buildChangeSummaryFilePreviewSource, openChangeSummaryDiffViewer, } from "@/messageChangeSummaryPreview.js";
export { buildChangeSummaryDiffViewerSource, buildChangeSummaryFilePreviewSource, openChangeSummaryDiffViewer, } from "@/messageChangeSummaryPreview.js";
export function MessageChangeSummaryPanel({ summary, workspacePath, workspaceIdentity, workspaceRemoteSessionId, changeDetails, readonlyDiffPatchesByPath, fileState = "applied", messageId, compactForRemoteControl = false, animationDelayMs = 0, onToggleFiles, onOpenCodeViewer, }) {
    const { intl } = useZCodeIntl();
    const [isFileListOpen, setIsFileListOpen] = useState(false);
    const turnSummary = useMemo(() => {
        // Bugfix: 某些链路传进来的 summary 可能还是 task/session 级汇总。
        // 面板已经拿到了当前轮 changeDetails，优先从单轮快照重算，避免历史轮次文件混进当前消息。
        return buildTurnChangeSummary(changeDetails) ?? summary;
    }, [changeDetails, summary]);
    const filesChangedLabel = intl.formatMessage({
        id: turnSummary.fileCount === 1
            ? "chat.changeSummary.filesChanged.one"
            : "chat.changeSummary.filesChanged.other",
    }, { count: String(turnSummary.fileCount) });
    // Bugfix: 变更摘要以前只有聚合计数，文件行点击后拿不到对应的 before/after。
    // 这里按 path 建索引，把同一轮持久化快照重新接回 UI，文件列表才能展开真正的 diff。
    const snapshotsByPath = useMemo(() => new Map((changeDetails?.snapshots ?? []).map((snapshot) => [snapshot.path, snapshot])), [changeDetails]);
    const isFileRewindApplied = fileState === "reverted";
    const toggleActionLabel = intl.formatMessage({
        id: isFileRewindApplied
            ? "chat.changeSummary.reverted"
            : "chat.changeSummary.rewind",
    });
    const panelToggleLabel = intl.formatMessage({
        id: isFileListOpen ? "chat.changeSummary.collapse" : "chat.changeSummary.expand",
    });
    const reviewDiffLabel = intl.formatMessage({ id: "chat.changeSummary.review" });
    const canRequestFileRewind = Boolean(onToggleFiles);
    return (_jsx(_Fragment, { children: _jsxs(Collapsible, { open: isFileListOpen, onOpenChange: setIsFileListOpen, "data-zcode-stream-animate": "true", className: "overflow-hidden rounded-xl border border-border bg-card shadow-none", style: {
                "--zcode-stream-animation-delay": `${animationDelayMs}ms`,
            }, children: [_jsxs("div", { className: "flex h-10 items-center justify-between gap-3 px-2 transition-colors hover:bg-hover", children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", "aria-label": panelToggleLabel, title: panelToggleLabel, className: "flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-left", children: [_jsx(ChevronRightIcon, { className: `size-3.5 shrink-0 text-foreground-subtlest transition-transform ${isFileListOpen ? "rotate-90" : ""}`, "aria-hidden": "true" }), _jsx("span", { className: "min-w-0 truncate text-ui-base font-medium text-foreground", children: filesChangedLabel }), _jsxs("span", { className: "shrink-0 tabular-nums text-ui-base", children: [_jsxs("span", { className: "text-diff-added", children: ["+", turnSummary.added] }), " ", _jsxs("span", { className: "text-diff-removed", children: ["-", turnSummary.removed] })] })] }) }), canRequestFileRewind && turnSummary.fileCount > 0 && changeDetails ? (_jsx("div", { className: "flex items-center gap-1.5 text-ui-base text-foreground-subtle", children: _jsxs(Button, { type: "button", variant: "ghost", size: "sm", "data-testid": messageId
                                    ? testId(TID_CHAT_CHANGE_SUMMARY_TOGGLE_FILES_BUTTON, messageId)
                                    : TID_CHAT_CHANGE_SUMMARY_TOGGLE_FILES_BUTTON, "data-message-id": messageId, "aria-label": toggleActionLabel, title: toggleActionLabel, disabled: isFileRewindApplied, onClick: () => onToggleFiles?.(), className: "h-7 gap-1.5 px-2 text-ui-base text-foreground-subtle hover:text-foreground", children: [_jsx("span", { children: toggleActionLabel }), _jsx(Undo2, { className: "size-3.5" })] }) })) : null] }), _jsx(CollapsibleContent, { children: turnSummary.files.map((file) => {
                        const relativePath = toWorkspaceRelativePath(workspacePath, file.path);
                        const snapshot = snapshotsByPath.get(file.path);
                        const readonlyPatch = readonlyDiffPatchesByPath?.get(file.path);
                        const diffViewerSource = buildChangeSummaryDiffViewerSource({
                            patch: readonlyPatch,
                            path: file.path,
                            snapshot,
                            relativePath,
                            workspacePath,
                            workspaceIdentity,
                            workspaceRemoteSessionId,
                        });
                        const filePreviewSource = buildChangeSummaryFilePreviewSource({
                            path: file.path,
                            relativePath,
                            workspacePath,
                            workspaceIdentity,
                            workspaceRemoteSessionId,
                        });
                        const canOpenDiff = Boolean(diffViewerSource && onOpenCodeViewer);
                        const openDiffViewer = () => {
                            openChangeSummaryDiffViewer(diffViewerSource, onOpenCodeViewer);
                        };
                        return (_jsx("div", { className: "w-full bg-background/50 overflow-hidden", children: _jsxs("div", { "aria-disabled": !canOpenDiff, className: cn("flex w-full items-center gap-1 px-2 py-2 text-left transition-colors", canOpenDiff ? "cursor-pointer hover:bg-hover/30" : "cursor-default"), onClick: openDiffViewer, onKeyDown: (event) => {
                                    if (event.key !== "Enter" && event.key !== " ") {
                                        return;
                                    }
                                    event.preventDefault();
                                    openDiffViewer();
                                }, role: "button", tabIndex: canOpenDiff ? 0 : -1, title: file.path, children: [_jsxs("div", { className: "flex min-w-0 flex-1 items-center gap-2", children: [_jsx("div", { className: "min-w-0 flex items-center", children: _jsx(FileDisplayInline, { path: file.path, options: {
                                                        basePath: workspacePath,
                                                        showFilePath: true,
                                                        className: "inline-flex min-w-0 max-w-full items-center gap-1.5",
                                                        fileNameClassName: "truncate text-ui-base font-medium text-foreground",
                                                        filePathClassName: "truncate text-ui-base text-foreground-subtlest",
                                                    } }) }), _jsxs("span", { className: "flex shrink-0 items-center gap-2 tabular-nums text-ui-base", children: [file.added > 0 ? _jsxs("span", { className: "text-diff-added", children: ["+", file.added] }) : null, file.removed > 0 ? (_jsxs("span", { className: "text-diff-removed", children: ["-", file.removed] })) : null] })] }), _jsxs("div", { className: "flex shrink-0 items-center gap-1.5", children: [_jsx(Button, { type: "button", variant: "outline", size: "default", "aria-label": reviewDiffLabel, title: reviewDiffLabel, disabled: !canOpenDiff, className: "h-7 gap-1.5 rounded-lg bg-input px-2 text-ui-base", onClick: (event) => {
                                                    event.stopPropagation();
                                                    openDiffViewer();
                                                }, onPointerDown: (event) => event.stopPropagation(), children: _jsx("span", { children: reviewDiffLabel }) }), _jsx(OpenSplitButton, { target: {
                                                    type: "file",
                                                    path: file.path,
                                                    title: relativePath,
                                                    label: relativePath,
                                                    previewSource: filePreviewSource,
                                                }, onOpenCodeViewer: onOpenCodeViewer, 
                                                // Bugfix: 手机远控只需要在应用内预览 diff 文件，不需要桌面端的“选择 App 打开”菜单。
                                                // 隐藏下拉区可以减少窄屏误触，同时保留主“打开”按钮的预览能力。
                                                hideOpenWithMenu: compactForRemoteControl, stopPropagation: true })] })] }) }, file.path));
                    }) })] }) }));
}
//# sourceMappingURL=MessageChangeSummaryPanel.js.map