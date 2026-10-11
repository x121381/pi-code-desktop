import type { ReactNode } from "react";
export { AutomationAddScheduleIcon, AutomationCancelActionIcon, AutomationChevronDownIcon, AutomationClockIcon, AutomationContinueIcon, AutomationEditActionIcon, AutomationExternalLinkIcon, AutomationIdleTimeIcon, AutomationInfoIcon, AutomationMoreHorizontalIcon, AutomationPauseActionIcon, AutomationPausedIcon, AutomationRefreshIcon, AutomationRunNowIcon, AutomationTrashIcon, } from "@/settings/AutomationIcons.js";
/** 设置页返回入口仅高亮图标与文本，保留点击热区但不显示 hover/focus 背景。 */
export declare const AUTOMATION_BACK_TRIGGER_CLASSNAME = "-m-1 inline-flex w-fit max-w-full min-w-0 items-center gap-1 bg-transparent p-1 text-ui-base leading-5 text-foreground-subtle transition-colors hover:text-foreground active:text-foreground focus-visible:text-foreground focus-visible:outline-none";
export declare const AUTOMATION_FORM_FIELD_CLASSNAME = "flex flex-col gap-1.5";
export type AutomationSettingsHistoryTab = "settings" | "history";
/** 定时与闲时共用运行历史空态，防止透明留白与卡片容器样式再次漂移。 */
export declare function AutomationHistoryEmptyState({ children, }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** 定时与闲时设置页复用 Hooks scope tabs 的 pill 视觉，避免详情页分段样式漂移。 */
export declare function AutomationSettingsHistoryTabs({ value, settingsLabel, historyLabel, onValueChange, }: {
    value: AutomationSettingsHistoryTab;
    settingsLabel: string;
    historyLabel: string;
    onValueChange: (value: AutomationSettingsHistoryTab) => void;
}): import("react/jsx-runtime").JSX.Element;
/** Keep-awake 提示条；开关值由调用方接入全局共享设置，而非页面级 mock store。 */
export declare function AutomationKeepAwakeNotice({ checked, onChange, }: {
    checked: boolean;
    onChange: (value: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function AutomationCreateDropdown({ onViaChat, onManually, }: {
    onViaChat: () => void;
    onManually: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AutomationDesignPrimitives.d.ts.map