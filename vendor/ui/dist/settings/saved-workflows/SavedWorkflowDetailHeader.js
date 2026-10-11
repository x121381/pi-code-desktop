import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TID_WORKFLOW_DETAIL_MENU, TID_WORKFLOW_DETAIL_RUN, TID_WORKFLOW_ACTION_DELETE, TID_WORKFLOW_ACTION_MOVE, testId, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { AutomationMoreHorizontalIcon, AutomationRunNowIcon, AutomationTrashIcon, } from "@/settings/AutomationDesignPrimitives.js";
/**
 * 详情页头行：标题 + 说明 + 右上「运行」与 ⋯ 菜单。从详情页拆出以守住 max-lines（≤400）。
 */
export function SavedWorkflowDetailHeader({ name, description, entry, busy, onRun, onRevise, onCopyPath, onMove, onDelete, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { className: "flex min-w-0 flex-col gap-1.5", children: [_jsx("h1", { className: "text-ui-xl font-semibold text-foreground", children: name }), description ? _jsx("p", { className: "text-ui-base text-foreground-subtle", children: description }) : null] }), _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [_jsxs(Button, { type: "button", size: "lg", "data-icon": "inline-start", "data-testid": TID_WORKFLOW_DETAIL_RUN, disabled: busy || !entry, onClick: onRun, children: [_jsx(AutomationRunNowIcon, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "workflows.hub.detail.run" })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "outline", size: "icon-lg", "aria-label": intl.formatMessage({ id: "workflows.hub.card.menu" }), "data-testid": TID_WORKFLOW_DETAIL_MENU, disabled: busy, children: _jsx(AutomationMoreHorizontalIcon, { className: "size-4", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuItem, { onSelect: onRevise, children: intl.formatMessage({ id: "workflows.hub.card.revise" }) }), _jsx(DropdownMenuItem, { onSelect: onCopyPath, children: intl.formatMessage({ id: "workflows.hub.card.copyPath" }) }), onMove ? (_jsx(DropdownMenuItem, { "data-testid": testId(TID_WORKFLOW_ACTION_MOVE, name), onSelect: onMove, children: intl.formatMessage({
                                            id: entry?.scope === "global"
                                                ? "workflows.hub.card.moveToProject"
                                                : "workflows.hub.card.promoteToGlobal",
                                        }) })) : null, _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { "data-testid": testId(TID_WORKFLOW_ACTION_DELETE, name), className: "text-destructive focus:text-destructive", onSelect: onDelete, children: [_jsx(AutomationTrashIcon, {}), intl.formatMessage({ id: "workflows.hub.card.delete" })] })] })] })] })] }));
}
//# sourceMappingURL=SavedWorkflowDetailHeader.js.map