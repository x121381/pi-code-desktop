import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const DEFAULT_TEMPLATE_SKELETON_CARD_KEYS = [
    "template-skeleton-1",
    "template-skeleton-2",
    "template-skeleton-3",
    "template-skeleton-4",
];
export function AutomationTemplateSkeletonGrid({ label }) {
    return (_jsxs("div", { role: "status", className: "grid grid-cols-1 gap-4 sm:grid-cols-2", children: [_jsx("span", { className: "sr-only", children: label }), DEFAULT_TEMPLATE_SKELETON_CARD_KEYS.map((key) => (_jsxs("div", { "data-automation-template-skeleton-card": true, "aria-hidden": "true", className: "motion-safe:animate-pulse flex min-h-[114px] flex-col gap-2 rounded-xl border border-card-border bg-background p-3", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "size-5 shrink-0 rounded-md bg-surface" }), _jsx("span", { className: "h-5 w-1/2 rounded-md bg-surface" })] }), _jsxs("div", { className: "flex flex-1 flex-col gap-2", children: [_jsx("span", { className: "h-5 w-full rounded-md bg-surface" }), _jsx("span", { className: "h-5 w-3/4 rounded-md bg-surface" })] }), _jsx("span", { className: "h-5 w-1/2 rounded-md bg-surface" })] }, key)))] }));
}
//# sourceMappingURL=AutomationTemplateSkeletonGrid.js.map