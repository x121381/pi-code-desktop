import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDown, Loader2, Plus, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { usePluginCreator } from "../hooks/usePluginCreator.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function PluginAddMenu({ onCreateTask, onAddMarketplace, testId, isWebRemoteControl = false, }) {
    const { intl } = useZCodeIntl();
    const creator = usePluginCreator(onCreateTask, isWebRemoteControl);
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "default", "data-testid": testId, children: [creator.busy ? _jsx(Loader2, { className: "size-3.5 animate-spin", "aria-hidden": "true" }) : null, intl.formatMessage({ id: "pluginCreator.add" }), _jsx(ChevronDown, { className: "size-3.5", "aria-hidden": "true" })] }) }), _jsxs(DropdownMenuContent, { align: "end", "data-testid": "plugin-add-menu", children: [_jsxs(DropdownMenuItem, { "data-testid": "plugin-create-menu-item", disabled: creator.busy || !creator.available, onSelect: () => void creator.create(), children: [_jsx(Sparkles, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "pluginCreator.create" })] }), _jsxs(DropdownMenuItem, { "data-testid": "plugin-store-add-source-menu-item", onSelect: onAddMarketplace, children: [_jsx(Plus, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "pluginCreator.addMarketplace" })] })] })] }));
}
//# sourceMappingURL=PluginAddMenu.js.map