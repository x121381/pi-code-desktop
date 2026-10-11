import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { Button } from "@/components/ui/button.js";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, } from "@/components/ui/command.js";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover.js";
import { cn } from "@/components/lib/utils.js";
import { GitBranchCreateDialog, GitBranchSwitchAssistDialog, } from "@/git-branch-switcher/GitBranchDialogs.js";
import { GitGraphDialog } from "@/git-graph/GitGraphDialog.js";
import { useGitBranchSwitcher } from "@/hooks/useGitBranchSwitcher.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { matchesGitBranchSearch, resolveGitBranchTriggerLabel, } from "@/git-branch-switcher/display.js";
import { isCoarseTouchDevice, shouldRestoreChatInputFocusAfterPickerClose, } from "@/lib/pickerFocus.js";
import { ChevronDownIcon, GitBranchIcon, GitGraph, LoaderIcon, PlusIcon, } from "lucide-react";
export function GitBranchSwitcher({ workspacePath, gitSummary, dirtyFileCount, onRefreshGit, className, triggerClassName, popoverClassName, branchListClassName, markAsWorkspaceHeaderBranch = false, compactForRemoteControl = false, popoverSide = "top", avoidPopoverCollisions = true, showFooterActions = true, }) {
    const { intl, locale } = useZCodeIntl();
    const numberFormatter = new Intl.NumberFormat(locale);
    const commandListRef = useRef(null);
    const [gitGraphDialogOpen, setGitGraphDialogOpen] = useState(false);
    const { open, setOpen, createDialogOpen, setCreateDialogOpen, createBranchName, setCreateBranchName, commitMessage, setCommitMessage, commitError, switchAssistStep, switchAssistState, branchesResult, loadingBranches, mutationPending, switchBranch, createBranchAndSwitch, openSwitchCommitDialog, closeSwitchAssistDialog, commitAndSwitchBranch, } = useGitBranchSwitcher({
        workspacePath,
        currentBranchName: gitSummary.branchName,
        headRefType: gitSummary.headRefType,
        onRefreshGit,
    });
    const isVisible = gitSummary.isGitAvailable && gitSummary.isRepository;
    const displayedCurrentBranchName = branchesResult?.currentBranchName ?? gitSummary.branchName;
    const triggerLabel = useMemo(() => resolveGitBranchTriggerLabel({
        headRefType: gitSummary.headRefType,
        currentBranchName: displayedCurrentBranchName,
        detachedLabel: intl.formatMessage({ id: "git.head.detached" }),
        fallbackLabel: intl.formatMessage({ id: "git.branchSwitcher.label" }),
    }), [displayedCurrentBranchName, gitSummary.headRefType, intl]);
    const currentBranchDirtyLabel = useMemo(() => dirtyFileCount > 0
        ? intl.formatMessage({ id: "git.branchSwitcher.currentDirty" }, { count: numberFormatter.format(dirtyFileCount) })
        : null, [dirtyFileCount, intl, numberFormatter]);
    const switchAssistCurrentBranchLabel = useMemo(() => {
        if (!switchAssistState) {
            return triggerLabel;
        }
        return resolveGitBranchTriggerLabel({
            headRefType: gitSummary.headRefType,
            currentBranchName: switchAssistState.currentBranchName,
            detachedLabel: intl.formatMessage({ id: "git.head.detached" }),
            fallbackLabel: intl.formatMessage({ id: "git.branchSwitcher.label" }),
        });
    }, [gitSummary.headRefType, intl, switchAssistState, triggerLabel]);
    const branchSearchFilter = useCallback((value, search) => matchesGitBranchSearch(value, search) ? 1 : 0, []);
    useEffect(() => {
        if (!open || !branchesResult?.branches.length) {
            return;
        }
        const frameId = window.requestAnimationFrame(() => {
            const selectedItem = commandListRef.current?.querySelector('[data-branch-current="true"]') ?? null;
            selectedItem?.scrollIntoView({ block: "nearest" });
        });
        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [branchesResult, open]);
    const handleContentKeyDown = useCallback((event) => {
        if (event.key !== "Tab") {
            return;
        }
        const highlightedItem = event.currentTarget.querySelector('[data-slot="command-item"][data-selected="true"]:not([data-disabled=true])') ??
            event.currentTarget.querySelector('[data-slot="command-item"]:not([data-disabled=true])');
        if (!highlightedItem) {
            return;
        }
        event.preventDefault();
        highlightedItem.click();
    }, []);
    if (!isVisible) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { "data-workspace-header-branch": markAsWorkspaceHeaderBranch ? "true" : undefined, className: cn("flex items-center px-1 pt-2", className), children: _jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "ghost", size: "default", disabled: mutationPending, "aria-label": intl.formatMessage({
                                    id: "git.branchSwitcher.trigger.ariaLabel",
                                }), className: cn("min-w-0 rounded-full text-ui-base/relaxed", 
                                // Bugfix: 手机远控聊天页底部空间很窄，分支名会挤压输入工具栏；远控模式只保留图标入口。
                                compactForRemoteControl
                                    ? "size-8 px-0"
                                    : "max-w-full pl-3 pr-2", triggerClassName), children: [_jsx(GitBranchIcon, { "data-branch-switcher-primary-icon": "true", className: "size-4 text-foreground-subtle" }), !compactForRemoteControl ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "min-w-0 max-w-25 truncate text-left", children: triggerLabel }), loadingBranches || mutationPending ? (_jsx(LoaderIcon, { "data-branch-switcher-trailing-icon": "true", className: "size-3.5 animate-spin text-foreground-subtle" })) : (_jsx(ChevronDownIcon, { "data-branch-switcher-trailing-icon": "true", className: "size-3.5 text-foreground-subtle" }))] })) : null] }) }), _jsxs(PopoverContent, { align: "start", side: popoverSide, avoidCollisions: avoidPopoverCollisions, className: cn("w-80 gap-0 bg-menu p-0", popoverClassName), onOpenAutoFocus: (event) => {
                                event.preventDefault();
                                if (isCoarseTouchDevice()) {
                                    // 手机触控设备打开分支列表时，自动聚焦搜索框会拉起系统键盘遮挡列表。
                                    // 移动端保留触发器焦点，用户需要搜索时再手动点输入框；桌面端继续自动进入搜索。
                                    return;
                                }
                                const target = event.currentTarget;
                                if (!(target instanceof HTMLElement)) {
                                    return;
                                }
                                const searchInput = target.querySelector('[data-slot="command-input"]');
                                searchInput?.focus();
                            }, onCloseAutoFocus: (event) => {
                                event.preventDefault();
                                if (!shouldRestoreChatInputFocusAfterPickerClose({
                                    isCoarseTouchDevice: isCoarseTouchDevice(),
                                })) {
                                    return;
                                }
                                const input = document.querySelector('[data-testid="chat-input"]');
                                input?.focus();
                            }, children: [_jsxs(Command, { className: "bg-transparent p-0 text-foreground", filter: branchSearchFilter, onKeyDown: handleContentKeyDown, children: [_jsx(CommandInput, { placeholder: intl.formatMessage({
                                                id: "git.branchSwitcher.searchPlaceholder",
                                            }), className: "h-8" }), _jsxs(CommandList, { ref: commandListRef, className: cn("max-h-72", branchListClassName), children: [_jsx(CommandEmpty, { className: "px-4 py-5 text-foreground-subtle", children: loadingBranches
                                                        ? intl.formatMessage({ id: "common.loading" })
                                                        : intl.formatMessage({ id: "git.branchSwitcher.empty" }) }), _jsx(CommandGroup, { heading: intl.formatMessage({
                                                        id: "git.branchSwitcher.section.branches",
                                                    }), className: "space-y-0.5 p-1 **:[[cmdk-group-heading]]:px-3 **:[[cmdk-group-heading]]:py-2 **:[[cmdk-group-heading]]:text-ui-base **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-foreground-subtle", children: (branchesResult?.branches ?? []).map((branch) => {
                                                        const isCurrent = branch.name === displayedCurrentBranchName;
                                                        return (_jsxs(CommandItem, { value: branch.name, "data-checked": isCurrent ? "true" : undefined, "data-branch-current": isCurrent ? "true" : undefined, disabled: mutationPending, className: cn("items-start gap-3 rounded-lg px-3 py-2 text-ui-base"), onSelect: () => {
                                                                void switchBranch(branch.name);
                                                            }, children: [_jsx(GitBranchIcon, { className: "mt-0.5 size-4 text-foreground-subtle" }), _jsxs("div", { className: "min-w-0 flex-1 flex flex-col gap-1 text-left", children: [_jsx("div", { className: "truncate text-ui-base font-medium text-foreground", children: branch.name }), isCurrent && currentBranchDirtyLabel ? (_jsx("p", { className: "pt-0.5 text-ui-base text-foreground-subtle", children: currentBranchDirtyLabel })) : null] })] }, branch.name));
                                                    }) })] })] }), showFooterActions ? (_jsxs("div", { className: "border-t border-border p-1", children: [_jsxs(Button, { type: "button", variant: "ghost", size: "lg", className: "w-full justify-start px-2 text-foreground hover:bg-menu-hover hover:text-foreground", disabled: mutationPending, onClick: () => {
                                                setOpen(false);
                                                setCreateDialogOpen(true);
                                            }, children: [_jsx(PlusIcon, { className: "size-4 text-foreground-subtle" }), intl.formatMessage({
                                                    id: "git.branchSwitcher.createAction",
                                                })] }), _jsxs(Button, { type: "button", variant: "ghost", size: "lg", className: "w-full justify-start px-2 text-foreground hover:bg-menu-hover hover:text-foreground", onClick: () => {
                                                setOpen(false);
                                                setGitGraphDialogOpen(true);
                                            }, children: [_jsx(GitGraph, { className: "size-4 text-foreground-subtle" }), intl.formatMessage({ id: "gitGraph.menuAction" })] })] })) : null] })] }) }), _jsx(GitBranchCreateDialog, { open: createDialogOpen, branchName: createBranchName, mutationPending: mutationPending, onOpenChange: (nextOpen) => {
                    setCreateDialogOpen(nextOpen);
                    if (!nextOpen) {
                        setCreateBranchName("");
                    }
                }, onBranchNameChange: setCreateBranchName, onCancel: () => {
                    setCreateDialogOpen(false);
                    setCreateBranchName("");
                }, onSubmit: () => {
                    void createBranchAndSwitch();
                } }), _jsx(GitGraphDialog, { open: gitGraphDialogOpen, workspacePath: workspacePath, onOpenChange: setGitGraphDialogOpen }), _jsx(GitBranchSwitchAssistDialog, { step: switchAssistStep, state: switchAssistState, currentBranchLabel: switchAssistCurrentBranchLabel, commitMessage: commitMessage, commitError: commitError, mutationPending: mutationPending, onClose: closeSwitchAssistDialog, onOpenCommit: openSwitchCommitDialog, onCommitMessageChange: setCommitMessage, onSubmit: () => {
                    void commitAndSwitchBranch();
                } })] }));
}
//# sourceMappingURL=GitBranchSwitcher.js.map