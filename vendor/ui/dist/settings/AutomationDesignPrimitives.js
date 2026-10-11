import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TID_AUTOMATION_CREATE_MANUALLY, TID_AUTOMATION_CREATE_MENU, } from "@zcode/shared";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../components/ui/dropdown-menu.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { AutomationSwitchToggle } from "../settings/AutomationSwitchToggle.js";
import { AutomationChevronDownIcon, AutomationInfoIcon, } from "../settings/AutomationIcons.js";
import { Button } from "../components/ui/button.js";
import { SettingsSegmentedTabs } from "../settings/SettingsSegmentedTabs.js";
export { AutomationAddScheduleIcon, AutomationCancelActionIcon, AutomationChevronDownIcon, AutomationClockIcon, AutomationContinueIcon, AutomationEditActionIcon, AutomationExternalLinkIcon, AutomationIdleTimeIcon, AutomationInfoIcon, AutomationMoreHorizontalIcon, AutomationPauseActionIcon, AutomationPausedIcon, AutomationRefreshIcon, AutomationRunNowIcon, AutomationTrashIcon, } from "../settings/AutomationIcons.js";
/** 设置页返回入口仅高亮图标与文本，保留点击热区但不显示 hover/focus 背景。 */
export const AUTOMATION_BACK_TRIGGER_CLASSNAME = "-m-1 inline-flex w-fit max-w-full min-w-0 items-center gap-1 bg-transparent p-1 text-ui-base leading-5 text-foreground-subtle transition-colors hover:text-foreground active:text-foreground focus-visible:text-foreground focus-visible:outline-none";
// 修复原因：space-y 给行内 label 添加 margin 时会受字体行盒影响，实际视觉间距小于设计稿的 6px。
export const AUTOMATION_FORM_FIELD_CLASSNAME = "flex flex-col gap-1.5";
/** 定时与闲时共用运行历史空态，防止透明留白与卡片容器样式再次漂移。 */
export function AutomationHistoryEmptyState({ children, }) {
    return (_jsx("div", { className: "flex min-h-[226px] items-center justify-center rounded-xl border border-dashed border-card-border bg-background px-4 text-center text-ui-base text-foreground-subtle", children: children }));
}
/** 定时与闲时设置页复用 Hooks scope tabs 的 pill 视觉，避免详情页分段样式漂移。 */
export function AutomationSettingsHistoryTabs({ value, settingsLabel, historyLabel, onValueChange, }) {
    return (_jsx(SettingsSegmentedTabs, { value: value, items: [
            { value: "settings", label: settingsLabel },
            { value: "history", label: historyLabel },
        ], onValueChange: onValueChange }));
}
/** Keep-awake 提示条；开关值由调用方接入全局共享设置，而非页面级 mock store。 */
export function AutomationKeepAwakeNotice({ checked, onChange, }) {
    const { intl } = useZCodeIntl();
    // 桌面断点曾清空提示栏的垂直内边距，导致实际样式偏离 12px 规格。
    return (_jsxs("div", { "data-automations-keep-awake": true, className: "flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-[10px] bg-surface px-3 py-3 text-foreground-subtle", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", "aria-hidden": "true", children: _jsx(AutomationInfoIcon, { className: "size-4" }) }), _jsx("p", { className: "min-w-0 flex-1 text-ui-base leading-5", children: intl.formatMessage({ id: "offPeak.keepAwakeBanner" }) }), _jsx(AutomationSwitchToggle, { checked: checked, ariaLabel: intl.formatMessage({ id: "offPeak.keepAwakeBanner" }), onChange: onChange, color: "blue", size: "sm" })] }));
}
export function AutomationCreateDropdown({ onViaChat, onManually, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs(DropdownMenu, { children: [_jsxs("div", { className: "inline-flex h-7 items-center overflow-hidden rounded-lg", children: [_jsx(Button, { type: "button", variant: "default", size: "default", className: "rounded-none border-0", "data-testid": TID_AUTOMATION_CREATE_MANUALLY, onClick: onManually, children: intl.formatMessage({ id: "automations.createManually" }) }), _jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { type: "button", variant: "default", size: "icon-md", "data-testid": TID_AUTOMATION_CREATE_MENU, "aria-label": intl.formatMessage({ id: "automations.create" }), className: "!w-6 rounded-none border-0", children: _jsx(AutomationChevronDownIcon, { size: 14 }) }) })] }), _jsx(DropdownMenuContent, { align: "end", sideOffset: 4, className: "w-auto min-w-0", children: _jsx(DropdownMenuItem, { className: "pr-6", onSelect: onViaChat, children: intl.formatMessage({ id: "automations.createViaChat" }) }) })] }));
}
//# sourceMappingURL=AutomationDesignPrimitives.js.map