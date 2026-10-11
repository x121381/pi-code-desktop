import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Download, Loader2, MoreHorizontal, Plus, RefreshCcw, SquareArrowRightEnter, } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Button } from "@/components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function SettingsResourceHeaderActions({ onRefresh, onImport, onExport, onNew, refreshing = false, refreshDisabled = false, importDisabled = false, exportDisabled = false, newDisabled = false, refreshTestId, newTestId, refreshLabel, newLabel: customNewLabel, importActionId, exportActionId, newActionId, }) {
    const { intl } = useZCodeIntl();
    const resolvedRefreshLabel = refreshLabel ?? intl.formatMessage({ id: "common.refresh" });
    const importLabel = intl.formatMessage({
        id: "settings.resourceActions.import",
    });
    const exportLabel = intl.formatMessage({
        id: "settings.resourceActions.export",
    });
    const moreActionsLabel = intl.formatMessage({
        id: "settings.resourceActions.more",
    });
    const newLabel = customNewLabel ?? intl.formatMessage({ id: "settings.create.action" });
    const hasOverflowActions = Boolean(onImport || onExport);
    return (_jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [hasOverflowActions ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "outline", size: "icon-md", "aria-label": moreActionsLabel, children: _jsx(MoreHorizontal, { "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [onImport ? (_jsxs(DropdownMenuItem, { "data-settings-import-action": importActionId, disabled: importDisabled, onSelect: onImport, children: [_jsx(SquareArrowRightEnter, { "aria-hidden": "true" }), importLabel] })) : null, onExport ? (_jsxs(DropdownMenuItem, { "data-settings-export-action": exportActionId, disabled: exportDisabled, onSelect: onExport, children: [_jsx(Download, { "aria-hidden": "true" }), exportLabel] })) : null] })] })) : null, onRefresh ? (_jsx(ControlHintTooltip, { title: resolvedRefreshLabel, children: _jsx(Button, { type: "button", variant: "outline", size: "icon-md", "aria-label": resolvedRefreshLabel, "data-testid": refreshTestId, disabled: refreshDisabled || refreshing, onClick: onRefresh, children: refreshing ? (_jsx(Loader2, { className: "animate-spin", "aria-hidden": "true" })) : (_jsx(RefreshCcw, { "aria-hidden": "true" })) }) })) : null, onNew ? (_jsxs(Button, { type: "button", variant: "default", size: "default", className: "rounded-lg", "data-settings-create-action": newActionId, "aria-label": newLabel, "data-testid": newTestId, disabled: newDisabled, onClick: onNew, children: [_jsx(Plus, { "data-icon": "inline-start", "aria-hidden": "true" }), newLabel] })) : null] }));
}
//# sourceMappingURL=SettingsResourceHeaderActions.js.map