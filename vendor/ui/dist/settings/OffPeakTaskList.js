import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* 闲时任务列表（Figma「Automations - Task list Idle-time task」/ node 4866-1735）：
   2 列卡片网格，卡片结构与定时任务卡同源（MR 1622 设计）：标题 + 指令描述 +
   底部（moon + #N in queue 位次徽章）。按创建时间倒序；hover 菜单按状态收敛（D29/D30）。
   位次无 Est.（D30-1）。 */
import { useCallback, useEffect, useRef, useState, } from "react";
import { CircleCheck, Loader2, TriangleAlert } from "lucide-react";
import { TID_OFFPEAK_ACTION_CONTINUE, TID_OFFPEAK_ACTION_DELETE, TID_OFFPEAK_ACTION_PAUSE, TID_OFFPEAK_CARD, TID_OFFPEAK_CARD_SESSION, TID_OFFPEAK_CARD_MENU, } from "@zcode/shared";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { AutomationCancelActionIcon, AutomationContinueIcon, AutomationExternalLinkIcon, AutomationIdleTimeIcon, AutomationInfoIcon, AutomationMoreHorizontalIcon, AutomationPauseActionIcon, AutomationPausedIcon, AutomationTrashIcon, } from "../settings/AutomationDesignPrimitives.js";
import { resolveFailedOffPeakQueueFooter, resolveOffPeakStatusFooter, shouldShowOffPeakModelSelectionIssue, } from "../settings/offPeakUiPresentation.js";
// 按状态分组会让任务在运行和终态切换时跳位，破坏用户对已有卡片位置的预期；
// 列表只按不可变的创建时间倒序，状态变化不再影响顺序。
export function sortOffPeakTasksByCreatedAt(tasks) {
    return [...tasks].sort((a, b) => b.createdAt - a.createdAt);
}
/** 与 AutomationsSection 定时任务列表相同的滚动阈值（Figma 规范最多露出 8 张卡片）。 */
export const OFFPEAK_LIST_SCROLL_THRESHOLD = 8;
const OFFPEAK_MENU_HINT_MAX_WIDTH = 320;
const OFFPEAK_MENU_HINT_RIGHT_OFFSET = 16;
export function resolveOffPeakMenuHintSide(triggerRect, viewportWidth) {
    if (!triggerRect) {
        return "top";
    }
    return viewportWidth - triggerRect.right >=
        OFFPEAK_MENU_HINT_MAX_WIDTH + OFFPEAK_MENU_HINT_RIGHT_OFFSET
        ? "right"
        : "top";
}
function OffPeakMenuHint({ children, title }) {
    const triggerRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [side, setSide] = useState("right");
    const updateSide = useCallback(() => {
        // 提示入口位于菜单内部。窄窗口下 Radix 会把 right 自动翻到 left，
        // 左侧提示会穿过整个菜单；横向空间不足时改到菜单上方，避免提示与操作项互相覆盖。
        setSide(resolveOffPeakMenuHintSide(triggerRef.current?.getBoundingClientRect() ?? null, window.innerWidth));
    }, []);
    useEffect(() => {
        if (!open) {
            return;
        }
        updateSide();
        window.addEventListener("resize", updateSide);
        return () => window.removeEventListener("resize", updateSide);
    }, [open, updateSide]);
    return (_jsx(ControlHintTooltip, { title: title, open: open, onOpenChange: (nextOpen) => {
            if (nextOpen) {
                updateSide();
            }
            setOpen(nextOpen);
        }, triggerRef: triggerRef, side: side, align: side === "top" ? "end" : "center", sideOffset: OFFPEAK_MENU_HINT_RIGHT_OFFSET, className: "max-w-[min(20rem,calc(100vw-1rem))]", children: children }));
}
const STATUS_ICON = {
    moon: AutomationIdleTimeIcon,
    // 设计稿中 Paused 状态是圆形停止图标，旧双竖线会被误读为媒体暂停控件。
    pause: AutomationPausedIcon,
    spinner: Loader2,
    success: CircleCheck,
    warning: TriangleAlert,
    stopped: AutomationPausedIcon,
};
export function OffPeakTaskList({ tasks, busyOperationId, onOpen, onPause, onContinue, onCancel, onDelete, onOpenSession, }) {
    const { intl } = useZCodeIntl();
    const sorted = sortOffPeakTasksByCreatedAt(tasks);
    if (sorted.length === 0) {
        return (_jsx("div", { className: "rounded-[10px] border border-card-border px-3 py-3 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.list.empty" }) }));
    }
    return (_jsx("div", { className: cn("grid auto-rows-[132px] grid-cols-1 gap-x-4 gap-y-4 lg:grid-cols-2", 
        // 与定时任务列表同一口径：最多露出 8 张卡片，超出由 grid 自身滚动，避免页面无限拉长。
        sorted.length > OFFPEAK_LIST_SCROLL_THRESHOLD &&
            "max-h-[1198px] overflow-y-auto overscroll-contain lg:max-h-[606px]"), children: sorted.map((task) => {
            const footer = task.modelSelectionIssue && shouldShowOffPeakModelSelectionIssue(task.status)
                ? {
                    icon: "warning",
                    className: "text-warning",
                    labelId: "offPeak.modelSelection.repairRequired",
                }
                : resolveOffPeakStatusFooter(task);
            const FooterIcon = STATUS_ICON[footer.icon];
            const failedQueueFooter = resolveFailedOffPeakQueueFooter(task);
            const FailedQueueIcon = failedQueueFooter ? STATUS_ICON[failedQueueFooter.icon] : null;
            const busy = busyOperationId?.endsWith(task.offPeakTaskId) ?? false;
            const hasPrimaryMenuAction = task.status === "queued" || task.status === "paused" || task.status === "running";
            return (_jsxs("div", { "data-testid": TID_OFFPEAK_CARD, role: "button", tabIndex: 0, onClick: () => onOpen(task), onKeyDown: (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpen(task);
                    }
                }, className: cn(
                // inset surface shadow 不是 Card 描边语义，明暗主题下会与首页卡片产生色差。
                "group relative flex h-full min-h-0 cursor-pointer gap-3 overflow-hidden rounded-[10px] border border-card-border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", 
                // 完成态保持整体置灰，但仍需用 hover 背景反馈卡片可点击、更多菜单可操作。
                task.status === "completed" ? "opacity-60 hover:bg-hover" : "hover:bg-hover"), children: [_jsxs("div", { className: "flex h-full min-w-0 flex-1 flex-col gap-3", children: [_jsx("span", { className: "block truncate pr-14 text-ui-base font-medium leading-5 text-foreground", children: task.title || task.prompt }), _jsx("p", { className: "line-clamp-2 h-9 text-ui-base font-normal leading-snug text-foreground-subtle", children: task.prompt }), _jsxs("div", { className: "mt-auto flex h-6 min-w-0 items-center gap-[10px] text-ui-base leading-snug", children: [_jsxs("div", { className: cn("flex w-fit shrink-0 items-center gap-0.5 font-normal", footer.className, (task.status === "queued" || task.status === "paused") &&
                                            // Zai Dark 的 brand 是白色，闲时排队 Tag 必须使用设计稿专用紫色语义。
                                            "rounded-[8px] bg-idle-task-surface py-0.5 pl-1 pr-2 text-idle-task"), children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(FooterIcon, { className: cn("size-4 shrink-0", task.status === "running" && "animate-spin"), strokeWidth: 1.33, "aria-hidden": "true" }) }), _jsx("span", { className: "truncate", children: intl.formatMessage({ id: footer.labelId }, footer.labelValues) })] }), failedQueueFooter && FailedQueueIcon ? (_jsxs("div", { className: "flex w-fit shrink-0 items-center gap-0.5 rounded-[6px] bg-idle-task-surface py-0.5 pl-1 pr-2 text-idle-task opacity-40", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(FailedQueueIcon, { className: "size-4 shrink-0", strokeWidth: 1.33, "aria-hidden": "true" }) }), _jsx("span", { className: "truncate", children: intl.formatMessage({ id: failedQueueFooter.labelId }, failedQueueFooter.labelValues) })] })) : null, task.sessionTitle ? (_jsx("span", { "data-testid": TID_OFFPEAK_CARD_SESSION, className: "ml-auto min-w-0 truncate text-foreground-subtle", title: task.sessionTitle, children: intl.formatMessage({ id: "offPeak.boundSession.label" }, { title: task.sessionTitle }) })) : null] })] }), _jsxs("div", { className: "absolute right-3 top-3 flex items-center gap-1", children: [task.sessionId ? (_jsx("button", { type: "button", className: "flex size-6 items-center justify-center rounded-md opacity-100 transition-colors hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100", "aria-label": intl.formatMessage({
                                    id: "offPeak.goToSession",
                                }), onClick: (event) => {
                                    event.stopPropagation();
                                    onOpenSession(task);
                                }, children: _jsx(AutomationExternalLinkIcon, { className: "size-4 text-foreground-subtle", "aria-hidden": "true" }) })) : null, _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { type: "button", className: "flex size-6 items-center justify-center rounded-md opacity-100 transition-colors hover:bg-white/10 md:opacity-0 md:group-hover:opacity-100 data-[state=open]:bg-white/10 data-[state=open]:opacity-100", "data-testid": TID_OFFPEAK_CARD_MENU, "aria-label": intl.formatMessage({
                                                id: "automations.moreActions",
                                            }), disabled: busy, onClick: (event) => event.stopPropagation(), children: _jsx(AutomationMoreHorizontalIcon, { className: "size-4 text-foreground-subtle", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", sideOffset: 4, className: "w-[190px]", onClick: (event) => event.stopPropagation(), children: [task.status === "queued" ? (_jsxs(DropdownMenuItem, { className: "gap-1", "data-testid": TID_OFFPEAK_ACTION_PAUSE, onSelect: () => onPause(task), children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: _jsx(AutomationPauseActionIcon, { className: "size-4", "aria-hidden": "true" }) }), _jsx("span", { className: "flex-1", children: intl.formatMessage({ id: "offPeak.action.pause" }) }), _jsx(OffPeakMenuHint, { title: intl.formatMessage({
                                                            id: "offPeak.action.pauseHint",
                                                        }), children: _jsx("span", { className: "inline-flex", onClick: (event) => event.stopPropagation(), children: _jsx(AutomationInfoIcon, { className: "size-3.5 shrink-0 text-foreground-subtle", "aria-hidden": "true" }) }) })] })) : null, task.status === "paused" ? (_jsxs(DropdownMenuItem, { className: "gap-1", "data-testid": TID_OFFPEAK_ACTION_CONTINUE, onSelect: () => onContinue(task), children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: _jsx(AutomationContinueIcon, { className: "size-4", "aria-hidden": "true" }) }), _jsx("span", { className: "flex-1", children: intl.formatMessage({
                                                            id: "offPeak.action.continue",
                                                        }) }), _jsx(OffPeakMenuHint, { title: intl.formatMessage({
                                                            id: "offPeak.action.continueHint",
                                                        }), children: _jsx("span", { className: "inline-flex", onClick: (event) => event.stopPropagation(), children: _jsx(AutomationInfoIcon, { className: "size-3.5 shrink-0 text-foreground-subtle", "aria-hidden": "true" }) }) })] })) : null, task.status === "running" ? (_jsxs(DropdownMenuItem, { className: "gap-1", onSelect: () => onCancel(task), children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: _jsx(AutomationCancelActionIcon, { className: "size-4 fill-current", "aria-hidden": "true" }) }), intl.formatMessage({ id: "offPeak.action.cancel" })] })) : null, hasPrimaryMenuAction ? _jsx(DropdownMenuSeparator, {}) : null, _jsxs(DropdownMenuItem, { className: "gap-1 !text-destructive data-[highlighted]:!bg-menu-hover data-[highlighted]:!text-destructive focus:!text-destructive [&_svg]:!text-destructive", "data-testid": TID_OFFPEAK_ACTION_DELETE, onSelect: () => onDelete(task), children: [_jsx(AutomationTrashIcon, {}), intl.formatMessage({ id: "automations.delete" })] })] })] })] })] }, task.offPeakTaskId));
        }) }));
}
//# sourceMappingURL=OffPeakTaskList.js.map