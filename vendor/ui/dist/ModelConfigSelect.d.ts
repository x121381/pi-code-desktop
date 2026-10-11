import { type ReactNode, type RefObject } from "react";
export interface ModelSelectGroupItem {
    key: string;
    value: string;
    name: string;
    badgeLabel?: string;
    supportsVisionInput?: boolean;
}
export interface ModelSelectConnectionOption {
    key: string;
    label: string;
    badgeLabel?: string;
    value: string;
    providerId: string;
    familyId: string;
    mode: "oauth" | "apiKey";
    disabled?: boolean;
}
export interface ModelSelectGroup {
    key: string;
    label: string;
    labelBadge?: string;
    directItems?: boolean;
    selectedOptionKey?: string;
    connectionOptions?: ModelSelectConnectionOption[];
    items: ModelSelectGroupItem[];
}
export interface ModelSelectFooterAction {
    key: string;
    label: string;
    selected?: boolean;
    onSelect?: () => void;
}
export declare const MODEL_CONFIG_SELECT_BADGE_CLASS_NAME = "shrink-0 rounded-full bg-surface px-1 py-px text-ui-xs font-medium leading-normal text-foreground-subtle";
export declare function shouldShowModelProviderLevel(modelGroups: readonly ModelSelectGroup[]): boolean;
export declare function shouldRenderModelGroupSeparator(previousGroup: Pick<ModelSelectGroup, "connectionOptions" | "key" | "labelBadge"> | undefined, currentGroup: Pick<ModelSelectGroup, "connectionOptions" | "key" | "labelBadge">): boolean;
export declare function isModelSelectGroupSelected(group: Pick<ModelSelectGroup, "items">, normalizedValue: string): boolean;
export declare function getModelTriggerLabelClassName({ labelVisibilityClassName, triggerLabelClassName, }: {
    labelVisibilityClassName: string | undefined;
    triggerLabelClassName?: string;
}): string;
interface ModelConfigSelectProps {
    modelGroups: readonly ModelSelectGroup[];
    normalizedValue: string;
    triggerLabel: string;
    triggerLabelPrefix?: string;
    triggerLabelValue?: string;
    triggerLabelPrefixClassName?: string;
    showManageModelsAction: boolean;
    lockReasonMessage: string;
    isItemLocked: (candidateValue: string) => boolean;
    onValueChange: (value: string) => void;
    onConnectionValueChange?: (option: ModelSelectConnectionOption) => void;
    disabled?: boolean;
    tooltipTitle?: string;
    guideTooltipTitle?: ReactNode;
    guideTooltipOpen?: boolean;
    onGuideTooltipDismiss?: () => void;
    shortcutLabel?: string;
    triggerRef?: RefObject<HTMLSpanElement | null>;
    /** 传入时由调用方统一协调菜单；省略则保持组件原有的内部开关状态。 */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    openRequestKey?: number;
    pendingLabel?: string | null;
    pending?: boolean;
    labelVisibilityClassName?: string;
    indicatorClassName?: string;
    triggerClassName?: string;
    triggerIconClassName?: string;
    triggerIcon?: ReactNode;
    triggerLabelClassName?: string;
    triggerTestId?: string;
    formatTriggerLabel?: (label: string) => string;
    /** false 时把第一个 group 作为无 provider 层的扁平模型列表展示。 */
    showProviderLevel?: boolean;
    /** 覆盖 provider 二级模型菜单样式；缺省按内容扩展并保留最小宽度。 */
    providerSubmenuClassName?: string;
    footerActions?: readonly ModelSelectFooterAction[];
    manageModelsLabel?: string;
    onManageModels?: () => void;
    focusSelectorOnClose?: string | null;
    contentSide?: "top" | "bottom" | "left" | "right";
    contentAlign?: "start" | "center" | "end";
    /**
     * 排在所有分组之上的单选项（与分组之间隔一条线）。工作流「配置」弹层用它把「会话模型」放在第一位；
     * 缺省即无。
     */
    leadingItems?: readonly ModelSelectGroupItem[];
    /** 触发器里标签之后的小徽标（如「会话模型」「不可用」）；缺省即无。 */
    triggerBadge?: ReactNode;
}
export declare const ModelConfigSelect: import("react").MemoExoticComponent<({ modelGroups, normalizedValue, triggerLabel, triggerLabelPrefix, triggerLabelValue, triggerLabelPrefixClassName, showManageModelsAction, lockReasonMessage, isItemLocked, onValueChange, onConnectionValueChange, disabled, tooltipTitle, guideTooltipTitle, guideTooltipOpen, onGuideTooltipDismiss, shortcutLabel, triggerRef, open: controlledOpen, onOpenChange, openRequestKey, pendingLabel, pending, labelVisibilityClassName, indicatorClassName, triggerClassName, triggerIconClassName, triggerIcon, triggerLabelClassName: customTriggerLabelClassName, triggerTestId, formatTriggerLabel, showProviderLevel, providerSubmenuClassName, footerActions, manageModelsLabel, onManageModels, focusSelectorOnClose, contentSide, contentAlign, leadingItems, triggerBadge, }: ModelConfigSelectProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=ModelConfigSelect.d.ts.map