import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {} from "react";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { Input } from "../components/ui/input.js";
import { Textarea } from "../components/ui/textarea.js";
import { hasGitCommitIdentity, } from "../git-branch-switcher/switchAssist.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { FileDisplayInline } from "../lib/fileDisplay.js";
import { AlertCircleIcon, GitBranchIcon, LoaderIcon } from "lucide-react";
export function GitBranchCreateDialog({ open, branchName, mutationPending, onOpenChange, onBranchNameChange, onCancel, onSubmit, }) {
    const { intl } = useZCodeIntl();
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-w-lg gap-0 rounded-2xl p-0 overflow-hidden", children: [_jsxs(DialogHeader, { className: "gap-2 px-6 py-5 pb-0", children: [_jsx(DialogTitle, { className: "text-lg font-medium text-foreground", children: intl.formatMessage({
                                id: "git.branchSwitcher.createDialog.title",
                            }) }), _jsx(DialogDescription, { className: "text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({
                                id: "git.branchSwitcher.createDialog.description",
                            }) })] }), _jsxs("form", { className: "space-y-5 px-6 py-6", onSubmit: (event) => {
                        event.preventDefault();
                        onSubmit();
                    }, children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "git-branch-switcher-create-input", className: "inline-flex text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({
                                        id: "git.branchSwitcher.createDialog.nameLabel",
                                    }) }), _jsx(Input, { id: "git-branch-switcher-create-input", size: "lg", autoFocus: true, value: branchName, disabled: mutationPending, placeholder: intl.formatMessage({
                                        id: "git.branchSwitcher.createDialog.placeholder",
                                    }), className: "h-10 rounded-lg bg-background/50", onChange: (event) => {
                                        onBranchNameChange(event.target.value);
                                    } }), _jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                        id: "git.branchSwitcher.createDialog.helper",
                                    }) })] }), _jsxs(DialogFooter, { className: "gap-2 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", onClick: onCancel, disabled: mutationPending, className: "h-10 min-w-0 px-5", children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(Button, { type: "submit", size: "lg", disabled: mutationPending || branchName.trim().length === 0, className: "h-10 min-w-0 px-5", children: [mutationPending ? _jsx(LoaderIcon, { className: "size-4 animate-spin" }) : null, intl.formatMessage({
                                            id: "git.branchSwitcher.createDialog.confirm",
                                        })] })] })] })] }) }));
}
export function GitBranchSwitchAssistDialog({ step, state, currentBranchLabel, commitMessage, commitError, mutationPending, onClose, onOpenCommit, onCommitMessageChange, onSubmit, }) {
    const { intl, locale } = useZCodeIntl();
    const numberFormatter = new Intl.NumberFormat(locale);
    const descriptionId = state?.issue.code === "untracked-changes-would-be-overwritten"
        ? "git.branchSwitcher.blockedDialog.description.untracked"
        : "git.branchSwitcher.blockedDialog.description.tracked";
    const hasIdentity = hasGitCommitIdentity(state?.identity ?? null);
    return (_jsxs(Dialog, { open: Boolean(step && state), onOpenChange: (nextOpen) => {
            if (!nextOpen) {
                onClose();
            }
        }, children: [step === "blocked" && state ? (_jsxs(DialogContent, { className: "max-w-lg gap-0 rounded-2xl p-0 overflow-hidden", children: [_jsxs(DialogHeader, { className: "gap-2 px-6 py-5 pb-0", children: [_jsx(DialogTitle, { className: "text-lg font-medium text-foreground", children: intl.formatMessage({
                                    id: "git.branchSwitcher.blockedDialog.title",
                                }) }), _jsx(DialogDescription, { className: "text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({ id: descriptionId }) })] }), _jsxs("div", { className: "space-y-5 px-6 py-6", children: [_jsxs("div", { className: "flex items-start gap-3 rounded-xl bg-warning/10 px-4 py-3 text-ui-base text-warning", children: [_jsx(AlertCircleIcon, { className: "mt-0.5 size-4 shrink-0" }), _jsx("p", { children: intl.formatMessage({
                                            id: "git.branchSwitcher.blockedDialog.helper",
                                        }) })] }), _jsxs("div", { className: "rounded-xl bg-background/30", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                    id: "git.branchSwitcher.blockedDialog.filesLabel",
                                                }) }), _jsx("div", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                                    id: "git.branchSwitcher.commitDialog.changesValue",
                                                }, {
                                                    count: numberFormatter.format(state.fileCount),
                                                }) })] }), _jsx("div", { className: "space-y-1 overflow-y-auto p-1 max-h-56 overflow-y-auto", children: state.affectedFiles.map((file) => (_jsxs("div", { className: "flex items-start justify-between gap-4 h-10 rounded-lg bg-background/50 px-3 py-2", children: [_jsx("div", { className: "min-w-0 flex-1", children: _jsx(FileDisplayInline, { path: file.workspaceRelativePath, options: {
                                                            className: "inline-flex min-w-0 max-w-full items-center gap-1.5",
                                                            fileNameClassName: "truncate text-ui-base font-medium text-foreground",
                                                        } }) }), _jsxs("div", { className: "flex shrink-0 items-center gap-2 font-mono text-ui-base", children: [_jsxs("span", { className: "text-diff-added", children: ["+", file.added] }), _jsxs("span", { className: "text-diff-removed", children: ["-", file.removed] })] })] }, file.repoRelativePath))) })] }), _jsxs(DialogFooter, { className: "gap-2 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", onClick: onClose, disabled: mutationPending, className: "h-10 min-w-0 px-5", children: intl.formatMessage({ id: "common.cancel" }) }), _jsx(Button, { type: "button", size: "lg", onClick: onOpenCommit, disabled: mutationPending, className: "h-10 min-w-0 px-5", children: intl.formatMessage({
                                            id: "git.branchSwitcher.blockedDialog.submitAction",
                                        }) })] })] })] })) : null, step === "commit" && state ? (_jsxs(DialogContent, { className: "max-w-lg gap-0 rounded-2xl p-0 overflow-hidden", children: [_jsxs(DialogHeader, { className: "gap-2 px-6 py-5 pb-0", children: [_jsx(DialogTitle, { className: "text-lg font-medium text-foreground", children: intl.formatMessage({
                                    id: "git.branchSwitcher.commitDialog.title",
                                }) }), _jsx(DialogDescription, { className: "text-ui-base leading-6 text-foreground-subtle", children: intl.formatMessage({
                                    id: "git.branchSwitcher.commitDialog.description",
                                }, {
                                    branchName: state.targetBranchName,
                                }) })] }), _jsxs("form", { className: "space-y-5 px-6 py-6", onSubmit: (event) => {
                            event.preventDefault();
                            onSubmit();
                        }, children: [_jsxs("div", { className: "rounded-xl bg-background/30", children: [_jsxs("div", { className: "flex items-start justify-between p-4", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                    id: "git.branchSwitcher.commitDialog.currentBranchLabel",
                                                }) }), _jsxs("div", { className: "flex items-center gap-2 text-ui-base font-medium text-foreground", children: [_jsx(GitBranchIcon, { className: "size-4 text-foreground-subtle" }), _jsx("span", { children: currentBranchLabel })] })] }), _jsxs("div", { className: "flex items-center justify-between gap-3 border-t border-border/50 p-4 text-ui-base", children: [_jsx("div", { className: "text-ui-base font-medium text-foreground", children: intl.formatMessage({
                                                    id: "git.branchSwitcher.commitDialog.changesLabel",
                                                }) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: "text-foreground-subtle", children: intl.formatMessage({
                                                            id: "git.branchSwitcher.commitDialog.changesValue",
                                                        }, {
                                                            count: numberFormatter.format(state.fileCount),
                                                        }) }), _jsxs("span", { className: "text-diff-added font-mono", children: ["+", numberFormatter.format(state.totalAdded)] }), _jsxs("span", { className: "text-diff-removed font-mono", children: ["-", numberFormatter.format(state.totalRemoved)] })] })] })] }), !hasIdentity ? (_jsxs("div", { className: "flex items-start gap-3 rounded-xl bg-warning/10 px-4 py-3 text-ui-base text-warning", children: [_jsx(AlertCircleIcon, { className: "mt-0.5 size-4 shrink-0" }), _jsx("p", { children: intl.formatMessage({
                                            id: "git.branchSwitcher.commitDialog.identityMissing",
                                        }) })] })) : null, _jsx("div", { children: _jsxs("div", { className: "space-y-2", children: [_jsx("label", { htmlFor: "git-branch-switcher-commit-message", className: "inline-flex text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({
                                                id: "git.branchSwitcher.commitDialog.messageLabel",
                                            }) }), _jsx(Textarea, { id: "git-branch-switcher-commit-message", value: commitMessage, disabled: mutationPending, placeholder: intl.formatMessage({
                                                id: "git.branchSwitcher.commitDialog.messagePlaceholder",
                                            }), className: "min-h-32 rounded-lg border-input-border bg-background/50 px-3 py-3 text-ui-base text-foreground placeholder:text-foreground-subtlest focus-visible:border-input-border-focused focus-visible:bg-input-focused focus-visible:ring-0 md:text-ui-base", onChange: (event) => {
                                                onCommitMessageChange(event.target.value);
                                            } }), _jsx("p", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                                id: "git.branchSwitcher.commitDialog.messageHelper",
                                            }) })] }) }), commitError ? _jsx("p", { className: "text-ui-base text-destructive", children: commitError }) : null, _jsxs(DialogFooter, { className: "gap-2 pt-4", children: [_jsx(Button, { type: "button", variant: "secondary", size: "lg", onClick: onClose, disabled: mutationPending, className: "h-10 min-w-0 px-5", children: intl.formatMessage({ id: "common.cancel" }) }), _jsxs(Button, { type: "submit", size: "lg", disabled: mutationPending || (!hasIdentity && state.identity !== null), className: "h-10 min-w-0 px-5", children: [mutationPending ? _jsx(LoaderIcon, { className: "size-4 animate-spin" }) : null, intl.formatMessage({
                                                id: "git.branchSwitcher.commitDialog.confirm",
                                            })] })] })] })] })) : null] }));
}
//# sourceMappingURL=GitBranchDialogs.js.map