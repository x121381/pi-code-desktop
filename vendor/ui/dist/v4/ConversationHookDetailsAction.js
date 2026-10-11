import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useMemo, useState } from "react";
import { AnchorIcon, CircleSlash2Icon, CircleXIcon, ClockAlertIcon, LoaderCircleIcon, ShieldAlertIcon, } from "lucide-react";
import { TID_V4_HOOK_DETAILS_CONTENT, TID_V4_HOOK_DETAILS_TRIGGER, testId } from "@zcode/shared";
import { cn } from "../components/lib/utils.js";
import { Button } from "../components/ui/button.js";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
function buildHookDetailItems(rows) {
    const items = [];
    for (const row of rows) {
        for (const execution of row.executions.toSorted((left, right) => left.hookIndex - right.hookIndex)) {
            if (!execution.didExecute)
                continue;
            items.push({
                key: `${row.entityId}:${execution.hookRunId}`,
                ...(execution.outcome === "blocked" && execution.blockReason
                    ? { blockReason: execution.blockReason }
                    : {}),
                ...(execution.state !== "running" && execution.durationMs !== undefined
                    ? { durationMs: execution.durationMs }
                    : {}),
                eventName: row.hookEventName,
                sourceKind: execution.sourceKind,
                status: hookDetailStatus(execution),
            });
        }
    }
    return items;
}
function formatHookDuration(durationMs) {
    const roundedDurationMs = Math.max(0, Math.round(durationMs));
    if (roundedDurationMs < 1000)
        return `${roundedDurationMs}ms`;
    return `${(roundedDurationMs / 1000).toFixed(roundedDurationMs < 10_000 ? 2 : 1)}s`;
}
function hookDetailStatus(execution) {
    if (execution.state === "running")
        return "running";
    if (execution.outcome === "timed_out")
        return "timedOut";
    if (execution.outcome === "cancelled")
        return "cancelled";
    if (execution.outcome === "blocked")
        return "blocked";
    if (execution.state === "failed" || execution.outcome === "failed")
        return "failed";
    return null;
}
const HookStatusIcon = memo(function HookStatusIcon({ status }) {
    if (status === "running") {
        return (_jsx(LoaderCircleIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 animate-spin text-foreground-subtle motion-reduce:animate-none" }));
    }
    if (status === "blocked") {
        return _jsx(ShieldAlertIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-warning" });
    }
    if (status === "timedOut") {
        return _jsx(ClockAlertIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-warning" });
    }
    if (status === "cancelled") {
        return _jsx(CircleSlash2Icon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-foreground-subtle" });
    }
    return _jsx(CircleXIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-destructive" });
});
const HookDetailItemRow = memo(function HookDetailItemRow({ item }) {
    const { intl } = useZCodeIntl();
    const sourceLabel = intl.formatMessage({ id: `chat.hooks.source.${item.sourceKind}` });
    const durationLabel = item.durationMs === undefined ? null : formatHookDuration(item.durationMs);
    return (_jsx("li", { className: "min-w-0 px-3 py-1.5 text-ui-sm", children: _jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "min-w-0 flex-1 break-words font-mono text-foreground", children: item.eventName }), _jsxs("div", { className: "flex min-w-0 flex-wrap items-center justify-end gap-2 text-ui-xs text-foreground-subtle", children: [_jsx("span", { children: sourceLabel }), durationLabel ? _jsx("span", { className: "text-foreground-subtlest", children: durationLabel }) : null, item.status ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-1", children: [_jsx(HookStatusIcon, { status: item.status }), intl.formatMessage({ id: `chat.hooks.state.${item.status}` }), item.blockReason ? (_jsxs("span", { className: "min-w-0 break-words text-warning", children: ["\uFF1A", item.blockReason] })) : null] })) : null] })] }) }));
});
export const ConversationHookDetailsAction = memo(function ConversationHookDetailsAction({ className, rows, turnId, }) {
    const { intl } = useZCodeIntl();
    const [open, setOpen] = useState(false);
    const items = useMemo(() => buildHookDetailItems(rows), [rows]);
    if (items.length === 0)
        return null;
    const label = intl.formatMessage({ id: "chat.hooks.label" });
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsxs(Tooltip, { open: open ? false : undefined, children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": label, className: cn(className), "data-testid": testId(TID_V4_HOOK_DETAILS_TRIGGER, turnId), children: [_jsx(AnchorIcon, { className: "size-3.5" }), _jsx("span", { className: "sr-only", children: label })] }) }) }), _jsx(TooltipContent, { side: "bottom", children: label })] }), _jsxs(PopoverContent, { align: "start", side: "top", sideOffset: 6, collisionPadding: 16, sticky: "always", onOpenAutoFocus: (event) => event.preventDefault(), style: {
                    maxHeight: "min(20rem, var(--radix-popover-content-available-height))",
                }, className: "w-80 max-w-[calc(100vw-2rem)] gap-0 overflow-hidden border-popover-border p-0", "data-testid": testId(TID_V4_HOOK_DETAILS_CONTENT, turnId), children: [_jsx("div", { className: "shrink-0 border-b border-border px-3 py-2", children: _jsx("h3", { className: "text-ui-base font-medium text-foreground", children: label }) }), _jsx("ul", { className: "min-h-0 overflow-y-auto py-0.5", children: items.map((item) => (_jsx(HookDetailItemRow, { item: item }, item.key))) })] })] }));
});
//# sourceMappingURL=ConversationHookDetailsAction.js.map