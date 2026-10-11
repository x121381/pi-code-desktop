import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 定时任务编辑整页集中维护 Settings/History 两个 tab、cron builder、项目/模型选择器与运行历史，集中更利于交互一致。 */
import { useStartPlanRecommendation } from "../hooks/useStartPlanRecommendation.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { completeNewModelSelection } from "@zcode/provider";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, FolderOpen, MessageCircle, X, } from "lucide-react";
import { resolveWorkspaceKey, testId, TID_AUTOMATION_CUSTOM_CONFIRM, TID_AUTOMATION_CUSTOM_INTERVAL_DECREMENT, TID_AUTOMATION_CUSTOM_INTERVAL_INCREMENT, TID_AUTOMATION_CUSTOM_INTERVAL_SELECT, TID_AUTOMATION_CUSTOM_REPEAT_EDIT, TID_AUTOMATION_CUSTOM_UNIT_OPTION, TID_AUTOMATION_CUSTOM_UNIT_SELECT, TID_AUTOMATION_FORM_PROMPT, TID_AUTOMATION_FORM_SUBMIT, TID_AUTOMATION_FORM_TITLE, TID_AUTOMATION_FREQUENCY_OPTION, TID_AUTOMATION_FREQUENCY_SELECT, TID_AUTOMATION_RUN_NOW, TID_AUTOMATION_SCHEDULE_ADD, TID_AUTOMATION_SCHEDULE_DELETE, TID_AUTOMATION_SCHEDULE_PREVIEW, TID_AUTOMATION_YEAR_DAY_OPTION, TID_AUTOMATION_YEAR_MONTH_OPTION, TID_AUTOMATION_YEAR_MONTHDAY, ZCODE_AGENT_PROVIDER, } from "@zcode/shared";
import { AutomationAddScheduleIcon, AutomationChevronDownIcon, AutomationContinueIcon, AutomationExternalLinkIcon, AUTOMATION_FORM_FIELD_CLASSNAME, AutomationHistoryEmptyState, AutomationMoreHorizontalIcon, AutomationPauseActionIcon, AutomationRunNowIcon, AutomationSettingsHistoryTabs, AutomationTrashIcon, } from "../settings/AutomationDesignPrimitives.js";
import { AUTOMATION_FORM_INPUT_TYPOGRAPHY_CLASSNAME, AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, AutomationInstructionsComposer, AutomationInstructionsTextarea, AutomationInstructionsToolbar, } from "../settings/AutomationInstructionsComposer.js";
import { SettingsBreadcrumbReporter } from "../settings/SettingsHeaderBreadcrumb.js";
import { Button } from "../components/ui/button.js";
import { toast } from "../components/ui/toast.js";
import { Input } from "../components/ui/input.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../components/ui/select.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { Spinner } from "../components/ui/spinner.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "../components/ui/tooltip.js";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover.js";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { ScrollArea } from "../components/ui/scroll-area.js";
import { cn } from "../components/lib/utils.js";
import { SETTINGS_FRAME_CONTENT_CLASSNAME } from "../settings/SettingsPageParts.js";
import { resolveLocalizedAutomationCreateTitle } from "../settings/automationEditLocalizedTitle.js";
import { ModelConfigSelect } from "../ModelConfigSelect.js";
import { ThoughtLevelCycleControl } from "../chat-input-toolbar/ThoughtLevelCycleControl.js";
import { ConfigSelect } from "../chat-input-toolbar/display.js";
import { ChatEmptyWorkspacePreviewMenu } from "../ChatEmptyState.js";
import { AUTOMATION_DEFAULT_MODE, buildAutomationModelSelectGroups, buildAutomationModeOption, buildAutomationThoughtLevelOption, resolveAutomationModelItem, resolveAutomationModelTriggerLabel, resolveAutomationPreferredModelValue, } from "../settings/automationAgentConfigOptions.js";
import { resolveChangedAutomationEditFields, } from "../settings/automationEditDirtyState.js";
import { clearAutomationEditRequiredFieldError, resolveAutomationEditRequiredFieldErrors, } from "../settings/automationEditValidation.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { useConfirmDialog } from "../hooks/useConfirmDialog.js";
import { useAutomationProjectOptions } from "../hooks/useAutomationProjectOptions.js";
import { useModelSelectionView } from "../hooks/useModelSelectionView.js";
import { resolveModelThoughtOption } from "../lib/modelThoughtOption.js";
import { decodeCustomModelValue, encodeCustomModelValue } from "../lib/zcodeCustomModelValue.js";
import { parseModelPickerValue } from "../lib/zcodeSessionProjection.js";
import { startUserAction } from "../lib/userActionTelemetry.js";
import { logger } from "../logger.js";
import { findAutomationWorkspaceOptionByKey, reconcileAutomationWorkspaceSelectionKey, resolveAutomationWorkspaceSelectionKey, } from "../settings/automationWorkspaceOptions.js";
import { buildCronExpr, canVisualizeCronInAutomationEditor, describeCronBuilder, formatDateTime, formatDuration, formatGmtOffset, isSessionCreatedAutomation as resolveIsSessionCreatedAutomation, parseCronToBuilder, resolveAutomationStatusKind, WEEKDAY_ORDER, } from "../settings/automationFormat.js";
const MODEL_ITEM_NEVER_LOCKED = () => false;
const FREQUENCIES = ["hourly", "daily", "weekdays", "weekly", "monthly", "custom"];
const isCronFrequency = (value) => FREQUENCIES.includes(value);
/** 运行历史每页条数。 */
const RUNS_PAGE_SIZE = 8;
/** 自定义重复频率输入允许输入的视觉范围。 */
const CUSTOM_REPEAT_INTERVAL_INPUT_MIN = 0;
/** cron 的步长必须为正整数，0 不能形成有效调度。 */
const CUSTOM_REPEAT_INTERVAL_SCHEDULABLE_MIN = 1;
const CUSTOM_REPEAT_INTERVAL_MAX = 200;
/**
 * 生成分页控件的页码序列：首尾各保留 3 页、当前页左右各 1 页，其余用省略号折叠。
 * 例：current=1,total=10 → [1,2,3,"ellipsis",8,9,10]。
 */
