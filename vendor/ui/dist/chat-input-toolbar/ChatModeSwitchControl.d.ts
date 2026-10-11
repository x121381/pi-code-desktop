import type { RefObject } from "react";
import type { ZCodeConfigOption, ZCodeProvider } from "@zcode/shared";
import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
export declare function ChatModeSwitchControl({ compactIconOnly, disabled, disabledReason, intl, labelVisibilityClassName, modeOption, modeShortcutLabel, modeTriggerRef, onConfigValueChange, open, onOpenChange, restoreFocusSelector, selectedProvider, }: {
    compactIconOnly?: boolean;
    disabled?: boolean;
    disabledReason?: string;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    labelVisibilityClassName?: string;
    modeOption: ZCodeConfigOption;
    modeShortcutLabel: string;
    modeTriggerRef: RefObject<HTMLSpanElement | null>;
    onConfigValueChange: (option: ZCodeConfigOption, value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    restoreFocusSelector?: string | null;
    selectedProvider: ZCodeProvider;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatModeSwitchControl.d.ts.map