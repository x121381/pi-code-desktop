import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible.js";
import { Badge } from "@/components/ui/badge.js";
export function AssistantDetailCard({ icon: Icon, label, summary, trailing, children, }) {
    return (_jsxs(Collapsible, { "data-trajectory-assistant-detail-card": "", "data-trajectory-message-expanded-card": "", className: "group rounded-md bg-surface", children: [_jsxs(CollapsibleTrigger, { "aria-label": label, className: "flex min-h-7 w-full min-w-0 items-center gap-1.5 rounded-md px-2 py-1 text-left text-ui-sm text-foreground-subtle transition-colors hover:bg-hover", children: [_jsxs("span", { className: "flex size-4 shrink-0 items-center justify-center text-foreground-subtlest", children: [_jsx(Icon, { className: "size-3.5 group-hover:hidden" }), _jsx(ChevronRightIcon, { className: "hidden size-3.5 group-hover:block group-data-[state=open]:hidden" }), _jsx(ChevronDownIcon, { className: "hidden size-3.5 group-data-[state=open]:group-hover:block" })] }), _jsx("span", { className: "min-w-0 flex-1 truncate font-mono text-foreground-subtlest", children: summary }), trailing ? (_jsx(Badge, { "data-trajectory-assistant-detail-id": "", variant: "outline", className: "max-w-[40%] truncate font-mono text-foreground-subtle", title: typeof trailing === "string" ? trailing : undefined, children: trailing })) : null] }), _jsx(CollapsibleContent, { children: _jsx("div", { className: "min-w-0 px-2 pb-2 pt-1", children: children }) })] }));
}
export function contentSummary(content) {
    return (content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .find(Boolean) ?? "—");
}
//# sourceMappingURL=ModelTrajectoryAssistantDetailCard.js.map