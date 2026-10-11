import { jsx as _jsx } from "react/jsx-runtime";
import { Button } from "@/components/ui/button.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
function TaskRowActionButton({ label, children, className, onClick, showTooltip = false, disabledReason, testId, }) {
    const button = (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", className: className, disabled: Boolean(disabledReason), "data-testid": testId, onMouseDown: (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, onPointerDown: (event) => {
            event.preventDefault();
            event.stopPropagation();
        }, onClick: (event) => {
            if (!disabledReason) {
                onClick(event);
            }
        }, "aria-label": label, children: children }));
    if (!showTooltip) {
        return button;
    }
    return (_jsx(ControlHintTooltip, { title: disabledReason ?? label, side: "top", sideOffset: 2, children: _jsx("span", { className: "inline-flex shrink-0", children: button }) }));
}
export { TaskRowActionButton };
//# sourceMappingURL=task-row-action-button.js.map