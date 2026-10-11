import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, } from "../components/ui/alert-dialog.js";
import { X, Check, Info, LoaderCircle, SquareCode, TriangleAlert } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ClientSceneLucideIcon } from "../components/ClientSceneLucideIcon.js";
import { Button } from "../components/ui/button.js";
import { cn } from "../components/lib/utils.js";
import { Popover, PopoverAnchor, PopoverContent } from "../components/ui/popover.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { resolveDraftSuggestedPromptText, } from "../v4/draftSuggestedPromptItems.js";
const PLUGIN_SUCCESS_ROLL_TRANSITION = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1],
};
function DraftSuggestedPromptIcon({ name }) {
    return (_jsx(ClientSceneLucideIcon, { name: name, "aria-hidden": "true", className: "size-4", strokeWidth: 2, fallback: _jsx(SquareCode, { "aria-hidden": "true", className: "size-4", strokeWidth: 2 }) }));
}
function DraftSuggestedPluginActionPopoverContent({ state, }) {
    const isConfirmation = state.phase === "confirmation";
    const reducedMotion = useReducedMotion();
    const statusIcon = state.phase === "progress" ? (_jsx(LoaderCircle, { "aria-hidden": "true", className: "size-4 shrink-0 animate-spin text-foreground-subtle motion-reduce:animate-none" })) : state.phase === "success" ? (_jsx(Check, { "aria-hidden": "true", "data-draft-suggested-plugin-success-icon": "true", className: "size-4 shrink-0 text-foreground" })) : state.phase === "error" ? (_jsx(TriangleAlert, { "aria-hidden": "true", className: "size-4 shrink-0 text-warning" })) : (_jsx(Info, { "aria-hidden": "true", className: "size-4 shrink-0 text-foreground-subtle" }));
    const statusContent = (_jsxs(_Fragment, { children: [statusIcon, _jsx("div", { "data-draft-suggested-plugin-popover-message": "true", className: "min-w-0 flex-1 text-ui-base leading-4.5 text-foreground", children: state.message })] }));
    return (_jsxs(PopoverContent, { side: "bottom", align: "center", sideOffset: 6, collisionPadding: 16, onOpenAutoFocus: (event) => event.preventDefault(), onCloseAutoFocus: (event) => event.preventDefault(), onEscapeKeyDown: (event) => event.preventDefault(), onFocusOutside: (event) => event.preventDefault(), onPointerDownOutside: (event) => {
            const isPrimaryPointer = event.detail.originalEvent.button === 0;
            if (!isConfirmation || !state.onDismiss || !isPrimaryPointer) {
                event.preventDefault();
                return;
            }
            state.onDismiss();
        }, "data-draft-suggested-plugin-popover": state.phase, "data-draft-suggested-plugin-popover-offset": "9", "data-anchor-item-id": state.anchorItemId, className: cn(
        // 固定 80px 确认态只容得下一行标题，较长的本地化 Plugin 名称换行后会把按钮挤出并被裁切。
        "h-auto w-60 max-w-[calc(100vw-2rem)] border-popover-border bg-popover p-3 shadow-md", isConfirmation ? "gap-3" : "gap-0"), children: [_jsx("div", { role: state.phase === "error" ? "alert" : "status", "aria-live": state.phase === "error" ? "assertive" : "polite", "data-draft-suggested-plugin-status-viewport": "true", className: "relative min-w-0 overflow-hidden", children: reducedMotion ? (_jsx("div", { "data-draft-suggested-plugin-success-content": state.phase === "success" ? "true" : undefined, className: "flex min-w-0 items-center gap-1.5", children: statusContent })) : (_jsx(AnimatePresence, { initial: false, mode: "popLayout", children: _jsx(motion.div, { "data-draft-suggested-plugin-success-content": state.phase === "success" ? "true" : undefined, className: "flex min-w-0 items-center gap-1.5", initial: { y: "0.75em", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-0.75em", opacity: 0 }, transition: PLUGIN_SUCCESS_ROLL_TRANSITION, children: statusContent }, state.phase === "success" ? "success" : "steady") })) }), isConfirmation && state.actionLabel && state.onAction ? (_jsx(Button, { type: "button", size: "sm", variant: "default", className: "self-end", onClick: state.onAction, children: state.actionLabel })) : null] }));
}
export function ConversationDraftSuggestedPrompts({ className, layout = "chips", items = [], onSelect, disabled = false, onRefresh, onClose, refreshDisabled = false, pluginActionPopover, }) {
    const { locale, intl } = useZCodeIntl();
    const [confirmClose, setConfirmClose] = useState(false);
    if (items.length === 0)
        return null;
    if (layout === "list") {
        return (_jsxs("div", { "data-v4-draft-suggested-prompts": "true", className: cn("w-full min-w-0 px-2 py-4", className), children: [_jsxs("div", { className: "flex items-center justify-between gap-2 px-3 pb-2 text-ui-sm text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "occupationOnboarding.suggestionsHeading" }) }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [onRefresh ? (_jsx(Button, { type: "button", variant: "link", size: "sm", className: "px-0 text-ui-sm text-foreground-subtle", disabled: disabled || refreshDisabled, onClick: onRefresh, children: intl.formatMessage({ id: "chat.officeSuggestions.refresh" }) })) : null, onClose ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", disabled: disabled || refreshDisabled, "aria-label": intl.formatMessage({ id: "chat.officeSuggestions.closeTitle" }), onClick: () => setConfirmClose(true), children: _jsx(X, { className: "size-4" }) })) : null] })] }), _jsx(AlertDialog, { open: confirmClose, onOpenChange: setConfirmClose, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: intl.formatMessage({ id: "chat.officeSuggestions.closeTitle" }) }), _jsx(AlertDialogDescription, { children: intl.formatMessage({ id: "chat.officeSuggestions.closeDescription" }) })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: intl.formatMessage({ id: "common.cancel" }) }), _jsx(AlertDialogAction, { onClick: onClose, children: intl.formatMessage({ id: "common.confirm" }) })] })] }) }), _jsx("ul", { className: "m-0 flex list-none flex-col p-0", children: items.map((item) => (_jsx(Popover, { open: pluginActionPopover?.anchorItemId === item.id, modal: false, children: _jsxs("li", { children: [_jsx(PopoverAnchor, { asChild: true, children: _jsxs("button", { type: "button", "data-draft-suggested-prompt": item.id, disabled: !onSelect || disabled, onClick: () => onSelect?.(item), className: "flex w-full items-center gap-3 rounded-xl p-3 text-left text-ui-base text-foreground hover:bg-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused disabled:opacity-50", children: [_jsx("span", { className: "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface p-px", children: _jsx("img", { src: item.iconUrl, alt: "", draggable: false, className: cn("shrink-0 rounded-sm object-contain", 
                                                    // GitHub 素材自带白色方形底，再缩小一圈以露出与其他图标一致的外层留白。
                                                    item.iconUrl?.includes("/github/icon.png") ? "size-4.5" : "size-full") }) }), _jsx("span", { className: "min-w-0 flex-1 break-words", children: resolveDraftSuggestedPromptText(item.label, locale) })] }) }), pluginActionPopover?.anchorItemId === item.id ? (_jsx(DraftSuggestedPluginActionPopoverContent, { state: pluginActionPopover })) : null] }) }, item.id))) })] }));
    }
    return (_jsx("div", { "data-v4-draft-suggested-prompts": "true", className: cn("w-full min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className), children: _jsx("div", { "data-v4-draft-suggested-prompts-group": "true", className: "mx-auto flex w-max items-center gap-4", children: items.map((item, index) => {
                const label = resolveDraftSuggestedPromptText(item.label, locale);
                const isPopoverAnchor = pluginActionPopover?.anchorItemId === item.id;
                return (_jsxs(Popover, { open: isPopoverAnchor, modal: false, children: [_jsx(PopoverAnchor, { asChild: true, "data-slot": "button", "data-draft-suggested-plugin-popover-anchor": isPopoverAnchor ? "true" : undefined, children: _jsxs(Button, { type: "button", variant: "outline", size: "lg", "data-draft-suggested-prompt": item.id, "aria-label": label, title: label, disabled: !onSelect || disabled, onClick: onSelect ? () => onSelect(item) : undefined, className: "zcode-draft-prompt-waterfall h-8 min-w-0 justify-start gap-1.5 overflow-hidden rounded-lg px-3 text-left text-ui-caption font-normal leading-4.5 text-foreground", style: {
                                    "--zcode-draft-prompt-waterfall-delay": `${index * 65}ms`,
                                }, children: [_jsx("span", { "data-draft-suggested-prompt-icon": "true", className: "flex size-4 shrink-0 items-center justify-center text-foreground opacity-70 transition-opacity group-hover/button:opacity-100 motion-reduce:transition-none", children: _jsx(DraftSuggestedPromptIcon, { name: item.iconName }) }), _jsx("span", { "data-draft-suggested-prompt-text": "true", className: "min-w-0 max-w-64 truncate text-ui-base text-foreground opacity-70 transition-opacity group-hover/button:opacity-100 motion-reduce:transition-none", children: label })] }) }), isPopoverAnchor ? (_jsx(DraftSuggestedPluginActionPopoverContent, { state: pluginActionPopover })) : null] }, item.id));
            }) }) }));
}
//# sourceMappingURL=ConversationDraftSuggestedPrompts.js.map