import { type ComponentProps, type RefObject } from "react";
import { type ZCodeApiRetryStatus, type ZCodeConfigOption, type ZCodeConfigSelectValue, type ZCodeProvider } from "@zcode/shared";
import { SelectTrigger } from "@/components/ui/select.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { type LucideIcon } from "lucide-react";
export { ChatContextUsage, getContextCompressionCommand, getRenderableTaskUsage, } from "@/chat-input-toolbar/contextUsage.js";
type ConfigSelectTriggerSize = ComponentProps<typeof SelectTrigger>["size"];
type ConfigSelectTriggerVariant = ComponentProps<typeof SelectTrigger>["variant"];
/** Radix Select 在受控值与子项注册竞争时可能发出空值等未渲染值；直接上抛会把
 * 系统事件误当成用户选择（如 Automations 编辑页仅打开详情就被标记未保存修改）。
 * 用户只能点到已渲染的 option，值域外的选择回调一律丢弃。 */
export declare function isConfigSelectValueInOptions(option: ZCodeConfigOption, value: string): boolean;
export declare function buildModelSearchText({ itemName, }: {
    itemName: string;
}): string;
export declare function matchesModelDisplayNameSearch(modelDisplayName: string, searchText: string): boolean;
export declare function ChatApiRetryStatus({ apiRetry, intl, locale, }: {
    apiRetry: ZCodeApiRetryStatus | null;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    locale: string;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function getModeOptionDisplayLabel(intl: ReturnType<typeof useZCodeIntl>["intl"], provider: ZCodeProvider | undefined, entry: Pick<ZCodeConfigSelectValue, "name" | "value">): string;
export declare function getModeOptionLabelMessageId(provider: ZCodeProvider | undefined, entry: Pick<ZCodeConfigSelectValue, "value">): string | null;
export declare function getModeOptionDescriptionMessageId(provider: ZCodeProvider | undefined, entry: Pick<ZCodeConfigSelectValue, "value">): string | null;
export declare function getConfigOptionEntryLabel(intl: ReturnType<typeof useZCodeIntl>["intl"], provider: ZCodeProvider | undefined, option: ZCodeConfigOption, entry: ZCodeConfigSelectValue): string;
export declare function getConfigOptionEntryDescription(intl: ReturnType<typeof useZCodeIntl>["intl"], provider: ZCodeProvider | undefined, option: ZCodeConfigOption, entry: ZCodeConfigSelectValue): string | undefined;
export declare function isHighPermissionModeValue(value: unknown): boolean;
export declare function resolveModeOptionIcon(value: unknown): LucideIcon;
export declare function ConfigSelect({ option, onValueChange, open, onOpenChange, disabled, tooltipTitle, shortcutLabel, triggerRef, triggerClassName, indicatorClassName, triggerVariant, triggerSize, leadingIcon: LeadingIcon, labelVisibilityClassName, provider, restoreFocusSelector, }: {
    option: ZCodeConfigOption;
    onValueChange: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    tooltipTitle: string;
    shortcutLabel?: string;
    triggerRef?: RefObject<HTMLSpanElement | null>;
    triggerClassName?: string;
    indicatorClassName?: string;
    triggerVariant?: ConfigSelectTriggerVariant;
    triggerSize?: ConfigSelectTriggerSize;
    leadingIcon?: LucideIcon;
    labelVisibilityClassName?: string;
    provider?: ZCodeProvider;
    restoreFocusSelector?: string | null;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=display.d.ts.map