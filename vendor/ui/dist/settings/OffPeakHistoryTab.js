import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* 闲时任务 History tab（spec §5 / Figma 4866-2819 · 4866-3106 空态）：
   一行汇总一次完整执行（3h 续跑分段对用户透明，D30-6）：Instructions / Triggered /
   Status / Duration + 行菜单 Go to session / Delete；无执行记录 → 「No history yet.」 */
import { isOffPeakTerminalStatus } from "@zcode/shared";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { formatDateTime } from "@/settings/automationFormat.js";
import { AutomationExternalLinkIcon, AutomationHistoryEmptyState, AutomationMoreHorizontalIcon, AutomationTrashIcon, } from "@/settings/AutomationDesignPrimitives.js";
// 状态用「圆点 + 彩色文字」呈现（Scheduled 历史表密度规格）。
const STATUS_INDICATOR_CLASS = {
    succeeded: { dot: "bg-success", text: "text-success" },
    failed: { dot: "bg-destructive", text: "text-destructive" },
    skipped: { dot: "bg-foreground-subtlest", text: "text-foreground-subtle" },
    running: { dot: "bg-brand", text: "text-brand" },
};
export function resolveOffPeakHistoryStatus(task) {
    if (task.status === "completed")
        return "succeeded";
    if (task.status === "failed")
        return "failed";
    if (task.status === "cancelled")
        return "skipped";
    return "running";
}
export function OffPeakHistoryTab({ task, onOpenSession, onDelete, }) {
    const { intl } = useZCodeIntl();
    // 执行记录 = 首段派发起跑过（startedAt 存在）；纯排队/暂停中的任务无历史。
    if (!task?.startedAt || task.historyDeletedAt !== undefined) {
        return (_jsx(AutomationHistoryEmptyState, { children: intl.formatMessage({ id: "offPeak.history.empty" }) }));
    }
    const status = resolveOffPeakHistoryStatus(task);
    const endAt = isOffPeakTerminalStatus(task.status)
        ? (task.endedAt ?? Date.now())
        : Date.now();
    const durationMin = Math.max(1, Math.round((endAt - task.startedAt) / 60_000));
    return (_jsx("div", { className: "overflow-x-auto rounded-[8px]", children: _jsxs("table", { className: "w-full text-left text-ui-base font-normal leading-snug tracking-[-0.08px]", children: [_jsx("thead", { className: "bg-surface text-foreground-subtle", children: _jsxs("tr", { className: "h-[30px] border-b border-border", children: [_jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({ id: "offPeak.history.col.instructions" }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({ id: "automations.runs.col.triggered" }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({ id: "automations.runs.col.status" }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({ id: "automations.runs.col.duration" }) }), _jsx("th", { className: "px-4 font-normal" })] }) }), _jsx("tbody", { children: _jsxs("tr", { className: "h-[46px] transition-colors hover:bg-surface-hover", children: [_jsx("td", { className: "max-w-64 truncate px-4 text-foreground-subtle", title: task.prompt, children: task.prompt }), _jsx("td", { className: "whitespace-nowrap px-4 text-foreground-subtle", children: formatDateTime(task.startedAt) }), _jsx("td", { className: "px-4", children: _jsxs("span", { className: "flex items-center text-ui-base leading-5 tracking-[-0.18px]", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx("span", { className: cn("inline-block size-1.5 rounded-full", STATUS_INDICATOR_CLASS[status].dot) }) }), _jsx("span", { className: STATUS_INDICATOR_CLASS[status].text, children: intl.formatMessage({
                                                id: `automations.runs.status.${status}`,
                                            }) })] }) }), _jsx("td", { className: "whitespace-nowrap px-4 text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.history.durationMinutes" }, { count: durationMin }) }), _jsx("td", { className: "px-4", children: _jsx("div", { className: "flex items-center justify-end", children: _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { type: "button", "aria-label": intl.formatMessage({
                                                        id: "automations.moreActions",
                                                    }), className: "flex size-6 items-center justify-center rounded-[6px] text-foreground-subtle transition-colors hover:bg-white/10 hover:text-foreground data-[state=open]:bg-white/10 data-[state=open]:text-foreground", children: _jsx(AutomationMoreHorizontalIcon, { className: "size-4", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "start", alignOffset: -10, sideOffset: 4, collisionPadding: 8, className: "flex w-[160px] min-w-[160px] flex-col gap-0.5 border-0 px-1 py-1.5", children: [task.sessionId && onOpenSession ? (_jsxs(DropdownMenuItem, { className: "min-h-9 gap-1 rounded-md p-2 text-ui-base leading-5 tracking-[-0.18px]", onSelect: () => onOpenSession(task), children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(AutomationExternalLinkIcon, { className: "size-4", "aria-hidden": "true" }) }), intl.formatMessage({ id: "offPeak.goToSession" })] })) : null, task.sessionId && onOpenSession && onDelete ? (_jsx(DropdownMenuSeparator, { className: "m-0 h-px w-full" })) : null, onDelete ? (_jsxs(DropdownMenuItem, { variant: "destructive", className: "min-h-9 gap-1 p-2 text-ui-base leading-5 tracking-[-0.18px]", onSelect: () => onDelete(task), children: [_jsx(AutomationTrashIcon, {}), intl.formatMessage({ id: "offPeak.history.delete" })] })) : null] })] }) }) })] }) })] }) }));
}
//# sourceMappingURL=OffPeakHistoryTab.js.map