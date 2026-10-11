import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Loader2Icon, Undo2Icon } from "lucide-react";
import { TID_V4_EDIT_WORKSPACE_CONFLICT_CONVERSATION_ONLY, TID_V4_EDIT_WORKSPACE_CONFLICT_DIALOG, } from "@zcode/shared";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
function formatReason(reason, intl) {
    const fallbackReasonKey = "chat.changeSummary.rewindDialog.reason.unsupportedCheckpoint";
    const keyByReason = {
        bash_ignored: "chat.changeSummary.rewindDialog.reason.bashIgnored",
        checkpoint_missing: "chat.changeSummary.rewindDialog.reason.checkpointMissing",
        checkpoint_unreadable: "chat.changeSummary.rewindDialog.reason.checkpointUnreadable",
        external_modified: "chat.changeSummary.rewindDialog.reason.externalModified",
        file_read_failed: "chat.changeSummary.rewindDialog.reason.fileReadFailed",
        unsupported_checkpoint: fallbackReasonKey,
    };
    return intl.formatMessage({ id: keyByReason[reason] ?? fallbackReasonKey });
}
function PreviewFileList({ files, type, }) {
    const { intl } = useZCodeIntl();
    if (files.length === 0)
        return null;
    return (_jsx("div", { className: "grid gap-1", children: files.map((file) => (_jsxs("div", { className: "flex items-center justify-between gap-3 rounded-md border border-border bg-input/30 px-2 py-1.5", children: [_jsx("span", { className: "min-w-0 truncate font-mono text-ui-xs text-foreground", children: file.path }), _jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtle", children: "reason" in file
                        ? formatReason(file.reason, intl)
                        : intl.formatMessage({ id: "chat.changeSummary.rewindDialog.operationCount" }, { count: String(file.operationCount) }) })] }, `${type}:${file.path}`))) }));
}
export function ConversationFileRewindDialog({ open, onOpenChange, preview, previewLoading, applying, error, onApply, variant = "fileRewind", onConversationOnly, }) {
    const { intl } = useZCodeIntl();
    const safeCount = preview?.safeFiles.length ?? 0;
    const unsafeCount = preview?.unsafeFiles.length ?? 0;
    const ignoredCount = preview?.ignoredFiles.length ?? 0;
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-lg", "data-testid": variant === "editConflict" ? TID_V4_EDIT_WORKSPACE_CONFLICT_DIALOG : undefined, children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: intl.formatMessage({
                                id: variant === "editConflict"
                                    ? "chat.edit.workspaceConflict.title"
                                    : "chat.changeSummary.rewindDialog.title",
                            }) }), _jsx(DialogDescription, { children: intl.formatMessage({
                                id: variant === "editConflict"
                                    ? "chat.edit.workspaceConflict.description"
                                    : "chat.changeSummary.rewindDialog.description",
                            }) })] }), _jsxs("div", { className: "grid max-h-[50vh] gap-3 overflow-y-auto pr-1", children: [previewLoading ? (_jsxs("div", { className: "flex items-center gap-2 text-ui-base text-foreground-subtle", children: [_jsx(Loader2Icon, { className: "size-3.5 animate-spin" }), intl.formatMessage({ id: "chat.changeSummary.rewindDialog.loading" })] })) : preview ? (_jsxs(_Fragment, { children: [variant === "fileRewind" ? (_jsxs("section", { className: "grid gap-1", children: [_jsx("h3", { className: "text-ui-base font-medium", children: intl.formatMessage({ id: "chat.changeSummary.rewindDialog.safeTitle" }, { count: String(safeCount) }) }), _jsx(PreviewFileList, { files: preview.safeFiles, type: "safe" })] })) : null, _jsxs("section", { className: "grid gap-1", children: [_jsx("h3", { className: "text-ui-base font-medium", children: intl.formatMessage({ id: "chat.changeSummary.rewindDialog.unsafeTitle" }, { count: String(unsafeCount) }) }), _jsx(PreviewFileList, { files: preview.unsafeFiles, type: "unsafe" })] }), ignoredCount > 0 ? (_jsxs("section", { className: "grid gap-1", children: [_jsx("h3", { className: "text-ui-base font-medium", children: intl.formatMessage({ id: "chat.changeSummary.rewindDialog.ignoredTitle" }, { count: String(ignoredCount) }) }), _jsx(PreviewFileList, { files: preview.ignoredFiles, type: "ignored" })] })) : null] })) : (_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "chat.changeSummary.rewindDialog.noPreview" }) })), error ? _jsx("p", { className: "text-ui-base text-danger", children: error }) : null, variant === "fileRewind" && preview && !preview.canApply ? (_jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "chat.changeSummary.rewindDialog.cannotApply" }) })) : null] }), _jsx(DialogFooter, { children: variant === "editConflict" ? (_jsxs(_Fragment, { children: [_jsx(Button, { type: "button", variant: "ghost", disabled: applying, onClick: () => onOpenChange(false), children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(Button, { type: "button", disabled: applying || previewLoading, "data-testid": TID_V4_EDIT_WORKSPACE_CONFLICT_CONVERSATION_ONLY, onClick: onConversationOnly, children: [applying ? _jsx(Loader2Icon, { className: "animate-spin" }) : null, intl.formatMessage({ id: "chat.edit.workspaceConflict.conversationOnly" })] })] })) : (_jsxs(Button, { type: "button", variant: "destructive", disabled: !preview?.canApply || applying || previewLoading, onClick: onApply, children: [applying ? _jsx(Loader2Icon, { className: "animate-spin" }) : _jsx(Undo2Icon, {}), intl.formatMessage({ id: "chat.changeSummary.rewindDialog.confirm" })] })) })] }) }));
}
//# sourceMappingURL=ConversationFileRewindDialog.js.map