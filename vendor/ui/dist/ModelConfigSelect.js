import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- 模型菜单同时维护触发器、模型项、provider family 连接方式子菜单和焦点恢复，拆开会增加受控 Dropdown 状态同步成本。 */
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { ControlHintTooltip } from "./ControlHintTooltip.js";
import { cn } from "./components/lib/utils.js";
import { Button } from "./components/ui/button.js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger, } from "./components/ui/dropdown-menu.js";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./components/ui/select.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "./components/ui/tooltip.js";
import { AlertCircle, CheckIcon, ChevronDownIcon, LoaderIcon, PackageIcon } from "lucide-react";
import { TID_CHAT_MODEL_SELECT_GROUP, TID_CHAT_MODEL_SELECT_ITEM, TID_CHAT_MODEL_SELECT_TRIGGER, testId, } from "@zcode/shared";
import { isCoarseTouchDevice, shouldRestoreChatInputFocusAfterPickerClose, } from "./lib/pickerFocus.js";
import { RollingToolbarLabel } from "./chat-input-toolbar/RollingToolbarLabel.js";
import { ModelInputCapabilityBadge } from "./components/ModelInputCapabilityBadge.js";
const EMPTY_MODEL_SELECT_FOOTER_ACTIONS = [];
export const MODEL_CONFIG_SELECT_BADGE_CLASS_NAME = "shrink-0 rounded-full bg-surface px-1 py-px text-ui-xs font-medium leading-normal text-foreground-subtle";
export function shouldShowModelProviderLevel(modelGroups) {
    return modelGroups.length > 0;
}
function isFamilyConnectionGroup(group) {
    return (group.key.startsWith("family:") ||
        Boolean(group.labelBadge?.trim()) ||
        (group.connectionOptions?.length ?? 0) > 0);
}
export function shouldRenderModelGroupSeparator(previousGroup, currentGroup) {
    if (!previousGroup) {
        return false;
    }
    return isFamilyConnectionGroup(previousGroup) || isFamilyConnectionGroup(currentGroup);
}
export function isModelSelectGroupSelected(group, normalizedValue) {
    return group.items.some((item) => item.value === normalizedValue);
}
export function getModelTriggerLabelClassName({ labelVisibilityClassName, triggerLabelClassName, }) {
    if (triggerLabelClassName?.trim()) {
        return triggerLabelClassName;
    }
    return cn("min-w-0 text-left", labelVisibilityClassName);
}
export const ModelConfigSelect = memo(function ModelConfigSelectComponent({ modelGroups, normalizedValue, triggerLabel, triggerLabelPrefix, triggerLabelValue, triggerLabelPrefixClassName, showManageModelsAction, lockReasonMessage, isItemLocked, onValueChange, onConnectionValueChange, disabled, tooltipTitle, guideTooltipTitle, guideTooltipOpen = false, onGuideTooltipDismiss, shortcutLabel, triggerRef, open: controlledOpen, onOpenChange, openRequestKey = 0, pendingLabel, pending, labelVisibilityClassName = "hidden @xl/composer:inline-flex", indicatorClassName, triggerClassName, triggerIconClassName = "hidden", triggerIcon, triggerLabelClassName: customTriggerLabelClassName, triggerTestId = TID_CHAT_MODEL_SELECT_TRIGGER, formatTriggerLabel, showProviderLevel, providerSubmenuClassName, footerActions = EMPTY_MODEL_SELECT_FOOTER_ACTIONS, manageModelsLabel, onManageModels, focusSelectorOnClose = '[data-testid="chat-input"]', contentSide = "top", contentAlign = "start", leadingItems, triggerBadge, }) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const lastOpenRequestKeyRef = useRef(openRequestKey);
    const hasSelectableModel = modelGroups.length > 0;
    // 闲时任务白名单只有一层模型值；只要存在 group 就强制展示 provider 层的话，
    // 下方已有的扁平模型分支永远不可达，也无法复用 New Task 模型选择器。
    const shouldShowProviderLevel = showProviderLevel ?? shouldShowModelProviderLevel(modelGroups);
    // 模型名和上游占位值可能大小写敏感，强制大写会把 `<synthetic>` 改成 `<SYNTHETIC>` 这类非原始值。
    const triggerDisplayLabel = triggerLabel;
    const renderedTriggerDisplayLabel = formatTriggerLabel?.(triggerDisplayLabel) ?? triggerDisplayLabel;
    const renderedPendingLabel = pendingLabel && formatTriggerLabel ? formatTriggerLabel(pendingLabel) : pendingLabel;
    const currentTriggerLabel = pending && renderedPendingLabel ? renderedPendingLabel : renderedTriggerDisplayLabel;
    const currentTriggerTitle = pending && pendingLabel ? pendingLabel : triggerDisplayLabel;
    const triggerLabelClassName = getModelTriggerLabelClassName({
        labelVisibilityClassName,
        triggerLabelClassName: customTriggerLabelClassName,
    });
    const handlePopoverOpenChange = useCallback((nextOpen) => {
        if (controlledOpen === undefined) {
            setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
    }, [controlledOpen, onOpenChange]);
    useEffect(() => {
        if (openRequestKey <= 0 || openRequestKey === lastOpenRequestKeyRef.current) {
            return;
        }
        lastOpenRequestKeyRef.current = openRequestKey;
        if (disabled) {
            return;
        }
        // 模型菜单是受控 DropdownMenu，快捷键不能依赖模拟 click 触发。
        // Tooltip/Dropdown 多层 asChild 合并 ref 时，click 可能找不到真实 trigger；这里直接打开菜单状态。
        handlePopoverOpenChange(true);
        triggerRef?.current?.focus();
    }, [disabled, handlePopoverOpenChange, openRequestKey, triggerRef]);
    const handleModelValueChange = useCallback((nextValue) => {
        onValueChange(nextValue);
    }, [onValueChange]);
    const triggerAriaLabel = useMemo(() => {
        return pending && pendingLabel ? pendingLabel : (tooltipTitle ?? currentTriggerTitle);
    }, [currentTriggerTitle, pending, pendingLabel, tooltipTitle]);
    const renderModelItem = useCallback((item) => {
        const itemLocked = isItemLocked(item.value);
        const itemSelected = item.value === normalizedValue;
        // React 的 key 不能跟随 props spread 传入，否则开发环境会在 CDP console 报警。
        const itemKey = item.key;
        const commonProps = {
            "data-model-option-locked": itemLocked ? "true" : undefined,
            "data-model-option-selected": itemSelected ? "true" : undefined,
            "data-testid": testId(TID_CHAT_MODEL_SELECT_ITEM, item.value),
            "data-checked": itemSelected ? "true" : undefined,
        };
        const content = (_jsxs(_Fragment, { children: [_jsxs("span", { className: "flex min-w-0 flex-1 items-center gap-1.5 text-left", children: [_jsx("span", { className: "min-w-0 truncate", title: item.name, children: item.name }), item.badgeLabel ? (_jsx("span", { className: MODEL_CONFIG_SELECT_BADGE_CLASS_NAME, children: item.badgeLabel })) : null, item.supportsVisionInput ? _jsx(ModelInputCapabilityBadge, {}) : null] }), itemLocked ? (_jsx(TooltipProvider, { children: _jsxs(Tooltip, { children: [_jsx(TooltipTrigger, { asChild: true, children: _jsx("span", { className: "inline-flex size-4 items-center justify-center rounded-full text-foreground-subtlest hover:text-foreground-subtle", onClick: (event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }, onPointerDown: (event) => {
                                        event.preventDefault();
                                        event.stopPropagation();
                                    }, children: _jsx(AlertCircle, { className: "size-4" }) }) }), _jsx(TooltipContent, { side: "right", align: "center", sideOffset: 6, children: lockReasonMessage })] }) })) : null, itemLocked && itemSelected ? (_jsx(CheckIcon, { className: "size-4 text-foreground-subtle" })) : null] }));
        if (itemLocked) {
            return (_jsx(DropdownMenuItem, { ...commonProps, className: "min-h-8 cursor-not-allowed gap-2 px-2 text-ui-base text-foreground-subtlest data-[highlighted]:text-foreground-subtlest", onSelect: (event) => event.preventDefault(), children: content }, itemKey));
        }
        return (_jsx(DropdownMenuRadioItem, { ...commonProps, value: item.value, className: "min-h-8 gap-2 pl-2 pr-8 text-ui-base", onSelect: () => {
                handleModelValueChange(item.value);
                handlePopoverOpenChange(false);
            }, children: content }, itemKey));
    }, [
        handleModelValueChange,
        handlePopoverOpenChange,
        isItemLocked,
        lockReasonMessage,
        normalizedValue,
    ]);
    const renderModelItems = useCallback((items) => (_jsx(DropdownMenuRadioGroup, { value: normalizedValue, children: items.map((item) => renderModelItem(item)) })), [normalizedValue, renderModelItem]);
    const renderGroupLabel = useCallback((group, options = {}) => (_jsxs("span", { className: "min-w-0 flex-1 items-center gap-1.5 text-left inline-flex", children: [_jsx("span", { className: cn("min-w-0 whitespace-normal break-words text-ui-base", options.mutedLabel && "text-foreground-subtle"), title: group.label, children: group.label }), group.labelBadge ? (_jsx("span", { className: MODEL_CONFIG_SELECT_BADGE_CLASS_NAME, children: group.labelBadge })) : null] })), []);
    const renderProviderConnectionHeader = useCallback((group) => {
        const options = group.connectionOptions ?? [];
        if (options.length > 0) {
            const selectedOptionKey = group.selectedOptionKey ?? options[0]?.key;
            const selectedConnection = options.find((option) => option.key === selectedOptionKey) ?? options[0];
            return (_jsxs("div", { className: "flex min-h-8 items-center gap-2 px-2 py-1", children: [_jsx("span", { className: "min-w-0 flex-1 truncate text-left text-ui-sm font-medium text-foreground-subtlest", title: group.label, children: group.label }), _jsxs(Select, { value: selectedOptionKey, onValueChange: (nextKey) => {
                            const option = options.find((candidate) => candidate.key === nextKey);
                            if (!option) {
                                return;
                            }
                            // 切换连接方式后需要保留外层模型菜单，方便用户继续选择刷新后的模型。
                            onConnectionValueChange?.(option);
                        }, children: [_jsx(SelectTrigger, { size: "xs", variant: "outline", className: "min-w-0 shrink-0 gap-0.5 rounded-full pr-1.5 text-ui-sm text-foreground-subtle [&_svg]:size-3", "data-testid": testId(TID_CHAT_MODEL_SELECT_GROUP, group.key), "data-model-provider-key": group.key, onPointerDown: (event) => event.stopPropagation(), onKeyDown: (event) => event.stopPropagation(), children: _jsx("span", { className: "max-w-28 truncate", children: selectedConnection?.badgeLabel ?? selectedConnection?.label ?? group.label }) }), _jsx(SelectContent, { align: "end", position: "popper", className: "w-max min-w-40 max-w-72", onCloseAutoFocus: (event) => event.preventDefault(), children: options.map((option) => (_jsx(SelectItem, { value: option.key, "data-model-connection-option": option.key, children: option.label }, option.key))) })] })] }));
        }
        return null;
    }, [onConnectionValueChange]);
    const renderedFooterActions = useMemo(() => {
        const actions = [...footerActions];
        if (showManageModelsAction && manageModelsLabel) {
            actions.push({
                key: "manage-models",
                label: manageModelsLabel,
                onSelect: onManageModels,
            });
        }
        return actions;
    }, [footerActions, manageModelsLabel, onManageModels, showManageModelsAction]);
    const modelTrigger = (_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { type: "button", variant: "ghost", size: "default", disabled: disabled, "data-chat-toolbar-popover-trigger": "true", "data-testid": triggerTestId, "data-model-current-value": normalizedValue, "aria-label": triggerAriaLabel, onClick: guideTooltipOpen ? onGuideTooltipDismiss : undefined, className: cn("w-fit justify-between gap-1 rounded-lg pl-2 pr-1.5 text-ui-base whitespace-nowrap", triggerClassName), children: [triggerIcon ?? (_jsx(PackageIcon, { className: cn("pointer-events-none size-4 shrink-0 text-current", triggerIconClassName), "aria-hidden": "true" })), _jsx("span", { className: triggerLabelClassName, title: currentTriggerTitle, children: _jsx(RollingToolbarLabel, { label: currentTriggerLabel, prefix: pending ? undefined : triggerLabelPrefix, prefixClassName: triggerLabelPrefixClassName, value: pending ? undefined : triggerLabelValue }) }), triggerBadge, pending ? (_jsx(LoaderIcon, { className: "pointer-events-none size-3.5 animate-spin text-foreground" })) : null, !pending && (_jsx(ChevronDownIcon, { className: cn("pointer-events-none size-3.5 text-foreground-subtle", indicatorClassName) }))] }) }));
    return (_jsxs(DropdownMenu, { open: open, onOpenChange: handlePopoverOpenChange, children: [tooltipTitle ? (_jsx(ControlHintTooltip, { title: guideTooltipOpen && guideTooltipTitle ? guideTooltipTitle : tooltipTitle, shortcut: guideTooltipOpen ? undefined : shortcutLabel, triggerRef: triggerRef, open: guideTooltipOpen ? true : undefined, className: guideTooltipOpen ? "bg-background py-0.5 pr-0.5 pl-2" : undefined, children: modelTrigger })) : (modelTrigger), open ? (_jsxs(DropdownMenuContent, { className: cn(shouldShowProviderLevel
                    ? "w-max min-w-48 max-w-[calc(100vw-2rem)]"
                    : "w-48 max-h-72 overflow-y-auto"), align: contentAlign, side: contentSide, onCloseAutoFocus: (event) => {
                    if (!focusSelectorOnClose) {
                        // Automations 没有聊天输入框可恢复；保留 Radix 默认行为，
                        // 让键盘焦点回到触发器，而不是 preventDefault 后掉到 body。
                        return;
                    }
                    event.preventDefault();
                    if (!shouldRestoreChatInputFocusAfterPickerClose({
                        isCoarseTouchDevice: isCoarseTouchDevice(),
                    })) {
                        return;
                    }
                    // 聊天输入框的 data-testid 挂在 contenteditable 自身上，不是父节点。
                    // 这里与 mode 选择器保持同一个入口，避免关闭模型弹层后找不到输入框而丢失焦点。
                    const input = document.querySelector(focusSelectorOnClose);
                    input?.focus();
                }, children: [leadingItems !== undefined && leadingItems.length > 0 ? (_jsxs(_Fragment, { children: [renderModelItems(leadingItems), hasSelectableModel ? _jsx(DropdownMenuSeparator, {}) : null] })) : null, hasSelectableModel && shouldShowProviderLevel
                        ? modelGroups.map((group, index) => {
                            const groupSeparator = shouldRenderModelGroupSeparator(modelGroups[index - 1], group) ? (_jsx(DropdownMenuSeparator, {})) : null;
                            if (group.directItems) {
                                return (_jsxs(Fragment, { children: [groupSeparator, _jsxs("div", { children: [_jsx(DropdownMenuLabel, { className: "flex min-h-8 items-center px-2 py-1", "data-testid": testId(TID_CHAT_MODEL_SELECT_GROUP, group.key), "data-model-provider-key": group.key, children: renderGroupLabel(group) }), renderProviderConnectionHeader(group), _jsx(DropdownMenuRadioGroup, { value: normalizedValue, children: group.items.map((item) => renderModelItem(item)) })] })] }, group.key));
                            }
                            const groupSelected = isModelSelectGroupSelected(group, normalizedValue);
                            return (_jsxs(Fragment, { children: [groupSeparator, _jsxs(DropdownMenuSub, { children: [_jsxs(DropdownMenuSubTrigger, { className: "min-h-8", "data-testid": testId(TID_CHAT_MODEL_SELECT_GROUP, group.key), "data-model-provider-key": group.key, "data-model-provider-selected": groupSelected ? "true" : undefined, children: [renderGroupLabel(group), groupSelected ? (_jsx(CheckIcon, { className: "size-4 text-foreground-subtle" })) : null] }), _jsx(DropdownMenuSubContent, { className: cn("max-h-72 overflow-y-auto", 
                                                // 固定宽度会提前截断模型名；按内容扩展，并让可用空间优先于最小宽度。
                                                providerSubmenuClassName ??
                                                    "w-max min-w-[min(12rem,var(--radix-dropdown-menu-content-available-width))] max-w-(--radix-dropdown-menu-content-available-width)"), children: renderModelItems(group.items) })] })] }, group.key));
                        })
                        : hasSelectableModel
                            ? renderModelItems(modelGroups[0]?.items ?? [])
                            : null, renderedFooterActions.length > 0 ? (_jsxs("div", { className: "sticky bottom-0 z-10 bg-menu after:absolute after:left-0 after:top-full after:h-1 after:w-full after:bg-menu after:content-['']", children: [hasSelectableModel ? _jsx(DropdownMenuSeparator, {}) : null, renderedFooterActions.map((action) => (_jsxs(DropdownMenuItem, { className: "min-h-8 gap-2 px-2", "data-model-footer-action": action.key, "data-model-footer-action-selected": action.selected ? "true" : undefined, onSelect: () => {
                                    handlePopoverOpenChange(false);
                                    action.onSelect?.();
                                }, children: [_jsx("span", { className: "min-w-0 flex-1 truncate", children: action.label }), action.selected ? _jsx(CheckIcon, { className: "size-4 text-foreground-subtle" }) : null] }, action.key)))] })) : null] })) : null] }));
});
//# sourceMappingURL=ModelConfigSelect.js.map