function buildRunsPageItems(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }
    const pages = new Set([
        1,
        2,
        3,
        total - 2,
        total - 1,
        total,
        current - 1,
        current,
        current + 1,
    ]);
    const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);
    const items = [];
    let previous = 0;
    for (const page of sorted) {
        if (previous && page - previous > 1) {
            items.push("ellipsis");
        }
        items.push(page);
        previous = page;
    }
    return items;
}
function workspaceLabelFromPath(path) {
    return path.replace(/\\/g, "/").split("/").filter(Boolean).pop() ?? path;
}
function pad2(value) {
    return String(value).padStart(2, "0");
}
const CUSTOM_REPEAT_SELECT_CONTENT_CLASS = "w-[var(--radix-select-trigger-width)] px-0 py-1.5 [&_[data-position=popper]]:px-1 [&_[data-slot=select-scroll-up-button]]:hidden [&_[data-slot=select-scroll-down-button]]:hidden";
const CUSTOM_REPEAT_SELECT_ITEM_CLASS = "min-h-8 rounded-[8px] px-2 py-1.5 pr-8 text-ui-base leading-5 text-foreground-subtle data-[highlighted]:bg-menu-hover data-[highlighted]:text-foreground data-[state=checked]:bg-menu-hover data-[state=checked]:text-foreground";
function CustomRepeatSelectIndicator() {
    return (_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", "aria-hidden": "true", children: _jsx(ChevronDown, { className: "size-4", strokeWidth: 2 }) }));
}
function CustomRepeatCalendarIcon({ className }) {
    return _jsx(CalendarDays, { className: className, strokeWidth: 2 });
}
/**
 * 时间选择的单列滚动列表（小时或分钟），选中项打开时自动滚动到可见位置。
 * 时间选项属于常用交互控件，不应沿用仅用于徽标和紧凑标签的最小字号 token。
 * 已选时间属于菜单选中态，不是主操作按钮；使用菜单 hover 语义避免 Light 主题下出现突兀黑块。
 */
function TimeUnitColumn({ count, selected, onSelect, }) {
    const selectedRef = useRef(null);
    useEffect(() => {
        selectedRef.current?.scrollIntoView({ block: "center" });
    }, []);
    return (_jsx(ScrollArea, { className: "h-52 w-14 shrink-0", children: _jsx("div", { className: "flex flex-col gap-0.5 p-1", children: Array.from({ length: count }, (_, value) => value).map((value) => (_jsx("button", { ref: value === selected ? selectedRef : undefined, type: "button", onClick: () => onSelect(value), className: cn("rounded-md px-2 py-1 text-center text-ui-base tabular-nums transition-colors", value === selected
                    ? "bg-menu-hover text-foreground"
                    : "text-foreground-subtle hover:bg-menu-hover hover:text-foreground"), children: pad2(value) }, value))) }) }));
}
/**
 * HH:MM 时间选择器：一个 pill 触发器 + 弹层内小时/分钟两列滚动选择。
 * 时间选择触发器属于常用交互控件，应使用正文基准字号 text-ui-base。
 */
function TimeOfDayPicker({ hour, minute, onChange, ariaLabel, }) {
    const [open, setOpen] = useState(false);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", "aria-label": ariaLabel, className: "inline-flex h-auto items-center gap-1 rounded-full bg-hover py-px pl-2 pr-1.5 text-ui-base leading-5 tabular-nums text-foreground transition-colors hover:bg-selected focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused", children: [pad2(hour), ":", pad2(minute), _jsx("span", { className: "shrink-0 text-foreground-subtle", children: _jsx(AutomationChevronDownIcon, {}) })] }) }), _jsxs(PopoverContent, { align: "start", side: "bottom", sideOffset: 4, className: "w-29 flex-row gap-0 p-0", children: [_jsx(TimeUnitColumn, { count: 24, selected: hour, onSelect: (value) => onChange(value, minute) }), _jsx("div", { className: "w-px shrink-0 bg-border" }), _jsx(TimeUnitColumn, { count: 60, selected: minute, onSelect: (value) => onChange(hour, value) })] })] }));
}
/** 月/日单列滚动列表（1-based 值），样式对齐 TimeUnitColumn。 */
function ScrollNumberColumn({ values, selected, onSelect, buttonTestIdPrefix, }) {
    const selectedRef = useRef(null);
    useEffect(() => {
        selectedRef.current?.scrollIntoView({ block: "center" });
    }, []);
    return (_jsx(ScrollArea, { className: "h-52 w-14 shrink-0", children: _jsx("div", { className: "flex flex-col gap-0.5 p-1", children: values.map((value) => (_jsx("button", { ref: value === selected ? selectedRef : undefined, type: "button", "data-testid": buttonTestIdPrefix ? testId(buttonTestIdPrefix, String(value)) : undefined, onClick: () => onSelect(value), className: cn("rounded-md px-2 py-1 text-center text-ui-sm tabular-nums transition-colors", value === selected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground-subtle hover:bg-surface-hover"), children: pad2(value) }, value))) }) }));
}
/** 某月天数（用闰年 2024 作参照，使 2 月可选到 29）；month 为 1-12。 */
function daysInMonth(month) {
    return new Date(2024, month, 0).getDate();
}
/**
 * 月/日选择器（custom → yearly 用）：一个 pill 触发器 + 弹层内月/日两列滚动选择，
 * 样式与 TimeOfDayPicker 对齐。切月后当前日超过该月最大天数时自动收敛。
 */
function MonthDayPicker({ month, day, intl, onChange, }) {
    const [open, setOpen] = useState(false);
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    const days = Array.from({ length: daysInMonth(month) }, (_, index) => index + 1);
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-testid": TID_AUTOMATION_YEAR_MONTHDAY, "aria-label": intl.formatMessage({
                        id: "automations.form.schedule.yearDateLabel",
                    }), className: "inline-flex h-auto items-center gap-1 rounded-full bg-hover py-px pl-2 pr-1.5 text-ui-base leading-5 tabular-nums text-foreground transition-colors hover:bg-selected focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused", children: [intl.formatMessage({ id: "automations.form.schedule.monthDayValue" }, { month: String(month), day: String(day) }), _jsx("span", { className: "shrink-0 text-foreground-subtle", children: _jsx(AutomationChevronDownIcon, {}) })] }) }), _jsxs(PopoverContent, { align: "start", side: "bottom", sideOffset: 4, className: "w-29 flex-row gap-0 p-0", children: [_jsx(ScrollNumberColumn, { values: months, selected: month, buttonTestIdPrefix: TID_AUTOMATION_YEAR_MONTH_OPTION, onSelect: (value) => onChange(value, Math.min(day, daysInMonth(value))) }), _jsx("div", { className: "w-px shrink-0 bg-border" }), _jsx(ScrollNumberColumn, { values: days, selected: day, buttonTestIdPrefix: TID_AUTOMATION_YEAR_DAY_OPTION, onSelect: (value) => onChange(month, value) })] })] }));
}
/** 每周日期选择：保持语句式 trigger，并禁止清空最后一个日期。 */
function WeekdayPicker({ weekdays, intl, onChange, }) {
    const label = WEEKDAY_ORDER.filter((day) => weekdays.includes(day))
        .map((day) => intl.formatMessage({ id: `automations.weekday.${day}` }))
        .join(intl.formatMessage({ id: "automations.weekday.separator" }));
    return (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", "aria-label": intl.formatMessage({
                        id: "automations.form.schedule.weekdaysLabel",
                    }), 
                    // 星期多选 trigger 与同层频率、时间 tag 使用相同高亮，避免亮度不一致。
                    className: "inline-flex h-auto max-w-full items-center gap-0.5 rounded-full bg-hover py-px pl-2 pr-0.5 text-ui-base leading-5 text-foreground transition-colors hover:bg-selected data-[state=open]:bg-selected focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-input-border-focused", children: [_jsx("span", { className: "truncate", children: label }), _jsx(AutomationChevronDownIcon, {})] }) }), _jsx(PopoverContent, { align: "start", sideOffset: 4, className: "w-40 p-1", children: WEEKDAY_ORDER.map((day) => {
                    const active = weekdays.includes(day);
                    return (_jsxs("button", { type: "button", onClick: () => {
                            if (active && weekdays.length === 1)
                                return;
                            onChange(active ? weekdays.filter((candidate) => candidate !== day) : [...weekdays, day]);
                        }, className: "flex h-7 w-full items-center gap-2 rounded-md px-2 text-left text-ui-base text-foreground transition-colors hover:bg-menu-hover", children: [_jsx("span", { className: "min-w-0 flex-1 truncate", children: intl.formatMessage({ id: `automations.weekday.${day}` }) }), _jsx("span", { className: "flex size-4 shrink-0 items-center justify-center", children: active ? _jsx(Check, { className: "size-3.5", "aria-hidden": "true" }) : null })] }, day));
                }) })] }));
}
function toDateInputValue(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date(Date.now() + 24 * 60 * 60 * 1_000);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}
function localDateEndTimestamp(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
        return undefined;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 23, 59, 59, 999);
    return Number.isNaN(date.getTime()) ? undefined : date.getTime();
}
function parseDateInputValue(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match)
        return null;
    const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return Number.isNaN(date.getTime()) ? null : date;
}
function EndDatePicker({ disabled, intl, min, onChange, value, }) {
    const [open, setOpen] = useState(false);
    const selectedDate = parseDateInputValue(value);
    const minDate = parseDateInputValue(min);
    const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? minDate ?? new Date());
    useEffect(() => {
        if (open && selectedDate)
            setVisibleMonth(selectedDate);
    }, [open, selectedDate?.getTime()]);
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayValue = toDateInputValue(Date.now());
    const monthLabel = intl.formatMessage({ id: "automations.customRepeat.monthLabel" }, { year: String(year), month: String(month + 1) });
    return (_jsxs(Popover, { open: open, onOpenChange: setOpen, children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs("button", { type: "button", disabled: disabled, className: "inline-flex h-9 w-[135px] items-center justify-center gap-1.5 rounded-lg border border-input-border bg-input pl-3 pr-3.5 text-ui-base font-normal leading-5 tracking-[-0.18px] text-foreground transition-colors hover:border-input-border-hover hover:bg-input/80 data-[state=open]:border-input-border-hover data-[state=open]:bg-input/80 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-input-border disabled:hover:bg-input", children: [_jsx(CustomRepeatCalendarIcon, { className: "size-5 shrink-0 text-foreground-subtle" }), _jsx("span", { className: "tabular-nums", children: selectedDate
                                ? `${selectedDate.getFullYear()}/${pad2(selectedDate.getMonth() + 1)}/${pad2(selectedDate.getDate())}`
                                : value })] }) }), _jsxs(PopoverContent, { align: "start", sideOffset: 6, className: "w-72 p-3", children: [_jsxs("div", { className: "mb-3 flex h-8 items-center justify-between", children: [_jsx("span", { className: "text-ui-sm font-medium text-foreground", children: monthLabel }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", onClick: () => setVisibleMonth(new Date(year, month - 1, 1)), "aria-label": intl.formatMessage({
                                            id: "automations.customRepeat.previousMonth",
                                        }), children: _jsx(ChevronLeft, { className: "size-4" }) }), _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", onClick: () => setVisibleMonth(new Date(year, month + 1, 1)), "aria-label": intl.formatMessage({
                                            id: "automations.customRepeat.nextMonth",
                                        }), children: _jsx(ChevronRight, { className: "size-4" }) })] })] }), _jsxs("div", { className: "grid grid-cols-7 gap-1", children: [[0, 1, 2, 3, 4, 5, 6].map((day) => (_jsx("span", { className: "flex size-8 items-center justify-center text-ui-sm text-foreground-subtlest", children: intl.formatMessage({ id: `automations.weekday.${day}` }) }, day))), Array.from({ length: firstWeekday }, (_, index) => (_jsx("span", { className: "size-8" }, `blank-${index}`))), Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
                                const dateValue = `${year}-${pad2(month + 1)}-${pad2(day)}`;
                                const selected = dateValue === value;
                                const isToday = dateValue === todayValue;
                                const unavailable = dateValue < min;
                                return (_jsx("button", { type: "button", disabled: unavailable, onClick: () => {
                                        onChange(dateValue);
                                        setOpen(false);
                                    }, className: cn("flex size-8 items-center justify-center rounded-[8px] text-ui-base tabular-nums transition-colors", selected
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground hover:bg-menu-hover", isToday && !selected && "ring-1 ring-inset ring-border-hover", unavailable && "cursor-not-allowed text-foreground-subtlest opacity-35"), children: day }, day));
                            }), Array.from({ length: 42 - firstWeekday - daysInMonth }, (_, index) => (_jsx("span", { className: "size-8" }, `trailing-blank-${index}`)))] })] })] }));
}
function CustomRepeatDialog({ builder, endAt, intl, onConfirm, onOpenChange, open, }) {
    const [intervalInput, setIntervalInput] = useState(String(builder.customInterval));
    const [unit, setUnit] = useState(builder.customUnit);
    const [weekdays, setWeekdays] = useState(builder.customWeekdays);
    const [monthDays, setMonthDays] = useState(builder.customMonthDays);
    const [monthlyMode, setMonthlyMode] = useState(builder.customMonthlyMode);
    const [ends, setEnds] = useState(endAt !== undefined);
    const [endDate, setEndDate] = useState(toDateInputValue(endAt));
    useEffect(() => {
        if (!open)
            return;
        setIntervalInput(String(builder.customInterval));
        setUnit(builder.customUnit);
        setWeekdays(builder.customWeekdays);
        setMonthDays(builder.customMonthDays);
        setMonthlyMode(builder.customMonthlyMode);
        setEnds(endAt !== undefined);
        setEndDate(toDateInputValue(endAt));
    }, [builder, endAt, open]);
    const interval = Number(intervalInput);
    const isIntervalValid = /^\d+$/.test(intervalInput) &&
        Number.isInteger(interval) &&
        interval >= CUSTOM_REPEAT_INTERVAL_SCHEDULABLE_MIN &&
        interval <= CUSTOM_REPEAT_INTERVAL_MAX;
    const canIncrementInterval = intervalInput === "" || interval < CUSTOM_REPEAT_INTERVAL_MAX;
    const canDecrementInterval = intervalInput !== "" && interval > CUSTOM_REPEAT_INTERVAL_INPUT_MIN;
    const stepInterval = (delta) => {
        const currentInterval = /^\d+$/.test(intervalInput)
            ? interval
            : CUSTOM_REPEAT_INTERVAL_INPUT_MIN;
        const nextInterval = Math.min(CUSTOM_REPEAT_INTERVAL_MAX, Math.max(CUSTOM_REPEAT_INTERVAL_INPUT_MIN, currentInterval + delta));
        setIntervalInput(String(nextInterval));
    };
    return (_jsx(Dialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(DialogContent, { className: "max-h-[calc(100vh-2rem)] w-[400px] gap-0 overflow-y-auto border-border bg-card p-0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]", "aria-describedby": undefined, showCloseButton: false, children: [_jsxs(DialogHeader, { className: "px-5 pb-5 pt-5", children: [_jsx(DialogTitle, { className: "text-ui-xl font-medium leading-[26px] tracking-[-0.12px]", children: intl.formatMessage({ id: "automations.customRepeat.title" }) }), _jsx(DialogClose, { asChild: true, children: _jsx("button", { type: "button", "aria-label": intl.formatMessage({ id: "common.close" }), className: "absolute right-5 top-5 flex size-6 items-center justify-center rounded-[6px] opacity-80 transition-colors hover:bg-surface-hover hover:opacity-100", children: _jsx(X, { className: "size-4", strokeWidth: 2, "aria-hidden": "true" }) }) })] }), _jsxs("div", { className: "space-y-5 px-5", children: [_jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("label", { htmlFor: "automation-custom-interval", className: "text-ui-base leading-5 tracking-[-0.18px] text-foreground", children: intl.formatMessage({ id: "automations.customRepeat.frequency" }) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Input, { id: "automation-custom-interval", type: "number", min: CUSTOM_REPEAT_INTERVAL_INPUT_MIN, max: CUSTOM_REPEAT_INTERVAL_MAX, step: 1, inputMode: "numeric", value: intervalInput, "aria-invalid": !isIntervalValid, className: "h-9 rounded-lg px-3 pr-10 text-mobile-input-safe leading-6 tracking-[-0.18px] [appearance:textfield] md:text-ui-base md:leading-5 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none", "data-testid": TID_AUTOMATION_CUSTOM_INTERVAL_SELECT, onChange: (event) => {
                                                        const value = event.target.value;
                                                        // number 输入允许空值和科学计数法；保留空值便于编辑，
                                                        // 但只接收非负整数文本，避免将无效值写进 cron / scheduleRule。
                                                        if (value === "" || /^\d+$/.test(value))
                                                            setIntervalInput(value);
                                                    } }), _jsxs("div", { className: "absolute inset-y-px right-px flex w-8 flex-col overflow-hidden rounded-r-[7px] border-l border-input-border bg-input", children: [_jsx("button", { type: "button", "aria-label": "+1", title: "+1", "data-testid": TID_AUTOMATION_CUSTOM_INTERVAL_INCREMENT, disabled: !canIncrementInterval, onClick: () => stepInterval(1), className: "flex flex-1 items-center justify-center border-b border-input-border text-foreground-subtle transition-colors hover:bg-input-focused hover:text-foreground focus-visible:z-10 focus-visible:bg-input-focused focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40", children: _jsx(ChevronUp, { className: "size-3", strokeWidth: 2, "aria-hidden": "true" }) }), _jsx("button", { type: "button", "aria-label": "-1", title: "-1", "data-testid": TID_AUTOMATION_CUSTOM_INTERVAL_DECREMENT, disabled: !canDecrementInterval, onClick: () => stepInterval(-1), className: "flex flex-1 items-center justify-center text-foreground-subtle transition-colors hover:bg-input-focused hover:text-foreground focus-visible:z-10 focus-visible:bg-input-focused focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40", children: _jsx(ChevronDown, { className: "size-3", strokeWidth: 2, "aria-hidden": "true" }) })] })] }), _jsxs(Select, { value: unit, onValueChange: (value) => {
                                                const nextUnit = value;
                                                setUnit(nextUnit);
                                                if (nextUnit === "yearly")
                                                    setMonthDays([new Date().getDate()]);
                                            }, children: [_jsx(SelectTrigger, { className: "h-9 w-full rounded-[8px] px-3 text-ui-base leading-5 tracking-[-0.18px] hover:bg-input/80 data-[state=open]:border-input-border-hover data-[state=open]:bg-input/80", "data-testid": TID_AUTOMATION_CUSTOM_UNIT_SELECT, indicator: _jsx(CustomRepeatSelectIndicator, {}), children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { position: "popper", align: "start", side: "bottom", sideOffset: 4, collisionPadding: 8, className: CUSTOM_REPEAT_SELECT_CONTENT_CLASS, children: [_jsx(SelectItem, { value: "minute", className: CUSTOM_REPEAT_SELECT_ITEM_CLASS, "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "minute"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.minute",
                                                            }) }), _jsx(SelectItem, { value: "hourly", className: CUSTOM_REPEAT_SELECT_ITEM_CLASS, "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "hourly"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.hour",
                                                            }) }), _jsx(SelectItem, { value: "daily", "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "daily"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.day",
                                                            }) }), _jsx(SelectItem, { value: "weekly", "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "weekly"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.week",
                                                            }) }), _jsx(SelectItem, { value: "monthly", "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "monthly"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.month",
                                                            }) }), _jsx(SelectItem, { value: "yearly", "data-testid": testId(TID_AUTOMATION_CUSTOM_UNIT_OPTION, "yearly"), children: intl.formatMessage({
                                                                id: "automations.customRepeat.unit.year",
                                                            }) })] })] })] })] }), unit === "weekly" ? (_jsx("div", { className: "grid grid-cols-7 gap-2", children: WEEKDAY_ORDER.map((day) => {
                                const active = weekdays.includes(day);
                                return (_jsx("button", { type: "button", onClick: () => {
                                        if (active && weekdays.length === 1)
                                            return;
                                        setWeekdays(active
                                            ? weekdays.filter((candidate) => candidate !== day)
                                            : [...weekdays, day]);
                                    }, className: cn("flex h-9 items-center justify-center rounded-md border text-ui-base", active
                                        ? "border-primary bg-primary text-primary-foreground"
                                        : "border-border hover:bg-surface-hover"), children: intl.formatMessage({ id: `automations.weekday.${day}` }) }, day));
                            }) })) : null, unit === "monthly" ? (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("span", { className: "text-ui-base text-foreground", children: intl.formatMessage({ id: "automations.customRepeat.rule" }) }), _jsxs(Select, { value: monthlyMode, onValueChange: (value) => setMonthlyMode(value), children: [_jsx(SelectTrigger, { className: "h-9 w-32 rounded-[8px] px-3 text-ui-base hover:bg-input/80 data-[state=open]:border-input-border-hover data-[state=open]:bg-input/80", indicator: _jsx(CustomRepeatSelectIndicator, {}), children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { position: "popper", align: "start", side: "bottom", sideOffset: 4, collisionPadding: 8, className: CUSTOM_REPEAT_SELECT_CONTENT_CLASS, children: [_jsx(SelectItem, { value: "date", className: CUSTOM_REPEAT_SELECT_ITEM_CLASS, children: intl.formatMessage({
                                                                id: "automations.customRepeat.byDate",
                                                            }) }), _jsx(SelectItem, { value: "weekday", className: CUSTOM_REPEAT_SELECT_ITEM_CLASS, children: intl.formatMessage({
                                                                id: "automations.customRepeat.byWeekday",
                                                            }) })] })] })] }), monthlyMode === "date" ? (_jsx("div", { className: "grid grid-cols-10 gap-2.5", children: Array.from({ length: 31 }, (_, index) => index + 1).map((day) => {
                                        const active = monthDays.includes(day);
                                        return (_jsx("button", { type: "button", onClick: () => {
                                                if (active && monthDays.length === 1)
                                                    return;
                                                setMonthDays(active
                                                    ? monthDays.filter((candidate) => candidate !== day)
                                                    : [...monthDays, day]);
                                            }, className: cn("flex h-7 w-full items-center justify-center rounded-[8px] border text-ui-sm", active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border hover:bg-surface-hover"), children: day }, day));
                                    }) })) : (_jsx("div", { className: "grid grid-cols-7 gap-2", children: WEEKDAY_ORDER.map((day) => {
                                        const active = weekdays.includes(day);
                                        return (_jsx("button", { type: "button", onClick: () => setWeekdays([day]), className: cn("flex h-9 items-center justify-center rounded-md border text-ui-base", active
                                                ? "border-primary bg-primary text-primary-foreground"
                                                : "border-border hover:bg-surface-hover"), children: intl.formatMessage({
                                                id: `automations.weekday.${day}`,
                                            }) }, day));
                                    }) }))] })) : null, _jsxs("div", { className: "flex flex-col gap-1.5", children: [_jsx("span", { className: "text-ui-base leading-5 tracking-[-0.18px] text-foreground", children: intl.formatMessage({ id: "automations.customRepeat.ends" }) }), _jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [_jsxs("button", { type: "button", onClick: () => setEnds(false), className: "flex h-9 items-center gap-2 rounded-[8px] px-2 text-ui-base leading-5 tracking-[-0.18px] transition-colors hover:bg-surface-hover", children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: _jsx("span", { className: cn("flex size-4 items-center justify-center rounded-full border-[1.33px]", !ends ? "border-[#4099FF] bg-[#4099FF]" : "border-border"), children: !ends ? _jsx("span", { className: "size-1.5 rounded-full bg-white" }) : null }) }), intl.formatMessage({
                                                    id: "automations.customRepeat.neverEnds",
                                                })] }), _jsxs("button", { type: "button", onClick: () => setEnds(true), className: "flex h-9 items-center gap-2 rounded-[8px] px-2 text-ui-base leading-5 tracking-[-0.18px] transition-colors hover:bg-surface-hover", children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: _jsx("span", { className: cn("flex size-4 items-center justify-center rounded-full border-[1.33px]", ends ? "border-[#4099FF] bg-[#4099FF]" : "border-border"), children: ends ? _jsx("span", { className: "size-1.5 rounded-full bg-white" }) : null }) }), intl.formatMessage({
                                                    id: "automations.customRepeat.endsOption",
                                                })] })] }), _jsx(EndDatePicker, { value: endDate, min: toDateInputValue(Date.now()), disabled: !ends, intl: intl, onChange: setEndDate })] })] }), _jsxs(DialogFooter, { className: "gap-3 px-5 pb-5 pt-5", children: [_jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "outline", className: "h-9 rounded-[8px] px-4 text-ui-base font-medium leading-5 tracking-[-0.18px] hover:border-border-hover hover:bg-input/50", children: intl.formatMessage({ id: "common.cancel" }) }) }), _jsx(Button, { type: "button", className: "h-9 rounded-[8px] px-4 text-ui-base font-medium leading-5 tracking-[-0.18px] hover:bg-primary/80", "data-testid": TID_AUTOMATION_CUSTOM_CONFIRM, disabled: !isIntervalValid || (ends && !localDateEndTimestamp(endDate)), onClick: () => {
                                onConfirm({
                                    interval,
                                    unit,
                                    weekdays,
                                    monthDays,
                                    monthlyMode,
                                    ...(ends ? { endAt: localDateEndTimestamp(endDate) } : {}),
                                });
                                onOpenChange(false);
                            }, children: intl.formatMessage({ id: "common.confirm" }) })] })] }) }));
}
export async function saveAndRunAutomation(save, run) {
    if (!(await save()))
        return false;
    await run();
    return true;
}
function defaultBuilder() {
    return {
        frequency: "daily",
        hour: 9,
        minute: 0,
        weekdays: [1],
        dayOfMonth: 1,
        rawExpr: "0 9 * * *",
        customInterval: 1,
        customUnit: "daily",
        customWeekdays: [1],
        customMonthDays: [1],
        customMonth: new Date().getMonth() + 1,
        customMonthlyMode: "date",
    };
}
function initialBuilder(editing, initialDraft) {
    if (!editing) {
        return initialDraft ? parseCronToBuilder(initialDraft.cronExpr) : defaultBuilder();
    }
    const parsedBuilder = parseCronToBuilder(editing.cronExpr);
    if (!editing.scheduleRule)
        return parsedBuilder;
    return {
        ...parsedBuilder,
        frequency: "custom",
        hour: editing.scheduleRule.hour,
        minute: editing.scheduleRule.minute,
        customInterval: editing.scheduleRule.interval,
        customUnit: editing.scheduleRule.unit,
        customWeekdays: editing.scheduleRule.weekdays ?? [1],
        customMonthDays: editing.scheduleRule.monthDays ?? [1],
        customMonth: editing.scheduleRule.months?.[0] ?? new Date(editing.scheduleRule.anchorAt).getMonth() + 1,
        customMonthlyMode: editing.scheduleRule.monthlyMode ?? "date",
    };
}
function resolveRunStatus(run) {
    if (run.dispatchStatus === "skipped")
        return "skipped";
    if (run.dispatchStatus === "failed_to_dispatch")
        return "failed";
    switch (run.outcome) {
        case "succeeded":
            return "succeeded";
        case "failed":
            return "failed";
        case "stopped":
            return "stopped";
        default:
            return "running";
    }
}
// 运行状态用「圆点 + 彩色文字」呈现（Scheduled 历史表密度规格）。
const RUN_STATUS_DOT_CLASS = {
    running: "bg-primary",
    succeeded: "bg-success",
    failed: "bg-destructive",
    stopped: "bg-foreground-subtlest",
    skipped: "bg-warning",
};
const RUN_STATUS_TEXT_CLASS = {
    running: "text-primary",
    succeeded: "text-success",
    failed: "text-destructive",
    stopped: "text-foreground-subtle",
    skipped: "text-warning",
};
const AUTOMATION_STATUS_DOT_CLASS = {
    active: "bg-success",
    paused: "bg-warning",
    failed: "bg-destructive",
    completed: "bg-foreground-subtlest",
};
function normalizeAutomationScheduleRule(rule) {
    if (!rule)
        return null;
    return {
        unit: rule.unit,
        interval: rule.interval,
        hour: rule.hour,
        minute: rule.minute,
        anchorAt: rule.anchorAt,
        weekdays: rule.weekdays ?? [],
        monthDays: rule.monthDays ?? [],
        months: rule.months ?? [],
        monthlyMode: rule.monthlyMode ?? "date",
    };
}
export function AutomationEditView({ editing, initialDraft, defaultWorkspacePath, defaultWorkspaceIdentity, onManageModels, saving, onSubmit, onBack, onRunNow, onToggle, onDelete, runsEntry, onLoadRuns, onDeleteRun, onOpenSession, }) {
    const { intl } = useZCodeIntl();
    const confirmDialog = useConfirmDialog();
    const [tab, setTab] = useState("settings");
    const [runsPage, setRunsPage] = useState(1);
    const onLoadRunsRef = useRef(onLoadRuns);
    const saveAndRunPendingRef = useRef(false);
    const [saveAndRunPending, setSaveAndRunPending] = useState(false);
    const localizedDefaultCreateTitle = intl.formatMessage({
        id: "automations.edit.titlePlaceholder",
    });
    const previousLocalizedDefaultTitleRef = useRef(localizedDefaultCreateTitle);
    const titleTouchedRef = useRef(false);
    const [title, setTitle] = useState("");
    const [prompt, setPrompt] = useState("");
    const [model, setModel] = useState("");
    const modelSelection = useRef("");
    const [mode, setMode] = useState(AUTOMATION_DEFAULT_MODE);
    const modeRef = useRef(AUTOMATION_DEFAULT_MODE);
    const [thoughtLevel, setThoughtLevel] = useState("");
    const thoughtLevelRef = useRef("");
    const modelManuallyChangedRef = useRef(false);
    const thoughtManuallyChangedRef = useRef(false);
    const thoughtTriggerRef = useRef(null);
    // 不能首帧先渲染默认的“每天 09:00”、再由 effect 回填持久化调度。
    // 子级调度控件会先注册 value 回调，从而把默认值误记成 dirty baseline；编辑态必须首帧即使用真实值。
    const [builder, setBuilder] = useState(() => initialBuilder(editing, initialDraft));
    // 新建任务默认不带日程，通过「Add schedule」显式添加；移除后未补齐标红提示。
    const [scheduleRemoved, setScheduleRemoved] = useState(!editing && !initialDraft);
    const [validationErrors, setValidationErrors] = useState(() => new Set());
    const [customRepeatOpen, setCustomRepeatOpen] = useState(false);
    const [touchedFields, setTouchedFields] = useState(() => new Set());
    const currentEditSignaturesRef = useRef(null);
    const touchedFieldBaselinesRef = useRef({});
    const [endAt, setEndAt] = useState(() => editing?.endAt);
    // 目标项目 key(仅新建时可改;编辑锁定为 automation 所属项目)。
    const [workspaceKey, setWorkspaceKey] = useState(null);
    const localWorkspaceOptions = useAutomationProjectOptions({
        includeConversationWorkspace: true,
    });
    const editingWorkspaceOption = editing
        ? findAutomationWorkspaceOptionByKey(localWorkspaceOptions, editing.workspaceKey)
        : undefined;
    const workspaceOptions = useMemo(() => editing
        ? [
            {
                workspacePath: editing.workspacePath,
                workspaceIdentity: editing.workspaceIdentity,
                label: workspaceLabelFromPath(editing.workspacePath),
                ...(editingWorkspaceOption?.remoteSessionId
                    ? { remoteSessionId: editingWorkspaceOption.remoteSessionId }
                    : {}),
                ...(editingWorkspaceOption?.remoteTarget
                    ? { remoteTarget: editingWorkspaceOption.remoteTarget }
                    : {}),
                ...(editingWorkspaceOption?.workspacePurpose
                    ? { workspacePurpose: editingWorkspaceOption.workspacePurpose }
                    : {}),
            },
        ]
        : localWorkspaceOptions, [editing, editingWorkspaceOption, localWorkspaceOptions]);
    const workspaceOptionsRef = useRef(workspaceOptions);
    workspaceOptionsRef.current = workspaceOptions;
    // 打开/切换编辑对象时重置表单。
    useEffect(() => {
        setTab("settings");
        setRunsPage(1);
        setTouchedFields(new Set());
        setValidationErrors(new Set());
        touchedFieldBaselinesRef.current = {};
        if (editing) {
            setScheduleRemoved(false);
            titleTouchedRef.current = false;
            modelManuallyChangedRef.current = false;
            thoughtManuallyChangedRef.current = false;
            setTitle(editing.title);
            setPrompt(editing.prompt);
            const editingModel = editing.modelSelection
                ? encodeCustomModelValue(editing.modelSelection.providerId, editing.modelSelection.modelId)
                : "";
            const editingThoughtLevel = editing.modelSelection?.options?.reasoningLevel?.trim() ?? "";
            modelSelection.current = editingModel;
            thoughtLevelRef.current = editingThoughtLevel;
            setModel(editingModel);
            const editingMode = editing.mode?.trim() || AUTOMATION_DEFAULT_MODE;
            modeRef.current = editingMode;
            setMode(editingMode);
            setThoughtLevel(editingThoughtLevel);
            setBuilder(initialBuilder(editing, initialDraft));
            setEndAt(editing.endAt);
            setWorkspaceKey(resolveWorkspaceKey({
                workspacePath: editing.workspacePath,
                workspaceIdentity: editing.workspaceIdentity,
            }));
        }
        else {
            setScheduleRemoved(!initialDraft);
            // 新建页的默认标题可随 locale 更新；模板标题仍属于用户明确选择的内容。
            titleTouchedRef.current = false;
            modelManuallyChangedRef.current = false;
            thoughtManuallyChangedRef.current = false;
            setTitle(initialDraft?.title ?? localizedDefaultCreateTitle);
            setPrompt(initialDraft?.prompt ?? "");
            modelSelection.current = "";
            setModel("");
            modeRef.current = AUTOMATION_DEFAULT_MODE;
            thoughtLevelRef.current = "";
            setMode(AUTOMATION_DEFAULT_MODE);
            setThoughtLevel("");
            setBuilder(initialBuilder(editing, initialDraft));
            setEndAt(undefined);
            setWorkspaceKey(reconcileAutomationWorkspaceSelectionKey(workspaceOptionsRef.current, null, {
                workspacePath: defaultWorkspacePath,
                workspaceIdentity: defaultWorkspaceIdentity,
            }));
        }
    }, [editing, initialDraft, defaultWorkspacePath, defaultWorkspaceIdentity]);
    useEffect(() => {
        const nextTitle = resolveLocalizedAutomationCreateTitle({
            currentTitle: title,
            hasInitialDraft: Boolean(initialDraft),
            isEditing: Boolean(editing),
            nextDefaultTitle: localizedDefaultCreateTitle,
            previousDefaultTitle: previousLocalizedDefaultTitleRef.current,
            titleTouched: titleTouchedRef.current,
        });
        previousLocalizedDefaultTitleRef.current = localizedDefaultCreateTitle;
        if (nextTitle !== title) {
            setTitle(nextTitle);
        }
    }, [editing, initialDraft, localizedDefaultCreateTitle, title]);
    useEffect(() => {
        if (editing)
            return;
        // 候选为空或默认项目已失效时不能保留 default workspace 并允许落库。
        // 任何 tab 变化都重新把选择收敛到当前有效项目；没有候选时必须明确置空。
        setWorkspaceKey((currentWorkspaceKey) => reconcileAutomationWorkspaceSelectionKey(workspaceOptions, currentWorkspaceKey, {
            workspacePath: defaultWorkspacePath,
            workspaceIdentity: defaultWorkspaceIdentity,
        }));
    }, [defaultWorkspaceIdentity, defaultWorkspacePath, editing, workspaceOptions]);
    const markFieldTouched = useCallback((field) => {
        if (touchedFieldBaselinesRef.current[field] === undefined) {
            touchedFieldBaselinesRef.current[field] = currentEditSignaturesRef.current?.[field];
        }
        setTouchedFields((previous) => {
            if (previous.has(field))
                return previous;
            const next = new Set(previous);
            next.add(field);
            return next;
        });
    }, []);
    const clearRequiredFieldValidation = useCallback((field) => {
        setValidationErrors((current) => clearAutomationEditRequiredFieldError(current, field));
    }, []);
    const handleRemoveSchedule = useCallback(() => {
        markFieldTouched("schedule");
        setScheduleRemoved(true);
        // 删除计划曾直接开启 destructive 校验态，把普通编辑误当成提交失败。
        clearRequiredFieldValidation("schedule");
        logger.debug("[AutomationEditView] 删除计划草稿", {
            automationId: editing?.automationId ?? null,
            validationVisible: false,
        });
    }, [clearRequiredFieldValidation, editing?.automationId, markFieldTouched]);
    useEffect(() => {
        onLoadRunsRef.current = onLoadRuns;
    }, [onLoadRuns]);
    // 切到 History tab(编辑态)时加载运行历史，并在停留期间轻量刷新。
    // cron run/outcome 由 scheduler/host 异步写入；只加载一次会让用户看到会话已结束但历史仍为空。
    // onLoadRuns 由父组件 inline 传入，不能作为依赖，否则每次 runsCache 更新都会重启 effect 形成请求循环。
    useEffect(() => {
        if (tab !== "history" || !editing) {
            return;
        }
        onLoadRunsRef.current?.();
        const timer = window.setInterval(() => {
            onLoadRunsRef.current?.();
        }, 5_000);
        return () => window.clearInterval(timer);
    }, [tab, editing?.automationId]);
    const isSessionCreatedAutomation = resolveIsSessionCreatedAutomation(editing);
    // 会话来源但无法由 UI 安全回显的旧 cron 保持只读；用户显式重设后以持久化标记退出该路径。
    const preserveSessionCreatedSchedule = isSessionCreatedAutomation &&
        !editing?.scheduleEditedByUser &&
        Boolean(editing && !canVisualizeCronInAutomationEditor(editing.cronExpr)) &&
        !touchedFields.has("schedule");
    const cronExpr = useMemo(() => scheduleRemoved
        ? ""
        : preserveSessionCreatedSchedule
            ? (editing?.cronExpr ?? "")
            : buildCronExpr(builder), [builder, editing?.cronExpr, preserveSessionCreatedSchedule, scheduleRemoved]);
    const schedulePreview = useMemo(() => (cronExpr ? describeCronBuilder(builder, intl) : ""), [builder, cronExpr, intl]);
    const selectedWorkspace = findAutomationWorkspaceOptionByKey(workspaceOptions, workspaceKey) ??
        (editing
            ? {
                workspacePath: editing.workspacePath,
                workspaceIdentity: editing.workspaceIdentity,
                label: workspaceLabelFromPath(editing.workspacePath),
            }
            : null);
    // 复用输入框空态的项目选择菜单：把表单的项目候选映射成它的 tab 结构。
    const workspaceMenuTabs = useMemo(() => workspaceOptions.map((option) => ({
        workspacePath: option.workspacePath,
        label: option.label,
        ...(option.workspaceIdentity ? { workspaceIdentity: option.workspaceIdentity } : {}),
        ...(option.workspacePurpose ? { workspacePurpose: option.workspacePurpose } : {}),
    })), [workspaceOptions]);
    // 新建态无有效项目时保留空目标，避免模型配置读取悄悄回退到 conversation/default workspace。
    const selectedWorkspacePath = selectedWorkspace?.workspacePath ?? "";
    const selectedWorkspaceIdentity = selectedWorkspace?.workspaceIdentity;
    const originalSelection = useMemo(() => {
        if (!model)
            return null;
        const identity = parseModelPickerValue(model);
        return identity
            ? { ...identity, ...(thoughtLevel ? { options: { reasoningLevel: thoughtLevel } } : {}) }
            : null;
    }, [model, thoughtLevel]);
    // 模型候选属于当前表单目标 Host。项目切换时立即切换订阅；远程目标未连接时
    // useModelSelectionView 会保持 unavailable，绝不能退回当前设置页的 Local Host。
    const modelSelectionRead = useModelSelectionView(selectedWorkspacePath || null, selectedWorkspace?.remoteSessionId, selectedWorkspaceIdentity, selectedWorkspace?.remoteTarget, { selection: originalSelection });
    const modelSelectionView = modelSelectionRead.state.status === "ready" ? modelSelectionRead.state.view : null;
    const effectiveSelection = modelSelectionView?.effectiveSelection;
    const effectiveModelValue = effectiveSelection
        ? encodeCustomModelValue(effectiveSelection.providerId, effectiveSelection.modelId)
        : "";
    const effectiveReasoningLevel = effectiveSelection?.options?.reasoningLevel ?? "";
    const modelSelectGroups = useMemo(() => {
        if (!modelSelectionView)
            return [];
        return buildAutomationModelSelectGroups({
            selectedProvider: ZCODE_AGENT_PROVIDER,
            labels: {
                apiKeyLabel: intl.formatMessage({ id: "settings.modelProvider.apiKey" }),
                apiKeyBadgeLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.apiKeyBadge",
                }),
                codingPlanLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.codingPlan",
                }),
                codingPlanBadgeLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.codingPlanBadge",
                }),
                startPlanLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.startPlan",
                }),
                startPlanBadgeLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.startPlanBadge",
                }),
                teamPlanBadgeLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.teamPlanBadge",
                }),
                teamPlanFallbackLabel: intl.formatMessage({
                    id: "settings.modelProvider.connectionMode.teamPlan",
                }),
            },
            registrySelectionView: modelSelectionView,
        });
    }, [intl, modelSelectionView]);
    const isSelectedConversationWorkspace = selectedWorkspace?.workspacePurpose === "conversation";
    // automation 数据只持久化 workspaceKey/path，编辑态曾直接把 conversation
    // backing path 当项目展示成 default。匹配当前 canonical 候选恢复 purpose 后，
    // 继续复用会话侧文案；无法匹配的历史目标仍回退到路径名称。
    const selectedWorkspaceDisplayLabel = isSelectedConversationWorkspace
        ? intl.formatMessage({ id: "chat.empty.workOutsideProject" })
        : (selectedWorkspace?.label ?? workspaceLabelFromPath(defaultWorkspacePath));
    const conversationWorkspace = workspaceOptions.find((option) => option.workspacePurpose === "conversation");
    const handleSelectWorkspace = (workspace) => {
        modelManuallyChangedRef.current = false;
        thoughtManuallyChangedRef.current = false;
        modelSelection.current = "";
        setModel("");
        // 远程工作区可以共享同一实际路径；旧回调只传 path 再 find，永远命中第一个
        // 候选。选择事件必须携带 identity，确保模型预览、保存和派发使用用户点击的 workspaceKey。
        setWorkspaceKey(resolveAutomationWorkspaceSelectionKey(workspace));
    };
    const handleSelectConversationWorkspace = () => {
        if (!conversationWorkspace)
            return;
        modelManuallyChangedRef.current = false;
        thoughtManuallyChangedRef.current = false;
        modelSelection.current = "";
        setModel("");
        // conversation backing workspace 曾被降格成名为 default 的普通项目，
        // 导致菜单泄露内部目录名和 Folder 图标。这里按 purpose 选择 canonical backing，
        // 展示则交给会话侧固定的「不在项目中工作」菜单项。
        setWorkspaceKey(resolveAutomationWorkspaceSelectionKey(conversationWorkspace));
    };
    const modelTriggerLabel = resolveAutomationModelTriggerLabel({
        modelGroups: modelSelectGroups,
        modelSelectionView,
        modelValue: effectiveModelValue,
        fallbackLabel: intl.formatMessage({ id: "chat.toolbar.model.label" }),
    });
    // 主动选模型才初始化最高档；历史恢复和 View 刷新仍保留缺失档位。
    const handleModelValueChange = useCallback((value) => {
        modelManuallyChangedRef.current = true;
        thoughtManuallyChangedRef.current = false;
        modelSelection.current = value;
        setModel(value);
        const selection = value && modelSelectionView
            ? completeNewModelSelection(modelSelectionView, parseModelPickerValue(value))
            : undefined;
        const level = selection?.options?.reasoningLevel ?? "";
        thoughtLevelRef.current = level;
        setThoughtLevel(level);
        markFieldTouched("model");
    }, [markFieldTouched, modelSelectionView]);
    // 定时任务编辑页只维护表单草稿，不能为了读取选项调用 workspace 默认配置接口；
    // 否则用户仅打开后取消，也会改掉当前项目或 draft session 的模型、模式和思考强度。
    const modeOption = useMemo(() => buildAutomationModeOption(mode), [mode]);
    const selectedModelItem = useMemo(() => resolveAutomationModelItem(modelSelectGroups, effectiveModelValue), [effectiveModelValue, modelSelectGroups]);
    const preferredModelValue = useMemo(() => (modelSelectionView ? resolveAutomationPreferredModelValue(modelSelectionView) : null), [modelSelectionView]);
    const persistedSelectionInvalid = Boolean(originalSelection && modelSelectionView && modelSelectionView.selectionIssue);
    const invalidSelectionNoticeKeyRef = useRef(null);
    useEffect(() => {
        if (!persistedSelectionInvalid || !editing || !modelSelectionView)
            return;
        const noticeKey = `${editing.automationId}:${modelSelectionView.revision}`;
        if (invalidSelectionNoticeKeyRef.current === noticeKey)
            return;
        invalidSelectionNoticeKeyRef.current = noticeKey;
        toast(intl.formatMessage({ id: "modelSelection.invalidated.reselect" }), {
            variant: "warning",
            position: "bottom-center",
            dedupeKey: `automation-model-selection-invalidated:${editing.automationId}`,
        });
    }, [editing, intl, modelSelectionView, persistedSelectionInvalid]);
    useEffect(() => {
        if (editing ||
            !preferredModelValue ||
            modelManuallyChangedRef.current ||
            persistedSelectionInvalid)
            return;
        if (model)
            return;
        // 旧表单把“默认模型”保存为空值，却又要求提交前必须存在具体候选，
        // 导致初次创建按钮永远禁用。目标 Host ready 后直接选中并固化 preferredSelection。
        modelSelection.current = preferredModelValue;
        setModel(preferredModelValue);
        thoughtManuallyChangedRef.current = false;
        const preferredReasoning = modelSelectionView?.preferredSelection?.options?.reasoningLevel ?? "";
        thoughtLevelRef.current = preferredReasoning;
        setThoughtLevel(preferredReasoning);
    }, [editing, model, modelSelectionView, persistedSelectionInvalid, preferredModelValue]);
    const selectedModelMetadataThoughtOption = useMemo(() => {
        if (!selectedModelItem)
            return null;
        const decodedModel = decodeCustomModelValue(selectedModelItem.value);
        if (!decodedModel?.modelName)
            return null;
        // 与会话 composer 复用同一模型静态事实，避免 workspace runtime catalog 暂未投影
        // thought_level 时，定时任务把支持推理的模型误显示成无思考档位。
        return modelSelectionView
            ? resolveModelThoughtOption({
                modelSelectionView,
                providerId: decodedModel.providerId,
                modelId: decodedModel.modelName,
            })
            : null;
    }, [modelSelectionView, selectedModelItem]);
    // 所选模型的 Option Specs 只来自目标 Host View；不能为预览再创建 deferred Session。
    const activeThoughtOption = selectedModelMetadataThoughtOption ?? undefined;
    const thoughtLevelOption = useMemo(() => buildAutomationThoughtLevelOption(activeThoughtOption, effectiveReasoningLevel), [activeThoughtOption, effectiveReasoningLevel]);
    const requiredFieldErrors = useMemo(() => resolveAutomationEditRequiredFieldErrors({
        title,
        cronExpr,
        prompt,
    }), [cronExpr, prompt, title]);
    const hasValidWorkspace = Boolean(editing || selectedWorkspace);
    const submissionContextReady = hasValidWorkspace &&
        (Boolean(editing) || selectedWorkspace !== null) &&
        modelSelectionRead.state.status === "ready" &&
        selectedModelItem !== null &&
        Boolean(effectiveReasoningLevel) &&
        !modelSelectionView?.selectionIssue;
    const canSubmit = submissionContextReady && requiredFieldErrors.length === 0;
    const requestRequiredFieldValidation = useCallback((source) => {
        setValidationErrors(new Set(requiredFieldErrors));
        logger.debug("[AutomationEditView] 提交前校验必填字段", {
            automationId: editing?.automationId ?? null,
            source,
            invalidFields: requiredFieldErrors,
        });
        return requiredFieldErrors.length === 0;
    }, [editing?.automationId, requiredFieldErrors]);
    const currentScheduleRule = useMemo(() => builder.frequency === "custom"
        ? {
            unit: builder.customUnit,
            interval: builder.customInterval,
            hour: builder.hour,
            minute: builder.minute,
            anchorAt: editing?.scheduleRule?.anchorAt ?? Date.now(),
            weekdays: builder.customWeekdays,
            monthDays: builder.customMonthDays,
            // months 仅对 yearly 有意义；其它单位置空，JSON.stringify 会丢弃 undefined。
            months: builder.customUnit === "yearly" ? [builder.customMonth] : undefined,
            monthlyMode: builder.customMonthlyMode,
        }
        : undefined, [builder, editing?.scheduleRule?.anchorAt]);
    const buildSubmitInput = useCallback(({ modeValue }) => {
        if (!effectiveSelection || !effectiveReasoningLevel) {
            throw new Error("Automation model selection is required");
        }
        return {
            title: title.trim(),
            cronExpr,
            prompt: prompt.trim(),
            // 编辑会话内创建的有限次任务时，不能固定改成循环任务。
            recurring: editing?.recurring ?? true,
            ...(editing ? { endAt: endAt ?? null } : endAt ? { endAt } : {}),
            ...(editing
                ? preserveSessionCreatedSchedule
                    ? {}
                    : { scheduleRule: currentScheduleRule ?? null }
                : currentScheduleRule
                    ? { scheduleRule: currentScheduleRule }
                    : {}),
            ...(editing && touchedFields.has("schedule") ? { scheduleEditedByUser: true } : {}),
            mode: modeValue,
            modelSelection: effectiveSelection,
        };
    }, [
        cronExpr,
        currentScheduleRule,
        editing,
        endAt,
        preserveSessionCreatedSchedule,
        prompt,
        effectiveSelection,
        effectiveReasoningLevel,
        title,
        touchedFields,
    ]);
    const currentEditSignatures = useMemo(() => {
        if (!editing)
            return null;
        return {
            title: title.trim(),
            prompt: prompt.trim(),
            schedule: JSON.stringify({
                cronExpr,
                endAt: endAt ?? null,
                scheduleRule: preserveSessionCreatedSchedule
                    ? null
                    : normalizeAutomationScheduleRule(currentScheduleRule ?? null),
            }),
            mode,
            thoughtLevel,
            model,
        };
    }, [
        cronExpr,
        currentScheduleRule,
        editing,
        endAt,
        preserveSessionCreatedSchedule,
        mode,
        model,
        prompt,
        thoughtLevel,
        title,
    ]);
    currentEditSignaturesRef.current = currentEditSignatures;
    const changedFields = useMemo(() => currentEditSignatures
        ? resolveChangedAutomationEditFields({
            touchedFields,
            current: currentEditSignatures,
            baseline: touchedFieldBaselinesRef.current,
        })
        : [], [currentEditSignatures, touchedFields]);
    // 模型元数据和 cron builder 会在打开页面后异步归一化；只有用户实际操作过的
    // 字段才能触发未保存提示，否则仅打开已有任务再返回也会被误判为修改。
    const hasUnsavedChanges = Boolean(editing) && changedFields.length > 0;
    const recommendStartPlan = useStartPlanRecommendation(modelSelectionView);
    const submitAutomation = useCallback(async (options) => {
        if (saving)
            return false;
        if (!requestRequiredFieldValidation(options.validationSource)) {
            return false;
        }
        if (!canSubmit)
            return false;
        // 防止刚改选择尚未取得对应 View 时，快速保存采用上一个输入的有效结果。
        if (modelSelection.current !== model || thoughtLevelRef.current !== thoughtLevel)
            return false;
        const input = {
            // 权限下拉和保存按钮是两个独立控件，快速选择 Plan 后立即保存时，
            // React state 可能还没刷新到 submit 闭包；用 ref 保留最后一次选择，避免落库成默认 build。
            ...buildSubmitInput({
                modeValue: modeRef.current,
            }),
        };
        // 编辑态锁定原项目;新建态用选中的项目。
        const target = editing
            ? {
                workspacePath: editing.workspacePath,
                workspaceIdentity: editing.workspaceIdentity,
            }
            : selectedWorkspace
                ? {
                    workspacePath: selectedWorkspace.workspacePath,
                    workspaceIdentity: selectedWorkspace.workspaceIdentity,
                }
                : null;
        // 只禁用按钮无法覆盖快捷键或异步回调；提交边界也必须拒绝无有效项目的新建。
        if (!target)
            return false;
        if (input.modelSelection && (!editing || changedFields.includes("model"))) {
            const chosen = await recommendStartPlan(input.modelSelection);
            if (!chosen)
                return false;
            input.modelSelection = chosen;
        }
        const trace = startUserAction({
            featureId: "automation.lifecycle",
            action: editing ? "update" : "create",
            trigger: "button",
            workspaceKind: editing?.workspaceIdentity?.trim() ? "remote" : "local",
            automationKind: "scheduled",
        });
        try {
            const ok = await onSubmit({ input, ...target });
            if (ok) {
                trace.complete({ resultSource: "platform_result" });
                if (options?.returnToList !== false)
                    onBack();
            }
            else {
                trace.reject({ resultSource: "platform_result" });
            }
            return ok;
        }
        catch (error) {
            trace.fail({ failureStage: "automation_save" });
            throw error;
        }
    }, [
        buildSubmitInput,
        changedFields,
        recommendStartPlan,
        canSubmit,
        editing,
        onBack,
        onSubmit,
        requestRequiredFieldValidation,
        saving,
        model,
        thoughtLevel,
        selectedWorkspace?.workspaceIdentity,
        selectedWorkspace?.workspacePath,
    ]);
    const handleSubmit = async (event) => {
        event.preventDefault();
        await submitAutomation({ validationSource: "save" });
    };
    const handleSaveAndRun = useCallback(async () => {
        if (!editing || !onRunNow || saveAndRunPendingRef.current)
            return;
        saveAndRunPendingRef.current = true;
        setSaveAndRunPending(true);
        logger.debug("[AutomationEditView] 保存并立即运行开始", {
            automationId: editing.automationId,
            changedFields,
        });
        try {
            const completed = await saveAndRunAutomation(() => submitAutomation({
                returnToList: false,
                validationSource: "run-now",
            }), () => onRunNow(editing));
            logger.debug("[AutomationEditView] 保存并立即运行结束", {
                automationId: editing.automationId,
                completed,
            });
        }
        finally {
            saveAndRunPendingRef.current = false;
            setSaveAndRunPending(false);
        }
    }, [changedFields, editing, onRunNow, submitAutomation]);
    const handleBackClick = useCallback(async () => {
        logger.debug("[AutomationEditView] 返回前检查未保存更改", {
            automationId: editing?.automationId ?? null,
            touchedFields: [...touchedFields],
            changedFields,
        });
        if (!hasUnsavedChanges) {
            onBack();
            return;
        }
        // 定时任务曾单独维护“保存 / 放弃修改”弹窗，与闲时任务的确认弹窗
        // 尺寸和动作持续漂移；统一复用远程 Automation presentation，仅保留“取消 / 丢弃”语义。
        const confirmed = await confirmDialog({
            title: intl.formatMessage({ id: "automations.unsaved.title" }),
            description: intl.formatMessage({
                id: "automations.unsaved.description",
            }),
            confirmLabel: intl.formatMessage({
                id: "automations.unsaved.discard",
            }),
            confirmVariant: "destructive",
            showCloseButton: true,
            showKeyboardHints: false,
            presentation: "automation-confirmation",
        });
        logger.debug("[AutomationEditView] 未保存更改确认结果", {
            automationId: editing?.automationId ?? null,
            discarded: confirmed,
        });
        if (confirmed)
            onBack();
    }, [
        changedFields,
        confirmDialog,
        editing?.automationId,
        hasUnsavedChanges,
        intl,
        onBack,
        touchedFields,
    ]);
    const handleTabChange = useCallback((nextTab) => {
        // 新建定时任务曾直接禁用 History trigger，和闲时任务可查看空历史的交互不一致。
        logger.debug("[AutomationEditView] 切换设置页签", {
            automationId: editing?.automationId ?? null,
            nextTab,
            willLoadRuns: nextTab === "history" && Boolean(editing),
        });
        setTab(nextTab);
    }, [editing]);
    const runs = runsEntry?.runs ?? [];
    const runsLoading = runsEntry?.status === "loading";
    // 运行历史客户端分页：数据已整份加载，这里按页切片展示。删除后条数变化时把页码收敛到有效范围。
    const runsTotalPages = Math.max(1, Math.ceil(runs.length / RUNS_PAGE_SIZE));
    const runsCurrentPage = Math.min(runsPage, runsTotalPages);
    const pagedRuns = runs.slice((runsCurrentPage - 1) * RUNS_PAGE_SIZE, runsCurrentPage * RUNS_PAGE_SIZE);
    const runsPageItems = buildRunsPageItems(runsCurrentPage, runsTotalPages);
    const editStatus = editing ? resolveAutomationStatusKind(editing) : null;
    const showEditingSettingsActions = Boolean(editing && tab === "settings");
    const showCreateSettingsAction = !editing && tab === "settings";
    return (_jsx(_Fragment, { children: _jsxs("div", { className: cn(SETTINGS_FRAME_CONTENT_CLASSNAME, "flex flex-col gap-6"), children: [_jsx(SettingsBreadcrumbReporter, { items: [
                        {
                            label: editing?.title ?? intl.formatMessage({ id: "automations.edit.newTask" }),
                        },
                    ], onSectionSelect: () => void handleBackClick() }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("h1", { "data-testid": "automation-edit-title", className: "text-ui-xl font-semibold text-foreground", children: intl.formatMessage({
                                id: editing ? "automations.form.editTitle" : "automations.form.createTitle",
                            }) }), _jsx("p", { "data-testid": "automation-edit-subtitle", className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                id: editing ? "automations.edit.editSubtitle" : "automations.edit.createSubtitle",
                            }) })] }), _jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [_jsx(AutomationSettingsHistoryTabs, { value: tab, settingsLabel: intl.formatMessage({
                                id: "automations.edit.tab.settings",
                            }), historyLabel: intl.formatMessage({
                                id: "automations.edit.tab.history",
                            }), onValueChange: handleTabChange }), _jsx("div", { className: "flex items-center gap-1.5", children: editing ? (_jsxs(_Fragment, { children: [showEditingSettingsActions ? (_jsx("button", { type: "submit", form: "automation-edit-form", "data-testid": TID_AUTOMATION_FORM_SUBMIT, className: "inline-flex h-8 items-center rounded-lg border-0 bg-white px-3 text-ui-base font-medium text-black shadow-none outline-none transition-colors hover:bg-white/90 focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-40", disabled: !submissionContextReady || saving, children: intl.formatMessage({
                                            id: saving ? "automations.form.saving" : "automations.form.save",
                                        }) })) : null, showEditingSettingsActions && onRunNow ? (_jsxs("button", { type: "button", "data-testid": TID_AUTOMATION_RUN_NOW, className: "inline-flex h-8 items-center gap-1.5 rounded-lg border-0 bg-white/[0.06] px-3 text-ui-base font-medium text-foreground shadow-none outline-none transition-colors hover:bg-white/10 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-foreground-subtlest disabled:opacity-40", disabled: !submissionContextReady || saving || saveAndRunPending, onClick: () => void handleSaveAndRun(), children: [_jsx(AutomationRunNowIcon, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({ id: "automations.runNow" })] })) : null, _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { type: "button", "aria-label": intl.formatMessage({
                                                        id: "automations.moreActions",
                                                    }), className: "flex size-8 items-center justify-center rounded-lg border-0 bg-white/[0.06] text-foreground-subtle shadow-none outline-none transition-colors hover:bg-white/10 hover:text-foreground data-[state=open]:bg-white/10 data-[state=open]:text-foreground focus-visible:ring-0", children: _jsx(AutomationMoreHorizontalIcon, { className: "size-4", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", sideOffset: 4, className: "min-w-[180px]", children: [onToggle &&
                                                        editing.lifecycleStatus !== "completed" &&
                                                        editing.lifecycleStatus !== "failed" ? (_jsxs(DropdownMenuItem, { className: "gap-1", onSelect: () => onToggle(editing, !editing.enabled), children: [_jsx("span", { className: "flex size-5 items-center justify-center", children: editing.enabled ? (_jsx(AutomationPauseActionIcon, { className: "size-4", "aria-hidden": "true" })) : (_jsx(AutomationContinueIcon, { className: "size-4", "aria-hidden": "true" })) }), intl.formatMessage({
                                                                id: editing.enabled ? "automations.pause" : "automations.resume",
                                                            })] })) : null, onDelete ? (_jsxs(_Fragment, { children: [_jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "gap-1 !text-destructive data-[highlighted]:!bg-menu-hover data-[highlighted]:!text-destructive focus:!text-destructive [&_svg]:!text-destructive", onSelect: () => onDelete(editing), children: [_jsx(AutomationTrashIcon, {}), intl.formatMessage({ id: "automations.delete" })] })] })) : null] })] })] })) : showCreateSettingsAction ? (_jsx(Button, { type: "submit", form: "automation-edit-form", variant: "default", size: "lg", "data-testid": TID_AUTOMATION_FORM_SUBMIT, disabled: !canSubmit || saving, children: intl.formatMessage({
                                    id: saving ? "automations.form.saving" : "automations.edit.createButton",
                                }) })) : null })] }), tab === "settings" ? (_jsxs("form", { id: "automation-edit-form", className: "space-y-4", onSubmit: (e) => void handleSubmit(e), children: [editStatus ? (_jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("div", { className: "text-ui-base font-normal leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "automations.form.status.label" }) }), _jsx("div", { className: "flex min-h-8 flex-wrap items-center gap-2", children: _jsxs("span", { className: "inline-flex h-8 max-w-full items-center gap-1 rounded-lg bg-card pl-2 pr-4 text-ui-base leading-5 text-foreground", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx("span", { className: cn("size-1.5 shrink-0 rounded-full", AUTOMATION_STATUS_DOT_CLASS[editStatus]), "aria-hidden": "true" }) }), _jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({
                                                    id: `automations.lifecycle.${editStatus}`,
                                                }) })] }) })] })) : null, _jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("label", { className: "text-ui-base font-normal leading-5 text-foreground-subtle", htmlFor: "automation-title", children: intl.formatMessage({ id: "automations.form.title.label" }) }), _jsx(Input, { id: "automation-title", size: "lg", "data-testid": TID_AUTOMATION_FORM_TITLE, value: title, onChange: (e) => {
                                        titleTouchedRef.current = true;
                                        markFieldTouched("title");
                                        clearRequiredFieldValidation("title");
                                        setTitle(e.target.value);
                                    }, placeholder: intl.formatMessage({
                                        id: "automations.edit.titlePlaceholder",
                                    }), "aria-invalid": validationErrors.has("title") && !title.trim(), maxLength: 200, className: cn("h-9 rounded-xl bg-input px-3 text-foreground", AUTOMATION_FORM_INPUT_TYPOGRAPHY_CLASSNAME) })] }), preserveSessionCreatedSchedule ? (_jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("label", { className: "inline-flex items-center gap-1.5 text-ui-base font-normal leading-5 text-foreground-subtle", children: intl.formatMessage({
                                        id: "automations.form.schedule.label",
                                    }) }), _jsxs("div", { "data-testid": TID_AUTOMATION_SCHEDULE_PREVIEW, className: "relative flex h-9 items-center overflow-hidden rounded-xl border border-input-border bg-input px-2 pr-9 text-ui-base leading-5 text-foreground-subtle transition-colors hover:border-input-border-hover focus-within:border-input-border-focused focus-within:bg-input-focused", children: [_jsx("span", { className: "min-w-0 truncate", children: intl.formatMessage({ id: "automations.frequency.custom" }) }), _jsx("button", { type: "button", "data-testid": TID_AUTOMATION_SCHEDULE_DELETE, onClick: handleRemoveSchedule, className: "absolute right-2 top-2 flex size-5 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground", "aria-label": intl.formatMessage({ id: "common.delete" }), children: _jsx(AutomationTrashIcon, {}) })] })] })) : (_jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("label", { className: "inline-flex items-center gap-1.5 text-ui-base font-normal leading-5 text-foreground-subtle", children: intl.formatMessage({
                                        id: "automations.form.schedule.label",
                                    }) }), scheduleRemoved ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-testid": TID_AUTOMATION_SCHEDULE_ADD, "aria-invalid": scheduleRemoved && validationErrors.has("schedule"), className: cn("flex h-9 w-full items-center gap-1 rounded-xl border bg-input px-2 text-ui-base font-normal leading-5 text-foreground-subtle transition-colors hover:border-input-border-hover hover:text-foreground focus-visible:border-input-border-focused focus-visible:bg-input-focused data-[state=open]:border-input-border-focused data-[state=open]:bg-input-focused data-[state=open]:text-foreground", validationErrors.has("schedule")
                                                    ? "!border-destructive !ring-2 !ring-destructive/20"
                                                    : "border-input-border"), children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx(AutomationAddScheduleIcon, { "aria-hidden": "true" }) }), intl.formatMessage({
                                                        id: "scheduledPreview.addSchedule",
                                                    })] }) }), _jsx(DropdownMenuContent, { align: "start", sideOffset: 4, className: "w-[148px] p-1.5", children: FREQUENCIES.map((frequency) => (_jsx(DropdownMenuItem, { "data-testid": testId(TID_AUTOMATION_FREQUENCY_OPTION, frequency), 
                                                // raw 白色 5% 只在深色菜单可见，Light 下高亮状态近似透明。
                                                className: "min-h-8 px-2 py-2 text-ui-base text-foreground-subtle data-[highlighted]:bg-menu-hover data-[highlighted]:text-foreground", onSelect: () => {
                                                    markFieldTouched("schedule");
                                                    if (frequency === "custom") {
                                                        setCustomRepeatOpen(true);
                                                        return;
                                                    }
                                                    setBuilder((previous) => ({
                                                        ...previous,
                                                        frequency,
                                                        ...(frequency === "weekdays" ? { weekdays: [1, 2, 3, 4, 5] } : {}),
                                                    }));
                                                    setScheduleRemoved(false);
                                                    clearRequiredFieldValidation("schedule");
                                                }, children: intl.formatMessage({
                                                    id: `automations.frequency.${frequency}`,
                                                }) }, frequency))) })] })) : (_jsx(_Fragment, { children: _jsxs("div", { className: "relative flex h-9 flex-nowrap items-center gap-1 overflow-hidden rounded-xl border border-input-border bg-input py-1 pl-[7px] pr-9 text-ui-base leading-5 text-foreground transition-colors hover:border-input-border-hover focus-within:border-input-border-focused focus-within:bg-input-focused", children: [_jsxs(Select, { value: builder.frequency, onValueChange: (value) => {
                                                    // Radix Select 在编辑旧 cron 的控件注册阶段可能发出空值，不能覆盖已解析频率。
                                                    if (!isCronFrequency(value)) {
                                                        logger.warn("[AutomationEditView] 忽略非法的频率选择值", {
                                                            automationId: editing?.automationId,
                                                            cronExpr: editing?.cronExpr,
                                                            value,
                                                        });
                                                        return;
                                                    }
                                                    markFieldTouched("schedule");
                                                    if (value === "custom") {
                                                        setCustomRepeatOpen(true);
                                                        return;
                                                    }
                                                    setBuilder((prev) => ({
                                                        ...prev,
                                                        frequency: value,
                                                        ...(value === "weekdays" ? { weekdays: [1, 2, 3, 4, 5] } : {}),
                                                    }));
                                                }, children: [_jsx(SelectTrigger, { variant: "ghost", "data-testid": TID_AUTOMATION_FREQUENCY_SELECT, className: "h-auto min-w-24 rounded-full border-0 bg-hover py-px pl-2 text-ui-base leading-5 text-foreground hover:bg-selected aria-expanded:bg-selected", indicator: _jsx(AutomationChevronDownIcon, {}), children: _jsx(SelectValue, { children: intl.formatMessage({
                                                                id: `automations.frequency.${builder.frequency}`,
                                                            }) }) }), _jsx(SelectContent, { children: FREQUENCIES.map((freq) => (_jsx(SelectItem, { value: freq, "data-testid": testId(TID_AUTOMATION_FREQUENCY_OPTION, freq), children: intl.formatMessage({
                                                                id: `automations.frequency.${freq}`,
                                                            }) }, freq))) })] }), builder.frequency === "monthly" ? (_jsxs(Select, { value: String(builder.dayOfMonth), onValueChange: (value) => {
                                                    markFieldTouched("schedule");
                                                    setBuilder((prev) => ({
                                                        ...prev,
                                                        dayOfMonth: Number(value),
                                                    }));
                                                }, children: [_jsx(SelectTrigger, { variant: "ghost", className: "h-auto w-auto rounded-full border-0 bg-hover py-px pl-2 pr-0.5 text-ui-base leading-5 text-foreground hover:bg-selected aria-expanded:bg-selected", indicator: _jsx(AutomationChevronDownIcon, {}), children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { className: "max-h-60", children: Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (_jsx(SelectItem, { value: String(day), children: intl.formatMessage({ id: "automations.form.dayOfMonth" }, { day: String(day) }) }, day))) })] })) : null, builder.frequency === "weekly" ? (_jsx(WeekdayPicker, { weekdays: builder.weekdays, intl: intl, onChange: (weekdays) => {
                                                    markFieldTouched("schedule");
                                                    setBuilder((prev) => ({ ...prev, weekdays }));
                                                } })) : null, builder.frequency === "custom" ? (_jsxs("button", { type: "button", "data-testid": TID_AUTOMATION_CUSTOM_REPEAT_EDIT, onClick: () => setCustomRepeatOpen(true), className: "inline-flex h-auto items-center gap-0.5 rounded-full bg-hover py-px pl-2 pr-0.5 text-ui-base leading-5 text-foreground hover:bg-selected", children: [_jsx("span", { children: intl.formatMessage({
                                                            id: "automations.customRepeat.compactFrequency",
                                                        }, {
                                                            interval: String(builder.customInterval),
                                                            unit: intl.formatMessage({
                                                                id: `automations.customRepeat.unit.${builder.customUnit === "minute"
                                                                    ? "minute"
                                                                    : builder.customUnit === "daily"
                                                                        ? "day"
                                                                        : builder.customUnit === "weekly"
                                                                            ? "week"
                                                                            : builder.customUnit === "monthly"
                                                                                ? "month"
                                                                                : builder.customUnit === "yearly"
                                                                                    ? "year"
                                                                                    : "hour"}`,
                                                            }),
                                                        }) }), _jsx(AutomationChevronDownIcon, {})] })) : null, builder.frequency !== "custom" && builder.frequency !== "hourly" ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-foreground", children: intl.formatMessage({
                                                            id: "automations.form.schedule.at",
                                                        }) }), _jsx(TimeOfDayPicker, { hour: builder.hour, minute: builder.minute, ariaLabel: intl.formatMessage({
                                                            id: "automations.form.schedule.label",
                                                        }), onChange: (hour, minute) => {
                                                            markFieldTouched("schedule");
                                                            setBuilder((prev) => ({ ...prev, hour, minute }));
                                                        } }), _jsx("span", { className: "whitespace-nowrap text-foreground-subtle", children: formatGmtOffset() })] })) : null, builder.frequency === "hourly" ? (_jsxs("div", { className: "flex items-center gap-1 text-ui-base leading-5 text-foreground", children: [_jsx("span", { children: intl.formatMessage({
                                                            id: "automations.form.schedule.minutePrefix",
                                                        }) }), _jsxs(Select, { value: String(builder.minute), onValueChange: (value) => {
                                                            markFieldTouched("schedule");
                                                            setBuilder((prev) => ({
                                                                ...prev,
                                                                minute: Number(value),
                                                            }));
                                                        }, children: [_jsx(SelectTrigger, { variant: "ghost", className: "h-auto w-14 rounded-full border-0 bg-hover py-px pl-2 text-ui-base leading-5 tabular-nums hover:bg-selected", children: _jsx(SelectValue, { children: pad2(builder.minute) }) }), _jsx(SelectContent, { className: "max-h-60", children: Array.from({ length: 60 }, (_, value) => (_jsx(SelectItem, { value: String(value), children: pad2(value) }, value))) })] }), _jsx("span", { children: intl.formatMessage({
                                                            id: "automations.form.schedule.minuteSuffix",
                                                        }) })] })) : null, builder.frequency === "custom" && builder.customUnit === "hourly" ? (_jsxs("div", { className: "flex items-center gap-1 text-ui-base leading-5 text-foreground", children: [_jsx("span", { children: intl.formatMessage({
                                                            id: "automations.form.schedule.at",
                                                        }) }), _jsxs(Select, { value: String(builder.minute), onValueChange: (value) => {
                                                            markFieldTouched("schedule");
                                                            setBuilder((prev) => ({
                                                                ...prev,
                                                                minute: Number(value),
                                                            }));
                                                        }, children: [_jsx(SelectTrigger, { variant: "ghost", className: "h-auto w-16 rounded-full border-0 bg-hover py-px pl-2 text-ui-base leading-5 tabular-nums hover:bg-selected", children: _jsx(SelectValue, { children: pad2(builder.minute) }) }), _jsx(SelectContent, { className: "max-h-60", children: Array.from({ length: 60 }, (_, value) => (_jsx(SelectItem, { value: String(value), children: pad2(value) }, value))) })] }), _jsx("span", { children: intl.formatMessage({
                                                            id: "automations.customRepeat.minutes",
                                                        }) })] })) : null, builder.frequency === "custom" && builder.customUnit === "yearly" ? (_jsx(MonthDayPicker, { month: builder.customMonth, day: builder.customMonthDays[0] ?? 1, intl: intl, onChange: (month, day) => {
                                                    markFieldTouched("schedule");
                                                    setBuilder((prev) => ({
                                                        ...prev,
                                                        customMonth: month,
                                                        customMonthDays: [day],
                                                    }));
                                                } })) : null, builder.frequency === "custom" &&
                                                builder.customUnit !== "hourly" &&
                                                builder.customUnit !== "minute" ? (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-foreground", children: intl.formatMessage({
                                                            id: "automations.form.schedule.at",
                                                        }) }), _jsx(TimeOfDayPicker, { hour: builder.hour, minute: builder.minute, onChange: (hour, minute) => {
                                                            markFieldTouched("schedule");
                                                            setBuilder((prev) => ({ ...prev, hour, minute }));
                                                        } }), _jsx("span", { className: "text-foreground-subtle", children: formatGmtOffset() })] })) : null, schedulePreview ? (_jsx("span", { "data-testid": TID_AUTOMATION_SCHEDULE_PREVIEW, className: "min-w-0 flex-1 truncate text-ui-base text-foreground-subtle sm:ml-1", children: schedulePreview })) : null, _jsx("button", { type: "button", "data-testid": TID_AUTOMATION_SCHEDULE_DELETE, onClick: handleRemoveSchedule, className: "absolute right-2 top-2 flex size-5 items-center justify-center text-foreground-subtle transition-colors hover:text-foreground", "aria-label": intl.formatMessage({ id: "common.delete" }), children: _jsx(AutomationTrashIcon, {}) })] }) })), _jsx(CustomRepeatDialog, { builder: builder, endAt: endAt, intl: intl, open: customRepeatOpen, onOpenChange: setCustomRepeatOpen, onConfirm: ({ interval, unit, weekdays, monthDays, monthlyMode, endAt: nextEndAt, }) => {
                                        markFieldTouched("schedule");
                                        setScheduleRemoved(false);
                                        clearRequiredFieldValidation("schedule");
                                        setBuilder((prev) => ({
                                            ...prev,
                                            frequency: "custom",
                                            customInterval: interval,
                                            customUnit: unit,
                                            customWeekdays: weekdays,
                                            customMonthDays: monthDays,
                                            customMonthlyMode: monthlyMode,
                                        }));
                                        setEndAt(nextEndAt);
                                    } })] })), _jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("label", { className: "text-ui-base font-normal leading-5 text-foreground-subtle", htmlFor: "automation-prompt", children: intl.formatMessage({ id: "automations.form.prompt.label" }) }), _jsxs(AutomationInstructionsComposer, { invalid: validationErrors.has("prompt") && !prompt.trim(), children: [_jsx(AutomationInstructionsTextarea, { id: "automation-prompt", "data-testid": TID_AUTOMATION_FORM_PROMPT, value: prompt, onChange: (event) => {
                                                markFieldTouched("prompt");
                                                clearRequiredFieldValidation("prompt");
                                                setPrompt(event.target.value);
                                            }, placeholder: intl.formatMessage({
                                                id: "automations.edit.promptPlaceholder",
                                            }), "aria-invalid": validationErrors.has("prompt") && !prompt.trim() }), _jsxs(AutomationInstructionsToolbar, { children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-0 text-foreground-subtle", children: [editing ? (_jsxs(Button, { type: "button", variant: "ghost", size: "xs", disabled: true, className: "h-auto min-h-7 gap-1 rounded-full px-2 py-1 text-ui-base font-normal leading-normal", children: [isSelectedConversationWorkspace ? (_jsx(MessageCircle, { className: "size-3.5", "aria-hidden": "true" })) : (_jsx(FolderOpen, { className: "size-3.5", "aria-hidden": "true" })), _jsx("span", { className: "max-w-40 truncate", children: selectedWorkspaceDisplayLabel })] })) : workspaceMenuTabs.length > 0 ? (_jsx(ChatEmptyWorkspacePreviewMenu, { workspacePath: selectedWorkspacePath, workspaceTabs: workspaceMenuTabs, 
                                                            // 定时任务允许选择 canonical conversation backing，但不提供 chip 上的快捷 X；
                                                            // 菜单展示统一复用会话侧「不在项目中工作」文案和 MessageCircle 图标。
                                                            allowConversationWorkspaceSelection: Boolean(conversationWorkspace), allowConversationWorkspaceDetach: false, onSelectWorkspace: handleSelectWorkspace, onSelectConversationWorkspace: handleSelectConversationWorkspace, allowOpenWorkspace: false, allowRemoteWorkspace: false, onOpenFolder: () => { }, onConnectRemote: async () => "", onSelectRemoteProject: async () => { }, onCancelRemoteProject: async (_sessionId) => { }, containerClassName: "contents", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "min-w-0 gap-1 px-2") })) : (_jsxs(Button, { type: "button", variant: "ghost", size: "xs", disabled: true, className: "h-auto min-h-7 gap-1 rounded-full px-2 py-1 text-ui-base font-normal leading-normal text-foreground-subtlest", children: [_jsx(FolderOpen, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({
                                                                    id: "automations.form.project.localRequired",
                                                                })] })), _jsx(ConfigSelect, { option: modeOption, onValueChange: (value) => {
                                                                markFieldTouched("mode");
                                                                modeRef.current = value;
                                                                setMode(value);
                                                            }, tooltipTitle: intl.formatMessage({
                                                                id: "chat.toolbar.mode.label",
                                                            }), triggerVariant: "ghost", triggerSize: "default", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "w-fit max-w-56 min-w-0 shrink justify-start gap-1 px-2"), labelVisibilityClassName: "inline-flex min-w-0 truncate text-left", provider: ZCODE_AGENT_PROVIDER, restoreFocusSelector: null })] }), _jsxs("div", { className: "flex min-w-0 flex-wrap items-center justify-end gap-0 text-foreground-subtle", children: [_jsx(ModelConfigSelect, { modelGroups: modelSelectGroups, normalizedValue: selectedModelItem?.value ?? "", triggerLabel: modelTriggerLabel, showManageModelsAction: Boolean(onManageModels), lockReasonMessage: "", isItemLocked: MODEL_ITEM_NEVER_LOCKED, onValueChange: handleModelValueChange, tooltipTitle: intl.formatMessage({
                                                                id: "chat.toolbar.model.label",
                                                            }), manageModelsLabel: intl.formatMessage({
                                                                id: "chat.toolbar.model.manageModels",
                                                            }), onManageModels: onManageModels, contentSide: "top", focusSelectorOnClose: null, labelVisibilityClassName: "hidden @sm/composer:inline-flex", indicatorClassName: "hidden @sm/composer:block", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "w-fit max-w-72 min-w-0 shrink @max-sm/composer:size-7 @max-sm/composer:justify-center @max-sm/composer:gap-0 @max-sm/composer:p-0"), triggerIconClassName: "inline-flex @sm/composer:hidden", disabled: modelSelectionRead.state.status !== "ready" }), modelSelectionRead.state.status === "error" ? (_jsx(Button, { type: "button", variant: "ghost", size: "xs", onClick: modelSelectionRead.reload, children: intl.formatMessage({ id: "common.retry" }) })) : null, thoughtLevelOption ? (_jsx(ThoughtLevelCycleControl, { intl: intl, option: thoughtLevelOption, provider: ZCODE_AGENT_PROVIDER, triggerRef: thoughtTriggerRef, indicatorClassName: "hidden @xl/composer:block", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "@max-sm/composer:size-7 @max-sm/composer:justify-center @max-sm/composer:p-0"), restoreFocusSelector: null, labelVisibilityClassName: "hidden @xl/composer:inline-flex", onValueChange: (value) => {
                                                                if (!effectiveSelection)
                                                                    return;
                                                                markFieldTouched("thoughtLevel");
                                                                // 用户改档位时以正在显示的模型身份形成新意图；只读刷新不改表单。
                                                                modelSelection.current = effectiveModelValue;
                                                                setModel(effectiveModelValue);
                                                                thoughtManuallyChangedRef.current = true;
                                                                thoughtLevelRef.current = value;
                                                                setThoughtLevel(value);
                                                            } })) : null] })] })] })] })] })) : (_jsxs("div", { children: [runsLoading && runs.length === 0 ? (_jsx("div", { className: "flex h-32 items-center justify-center", children: _jsx(Spinner, { className: "size-5" }) })) : runsEntry?.status === "error" ? (_jsx("div", { className: "rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-ui-sm text-destructive", children: runsEntry.error })) : runs.length === 0 ? (_jsx(AutomationHistoryEmptyState, { children: intl.formatMessage({ id: "automations.runs.empty" }) })) : (_jsx("div", { className: "overflow-x-auto rounded-[8px]", children: _jsxs("table", { className: "w-full text-left text-ui-base font-normal leading-normal tracking-[-0.08px]", children: [_jsx("thead", { className: "bg-surface text-foreground-subtle", children: _jsxs("tr", { className: "h-[30px] border-b border-border", children: [_jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({
                                                        id: "automations.runs.col.triggered",
                                                    }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({
                                                        id: "automations.runs.col.trigger",
                                                    }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({
                                                        id: "automations.runs.col.status",
                                                    }) }), _jsx("th", { className: "px-4 font-normal", children: intl.formatMessage({
                                                        id: "automations.runs.col.duration",
                                                    }) }), _jsx("th", { className: "px-4 font-normal" })] }) }), _jsx("tbody", { children: pagedRuns.map((run) => {
                                            const status = resolveRunStatus(run);
                                            const statusLabel = intl.formatMessage({
                                                id: `automations.runs.status.${status}`,
                                            });
                                            const statusBadge = (_jsxs("span", { className: "flex items-center text-ui-base leading-5 tracking-[-0.18px]", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", children: _jsx("span", { className: cn("inline-block size-1.5 rounded-full", RUN_STATUS_DOT_CLASS[status]) }) }), _jsx("span", { className: RUN_STATUS_TEXT_CLASS[status], children: statusLabel })] }));
                                            const canOpenSession = Boolean(run.sessionId && onOpenSession);
                                            const hasActions = canOpenSession || Boolean(onDeleteRun);
                                            return (_jsxs("tr", { className: "h-[46px] border-b border-border transition-colors last:border-b-0 hover:bg-surface-hover", children: [_jsx("td", { className: "whitespace-nowrap px-4 text-foreground-subtle", children: formatDateTime(run.scheduledAt ?? run.createdAt) }), _jsx("td", { className: "whitespace-nowrap px-4 text-foreground-subtle", children: intl.formatMessage({
                                                            id: `automations.trigger.${run.trigger}`,
                                                        }) }), _jsx("td", { className: "px-4", children: status === "failed" ? (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: statusBadge }), _jsx(TooltipContent, { side: "top", align: "start", sideOffset: 6, className: "max-w-96 whitespace-normal break-words", children: run.error?.trim() ||
                                                                            intl.formatMessage({
                                                                                id: "automations.runs.errorUnavailable",
                                                                            }) })] }) })) : (statusBadge) }), _jsx("td", { className: "whitespace-nowrap px-4 text-foreground-subtle", children: formatDuration(run.createdAt, run.updatedAt) }), _jsx("td", { className: "px-4", children: _jsx("div", { className: "flex items-center justify-end", children: hasActions ? (_jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx("button", { type: "button", "aria-label": intl.formatMessage({
                                                                                id: "automations.moreActions",
                                                                            }), className: "flex size-6 items-center justify-center rounded-[6px] text-foreground-subtle transition-colors hover:bg-white/10 hover:text-foreground data-[state=open]:bg-white/10 data-[state=open]:text-foreground", children: _jsx(AutomationMoreHorizontalIcon, { className: "size-4", "aria-hidden": "true" }) }) }), _jsxs(DropdownMenuContent, { align: "end", sideOffset: 4, className: "min-w-[160px]", children: [canOpenSession ? (_jsxs(DropdownMenuItem, { onSelect: () => onOpenSession?.(run.sessionId), children: [_jsx(AutomationExternalLinkIcon, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({
                                                                                        id: "automations.runs.openSession",
                                                                                    })] })) : null, onDeleteRun ? (_jsxs(_Fragment, { children: [canOpenSession ? _jsx(DropdownMenuSeparator, {}) : null, _jsxs(DropdownMenuItem, { variant: "destructive", onSelect: () => onDeleteRun(run.runId), children: [_jsx(AutomationTrashIcon, {}), intl.formatMessage({
                                                                                                id: "automations.runs.delete",
                                                                                            })] })] })) : null] })] })) : null }) })] }, run.runId));
                                        }) })] }) })), runs.length > 0 && runsTotalPages > 1 ? (_jsxs("nav", { className: "mt-4 flex items-center justify-between text-ui-base", children: [_jsxs("button", { type: "button", disabled: runsCurrentPage <= 1, onClick: () => setRunsPage(Math.max(1, runsCurrentPage - 1)), className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground-subtle transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40", children: [_jsx(ArrowLeft, { className: "size-3.5", "aria-hidden": "true" }), intl.formatMessage({ id: "automations.runs.prevPage" })] }), _jsx("div", { className: "flex items-center gap-1", children: runsPageItems.map((item, index) => item === "ellipsis" ? (_jsx("span", { className: "flex size-7 items-center justify-center text-foreground-subtlest", "aria-hidden": "true", children: "\u2026" }, `ellipsis-${index}`)) : (_jsx("button", { type: "button", "aria-current": item === runsCurrentPage ? "page" : undefined, onClick: () => setRunsPage(item), className: cn("inline-flex size-7 items-center justify-center rounded-[6px] transition-colors", item === runsCurrentPage
                                            ? "bg-surface text-foreground"
                                            : "text-foreground-subtle hover:bg-surface-hover hover:text-foreground"), children: item }, item))) }), _jsxs("button", { type: "button", disabled: runsCurrentPage >= runsTotalPages, onClick: () => setRunsPage(Math.min(runsTotalPages, runsCurrentPage + 1)), className: "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground-subtle transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40", children: [intl.formatMessage({ id: "automations.runs.nextPage" }), _jsx(ArrowRight, { className: "size-3.5", "aria-hidden": "true" })] })] })) : null] }))] }) }));
}
//# sourceMappingURL=AutomationEditView.js.map