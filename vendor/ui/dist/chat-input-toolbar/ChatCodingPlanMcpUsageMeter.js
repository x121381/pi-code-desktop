import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { InfoIcon } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { cn } from "@/components/lib/utils.js";
export function ChatCodingPlanMcpUsageMeter({ color, description, label, percentage, primaryQuotaCount, resetTime, value, }) {
    const boundedPercentage = Number.isFinite(percentage)
        ? Math.max(0, Math.min(100, percentage ?? 0))
        : 0;
    // MCP 不必无条件占据独立横行，只有一两张主额度时会浪费网格空位；
    // 主额度占满三列时才保留贯穿行，否则沿用普通额度卡片结构补入当前行。
    const fullRow = primaryQuotaCount >= 3;
    const progressWidth = fullRow ? "calc((100% - 1rem) / 3)" : undefined;
    const labelContent = (_jsxs("span", { className: "flex min-w-0 items-center gap-1", children: [_jsx("span", { className: "min-w-0 truncate text-foreground-subtle", children: label }), _jsx(ControlHintTooltip, { title: description, standalone: true, children: _jsx("button", { type: "button", "aria-label": description, className: "inline-flex size-4 shrink-0 items-center justify-center rounded-full text-foreground-subtle transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", "data-context-mcp-info": "true", children: _jsx(InfoIcon, { "aria-hidden": "true", className: "size-3.5" }) }) })] }));
    const valueContent = (_jsxs("span", { className: "min-w-0 truncate whitespace-nowrap tabular-nums", children: [_jsx("span", { className: "font-mono text-foreground", children: value }), resetTime ? _jsxs("span", { className: "text-ui-xs text-foreground-subtle", children: [" \u00B7 ", resetTime] }) : null] }));
    const progressContent = (_jsx("div", { className: cn("h-1.5 min-w-10 overflow-hidden rounded-full bg-surface-hover", fullRow ? "shrink-0" : undefined), style: progressWidth ? { width: progressWidth } : undefined, children: _jsx("div", { className: cn("h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none", boundedPercentage > 0 ? "min-w-1.5" : undefined), style: { backgroundColor: color, width: `${boundedPercentage}%` } }) }));
    if (!fullRow) {
        return (_jsxs("div", { className: "min-w-0 space-y-1.5", "data-context-mcp-layout": "card", "data-context-mcp-usage": "inline", "data-primary-quota-count": primaryQuotaCount, children: [_jsxs("div", { className: "min-w-0 space-y-0.5 text-ui-sm", children: [_jsx("div", { className: "flex min-h-5 min-w-0 items-center", children: labelContent }), _jsx("div", { className: "relative min-w-0 overflow-hidden text-ui-sm", children: valueContent })] }), progressContent] }));
    }
    return (_jsxs("div", { className: "col-span-3 mt-1 flex min-w-0 items-center gap-2 border-t border-border pt-1.5 text-ui-sm", "data-context-mcp-layout": "full-row", "data-context-mcp-usage": "inline", "data-primary-quota-count": primaryQuotaCount, children: [_jsx("span", { className: "shrink-0", children: labelContent }), _jsx("span", { className: "ml-auto min-w-0 shrink overflow-hidden text-ellipsis whitespace-nowrap", children: valueContent }), progressContent] }));
}
//# sourceMappingURL=ChatCodingPlanMcpUsageMeter.js.map