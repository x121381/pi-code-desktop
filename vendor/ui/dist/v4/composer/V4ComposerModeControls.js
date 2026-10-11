import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useCallback, useMemo } from "react";
import { LightbulbIcon, XIcon, ChevronDownIcon } from "lucide-react";
import { TID_CHAT_MODE_SELECT_TRIGGER, TID_CHAT_MODE_SELECT_ITEM, TID_V4_COMPOSER_INPUT, ZCODE_AGENT_PROVIDER, getZCodeAgentAvailableModes, testId, } from "@zcode/shared";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu.js";
import { Button } from "@/components/ui/button.js";
import { cn } from "@/components/lib/utils.js";
import { getModeOptionDisplayLabel, getModeOptionDescriptionMessageId, resolveModeOptionIcon, } from "@/chat-input-toolbar/display.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { isCoarseTouchDevice } from "@/lib/pickerFocus.js";
import { useShortcutCommandLabel } from "@/shortcuts/useShortcutBindings.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { getNextConfigSelectValue, useToolbarShortcutBindings, } from "@/v4/composer/toolbarShortcuts.js";
function noop() { }
/** Plan 是独立勾选项，三种权限仍为单选；只编辑草稿，不向 Runtime 发切换命令。 */
function V4ComposerModeSwitchImpl({ provider, draftConfig, disabled, activeConfigPicker, onConfigPickerOpenChange, onSwitchMode, }) {
    const { intl } = useZCodeIntl();
    const displayProvider = provider ?? ZCODE_AGENT_PROVIDER;
    const modeShortcutLabel = useShortcutCommandLabel("cycleSessionMode");
    const modes = getZCodeAgentAvailableModes();
    const permissions = modes.filter((mode) => mode.id !== "plan");
    // 新菜单隐藏 Edit，但历史草稿仍可回显，不能因候选变化隐藏整个权限入口。
    const selected = permissions.find((mode) => mode.id === draftConfig?.mode) ??
        (draftConfig?.mode === "edit" ? { id: "edit", name: "Edit" } : undefined);
    const label = (mode) => getModeOptionDisplayLabel(intl, displayProvider, { value: mode.id, name: mode.name });
    const plan = modes.find((mode) => mode.id === "plan");
    const planLabel = label(plan);
    // Plan 拆成独立勾选项后仍需保留原菜单说明，复用相同的国际化映射。
    const planDescriptionId = getModeOptionDescriptionMessageId(displayProvider, { value: plan.id });
    const modeOption = useMemo(() => ({
        id: "mode",
        name: "Mode",
        category: "mode",
        type: "select",
        currentValue: draftConfig?.mode ?? "build",
        options: getZCodeAgentAvailableModes()
            .filter((mode) => mode.id !== "plan")
            .map((mode) => ({ value: mode.id, name: mode.name })),
    }), [draftConfig?.mode]);
    const cycle = useCallback(() => {
        const next = getNextConfigSelectValue(modeOption);
        if (next)
            onSwitchMode(next);
    }, [modeOption, onSwitchMode]);
    useToolbarShortcutBindings({
        hasAnyOption: Boolean(selected),
        toolbarDisabled: disabled,
        modelMenuDisabled: true,
        modeOption,
        onCycleSessionMode: cycle,
        onOpenModelMenu: noop,
        onCycleThoughtLevel: noop,
    });
    if (!selected)
        return null;
    const Icon = resolveModeOptionIcon(selected.id);
    return (_jsxs("div", { className: "flex min-w-0 items-center gap-1", children: [_jsxs(DropdownMenu, { open: activeConfigPicker === "mode", onOpenChange: (open) => onConfigPickerOpenChange("mode", open), children: [_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.toolbar.mode.label" }), shortcut: modeShortcutLabel, open: activeConfigPicker === "mode" ? false : undefined, children: _jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", disabled: disabled, "data-testid": TID_CHAT_MODE_SELECT_TRIGGER, "data-composer-collapse-priority": "1", "aria-label": intl.formatMessage({ id: "chat.toolbar.mode.label" }), className: cn("group/mode h-7 gap-1 rounded-lg px-2 text-ui-base data-[composer-compact=true]:w-7 data-[composer-compact=true]:px-0", selected.id === "yolo" && "text-warning hover:text-warning", selected.id === "guarded" &&
                                    "text-icon-blue hover:text-icon-blue aria-expanded:text-icon-blue"), children: [_jsx(Icon, { className: "size-4" }), _jsx("span", { className: "inline group-data-[composer-compact=true]/mode:hidden", children: label(selected) }), _jsx(ChevronDownIcon, { className: "size-3.5 group-data-[composer-compact=true]/mode:hidden" })] }) }) }), _jsxs(DropdownMenuContent, { side: "top", sideOffset: 4, className: "w-64", onCloseAutoFocus: (event) => {
                            event.preventDefault();
                            if (!isCoarseTouchDevice())
                                document
                                    .querySelector(`[data-testid="${TID_V4_COMPOSER_INPUT}"]`)
                                    ?.focus();
                        }, children: [_jsxs(DropdownMenuCheckboxItem, { checked: draftConfig?.planEnabled ?? false, onCheckedChange: (checked) => onSwitchMode(checked ? "plan" : "plan-off"), "data-testid": testId(TID_CHAT_MODE_SELECT_ITEM, "plan"), className: "min-h-13 items-start gap-3 py-2", children: [_jsx(LightbulbIcon, { className: "mt-0.5 size-4.5 shrink-0" }), _jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [_jsx("span", { children: planLabel }), planDescriptionId && (_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: planDescriptionId }) }))] })] }), _jsx(DropdownMenuSeparator, {}), _jsx(DropdownMenuRadioGroup, { value: selected.id, onValueChange: onSwitchMode, children: permissions.map((mode) => {
                                    const ModeIcon = resolveModeOptionIcon(mode.id);
                                    const descriptionId = getModeOptionDescriptionMessageId(displayProvider, {
                                        value: mode.id,
                                    });
                                    return (_jsxs(DropdownMenuRadioItem, { value: mode.id, "data-testid": testId(TID_CHAT_MODE_SELECT_ITEM, mode.id), className: "min-h-13 items-start gap-3 py-2", children: [_jsx(ModeIcon, { className: "mt-0.5 size-4.5 shrink-0" }), _jsxs("span", { className: "flex min-w-0 flex-col gap-0.5", children: [_jsx("span", { children: label(mode) }), descriptionId && (_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: descriptionId }) }))] })] }, mode.id));
                                }) })] })] }), draftConfig?.planEnabled && (_jsxs("span", { "data-testid": "v4-composer-plan-marker", className: "flex items-center gap-1", children: [_jsx("span", { role: "separator", "aria-orientation": "vertical", className: "h-3 w-px shrink-0 bg-border" }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "chat.plan.removeMarker" }), children: _jsxs(Button, { type: "button", variant: "ghost", size: "sm", disabled: disabled, "data-composer-collapse-priority": "2", onClick: () => onSwitchMode("plan-off"), "aria-label": intl.formatMessage({ id: "chat.plan.removeMarker" }), className: "group/plan h-7 gap-1 rounded-lg px-2 text-ui-base text-foreground-subtle hover:text-foreground-subtle data-[composer-compact=true]:w-7 data-[composer-compact=true]:px-0", children: [_jsx(LightbulbIcon, { className: "size-4 group-hover/plan:hidden group-focus-visible/plan:hidden" }), _jsx(XIcon, { className: "hidden size-4 group-hover/plan:block group-focus-visible/plan:block" }), _jsx("span", { className: "inline group-data-[composer-compact=true]/plan:hidden", children: intl.formatMessage({ id: "mode.plan" }) })] }) })] }))] }));
}
export const V4ComposerModeSwitch = memo(V4ComposerModeSwitchImpl);
//# sourceMappingURL=V4ComposerModeControls.js.map