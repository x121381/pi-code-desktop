import { jsx as _jsx } from "react/jsx-runtime";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { cn } from "../lib/utils.js";
function Collapsible({ ...props }) {
    return _jsx(CollapsiblePrimitive.Root, { "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({ ...props }) {
    return _jsx(CollapsiblePrimitive.CollapsibleTrigger, { "data-slot": "collapsible-trigger", ...props });
}
function CollapsibleContent({ className, children, ...props }) {
    return (_jsx(CollapsiblePrimitive.CollapsibleContent, { "data-slot": "collapsible-content", className: cn("group/collapsible-content overflow-hidden", "data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up data-[state=closed]:[animation-fill-mode:forwards] transition-none duration-300 ease-in-out", className), ...props, children: _jsx("div", { className: cn("transition-none duration-300 ease-in-out", "group-data-[state=open]/collapsible-content:animate-in group-data-[state=open]/collapsible-content:fade-in-0", "group-data-[state=closed]/collapsible-content:animate-out group-data-[state=closed]/collapsible-content:fade-out-0 group-data-[state=closed]/collapsible-content:[animation-fill-mode:forwards]"), children: children }) }));
}
export { Collapsible, CollapsibleTrigger, CollapsibleContent };
//# sourceMappingURL=collapsible.js.map