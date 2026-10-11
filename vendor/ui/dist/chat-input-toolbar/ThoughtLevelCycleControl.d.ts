import { type RefObject } from "react";
import { type ZCodeConfigOption, type ZCodeProvider } from "@zcode/shared";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
type ThoughtLevelInteractionMode = "select" | "cycle";
export declare function ThoughtLevelCycleControl({ disabled, disabledReason, composerCollapsePriority, interactionMode, indicatorClassName, intl, labelVisibilityClassName, option, provider, showInvalidCurrentValue, restoreFocusSelector, shortcutLabel, triggerClassName, triggerRef, open, onOpenChange, onCurrentValueCommit, onValueChange, }: {
    disabled?: boolean;
    disabledReason?: string;
    /** 聊天输入框由统一布局 owner 收起文字，其他调用方保留原断点规则。 */
    composerCollapsePriority?: number;
    interactionMode?: ThoughtLevelInteractionMode;
    indicatorClassName?: string;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    labelVisibilityClassName?: string;
    option: ZCodeConfigOption;
    provider?: ZCodeProvider;
    showInvalidCurrentValue?: boolean;
    restoreFocusSelector?: string | null;
    shortcutLabel?: string;
    triggerClassName?: string;
    triggerRef: RefObject<HTMLSpanElement | null>;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onCurrentValueCommit?: (value: string) => void;
    onValueChange: (value: string) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=ThoughtLevelCycleControl.d.ts.map