import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Settings2Icon } from "lucide-react";
import { Button } from "./components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "./components/ui/dropdown-menu.js";
import { Switch } from "./components/ui/switch.js";
import { TRAJECTORY_EXPANSION_KINDS, } from "./ModelTrajectoryExpansion.js";
export function ModelTrajectoryExpansionMenu({ commands, onToggle, intl, }) {
    const label = intl.formatMessage({ id: "modelTrajectory.customExpansion" });
    return (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { "data-trajectory-custom-expansion": "", type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground", "aria-label": label, title: label, children: _jsx(Settings2Icon, { className: "size-3.5" }) }) }), _jsx(DropdownMenuContent, { align: "end", className: "w-52", children: TRAJECTORY_EXPANSION_KINDS.map((kind) => (_jsxs(DropdownMenuItem, { "data-trajectory-expansion-kind": kind, className: "justify-between", onSelect: (event) => {
                        event.preventDefault();
                        onToggle(kind);
                    }, children: [_jsx("span", { children: expansionKindLabel(kind, intl) }), _jsx(Switch, { size: "sm", checked: commands[kind].expanded, className: "pointer-events-none", "aria-hidden": "true", tabIndex: -1 })] }, kind))) })] }));
}
function expansionKindLabel(kind, intl) {
    switch (kind) {
        case "system":
        case "user":
        case "assistant":
            return intl.formatMessage({ id: `modelTrajectory.role.${kind}` });
        case "reasoning":
            return intl.formatMessage({ id: "modelTrajectory.reasoning" });
        case "tool-call":
            return intl.formatMessage({ id: "modelTrajectory.toolCall" });
        case "tool-result":
            return intl.formatMessage({ id: "modelTrajectory.role.tool" });
    }
}
//# sourceMappingURL=ModelTrajectoryExpansionMenu.js.map