import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { TID_CHAT_THOUGHT_LEVEL_SELECT_ITEM, TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER, testId, } from "@zcode/shared";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select.js";
import { isCoarseTouchDevice, shouldRestoreChatInputFocusAfterPickerClose, } from "@/lib/pickerFocus.js";
import { getThoughtLevelLabel, isNoThoughtLevel, } from "@/chat-input-toolbar/thoughtLevelOptions.js";
import { RollingToolbarLabel } from "@/chat-input-toolbar/RollingToolbarLabel.js";
export function ThoughtLevelCycleControl({ disabled, disabledReason, composerCollapsePriority, interactionMode = "select", indicatorClassName, intl, labelVisibilityClassName = "hidden @xl/composer:inline-flex", option, provider, showInvalidCurrentValue = false, restoreFocusSelector = '[data-testid="chat-input"]', shortcutLabel, triggerClassName, triggerRef, open, onOpenChange, onCurrentValueCommit, onValueChange, }) {
    const composerTriggerClassName = composerCollapsePriority !== undefined
        ? "group/thought shrink-0 data-[composer-compact=icon]:size-7 data-[composer-compact=icon]:justify-center data-[composer-compact=icon]:gap-0 data-[composer-compact=icon]:p-0"
        : undefined;
    const labelRef = useRef(null);
    const pendingCurrentValueCommitRef = useRef(null);
    const [inlineLabelVisible, setInlineLabelVisible] = useState(true);
    const updateInlineLabelVisible = useCallback((element) => {
        if (!element) {
            return;
        }
        const style = window.getComputedStyle(element);
        const visible = style.display !== "none" &&
            style.visibility !== "hidden" &&
            element.getClientRects().length > 0;
        setInlineLabelVisible(visible);
    }, []);
    // RAF-based debounce to coalesce resize events
    let rafId = null;
    const debouncedUpdateInlineLabelVisible = () => {
        if (rafId !== null)
            return;
        rafId = requestAnimationFrame(() => {
            rafId = null;
            updateInlineLabelVisible(labelRef.current);
        });
    };
    const entries = option.type === "select" ? (option.options ?? []) : [];
    const selectedEntryIndex = entries.findIndex((entry) => entry.value === option.currentValue);
    const currentValueIsValid = selectedEntryIndex >= 0;
    const shouldShowInvalidCurrentValue = showInvalidCurrentValue &&
        !currentValueIsValid &&
        Boolean(String(option.currentValue ?? "").trim());
    const currentIndex = Math.max(0, selectedEntryIndex);
    const currentEntry = entries[currentIndex] ?? entries[0];
    const isFixedThoughtLevel = entries.length === 1 && currentValueIsValid;
    const currentLabel = shouldShowInvalidCurrentValue
        ? String(option.currentValue)
        : currentValueIsValid && currentEntry
            ? getThoughtLevelLabel(intl, provider, option, currentEntry)
            : intl.formatMessage({ id: "chat.toolbar.thoughtLevel.placeholder" });
    const tooltipTitle = intl.formatMessage({
        id: "chat.toolbar.thoughtLevel.tooltip",
    });
    const effectiveTooltipTitle = disabledReason ?? (inlineLabelVisible ? tooltipTitle : currentLabel);
    useEffect(() => {
        const labelElement = labelRef.current;
        if (!labelElement) {
            return;
        }
        updateInlineLabelVisible(labelElement);
        const observer = typeof ResizeObserver === "undefined"
            ? null
            : new ResizeObserver(() => {
                debouncedUpdateInlineLabelVisible();
            });
        observer?.observe(labelElement);
        if (labelElement.parentElement) {
            observer?.observe(labelElement.parentElement);
        }
        window.addEventListener("resize", debouncedUpdateInlineLabelVisible);
        return () => {
            observer?.disconnect();
            window.removeEventListener("resize", debouncedUpdateInlineLabelVisible);
            if (rafId !== null)
                cancelAnimationFrame(rafId);
        };
    }, [currentLabel, labelVisibilityClassName]);
    // 配置顺序不再经过名称排序，关闭项可能位于任意位置；只计算当前项之前的非关闭项。
    // 未选／失效及关闭值始终为零进度，不能把缺失选择投影成首档。
    const thinkingEntries = entries.filter((entry) => !isNoThoughtLevel(entry));
    const activeDotCount = !currentValueIsValid || !currentEntry || isNoThoughtLevel(currentEntry)
        ? 0
        : thinkingEntries.indexOf(currentEntry) + 1;
    const dotCount = Math.max(1, thinkingEntries.length);
    const progressPercent = (activeDotCount / dotCount) * 100;
    if (option.type !== "select" || entries.length === 0 || !currentEntry) {
        return null;
    }
    const handleClick = () => {
        const nextIndex = !currentValueIsValid ? 0 : (currentIndex + 1) % entries.length;
        const nextEntry = entries[nextIndex];
        if (!nextEntry) {
            return;
        }
        onValueChange(nextEntry.value);
    };
    const armCurrentValueCommit = (value) => {
        if (!onCurrentValueCommit || value !== String(option.currentValue)) {
            return;
        }
        pendingCurrentValueCommitRef.current = value;
        // Radix 对 typeahead Space 不执行选择。只在同一轮交互确实关闭
        // Select 时提交当前值，未关闭的键盘意图在微任务中作废。
        queueMicrotask(() => {
            if (pendingCurrentValueCommitRef.current === value) {
                pendingCurrentValueCommitRef.current = null;
            }
        });
    };
    const handleSelectOpenChange = (nextOpen) => {
        if (nextOpen) {
            pendingCurrentValueCommitRef.current = null;
        }
        else {
            const committedValue = pendingCurrentValueCommitRef.current;
            pendingCurrentValueCommitRef.current = null;
            if (committedValue) {
                onCurrentValueCommit?.(committedValue);
            }
        }
        onOpenChange?.(nextOpen);
    };
    const triggerContent = (_jsxs(_Fragment, { children: [_jsx(BrainIcon, { className: cn("pointer-events-none size-4 text-current") }), _jsx("span", { className: cn("relative w-1 self-stretch overflow-hidden rounded-full bg-current/10", composerCollapsePriority !== undefined
                    ? "hidden group-data-[composer-compact=true]/thought:inline-flex"
                    : "hidden @sm/composer:inline-flex @xl/composer:hidden"), "aria-hidden": "true", children: _jsx("span", { className: cn("absolute bottom-0 left-0 w-full rounded-full bg-success transition-[height] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]", progressPercent > 0 ? "min-h-1" : undefined), style: { height: `${progressPercent}%` } }) }), _jsx("span", { ref: labelRef, className: cn("min-w-0 whitespace-nowrap", labelVisibilityClassName, composerCollapsePriority !== undefined && "group-data-[composer-compact]/thought:hidden"), children: _jsx(RollingToolbarLabel, { label: currentLabel }) })] }));
    if (isFixedThoughtLevel) {
        return (_jsx(ControlHintTooltip, { title: effectiveTooltipTitle, triggerRef: triggerRef, children: _jsx("span", { className: cn("inline-flex h-7 items-center gap-1 rounded-lg px-1.5 py-1.5 text-ui-base text-foreground", composerTriggerClassName, triggerClassName), "aria-label": currentLabel, "data-thought-level-fixed": "true", "data-composer-thought-control": composerCollapsePriority !== undefined || undefined, "data-composer-collapse-priority": composerCollapsePriority, "data-testid": TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER, children: triggerContent }) }));
    }
    if (interactionMode === "select") {
        return (_jsxs(Select, { open: open, onOpenChange: handleSelectOpenChange, value: String(option.currentValue), onValueChange: (value) => {
                // Radix Select 在受控值与子项注册竞争时可能发出空值等未渲染值；
                // 直接上抛会被调用方误当成用户切换档位。只接受已渲染 entries 中的值。
                if (!entries.some((entry) => entry.value === value)) {
                    return;
                }
                onValueChange(value);
            }, disabled: disabled, children: [_jsx(ControlHintTooltip, { title: effectiveTooltipTitle, shortcut: shortcutLabel, triggerRef: triggerRef, children: _jsx(SelectTrigger, { variant: "ghost", size: "default", indicator: _jsx(ChevronDownIcon, { className: cn("pointer-events-none size-3.5 text-foreground-subtle", indicatorClassName, composerCollapsePriority !== undefined &&
                                "group-data-[composer-compact]/thought:hidden") }), className: cn("gap-1 rounded-lg px-1.5 py-1.5 text-ui-base", composerTriggerClassName, triggerClassName), "aria-label": currentLabel, "data-chat-toolbar-popover-trigger": "true", "data-composer-thought-control": composerCollapsePriority !== undefined || undefined, "data-composer-collapse-priority": composerCollapsePriority, "data-testid": TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER, children: triggerContent }) }), _jsx(SelectContent, { position: "popper", side: "top", align: "start", sideOffset: 4, collisionPadding: 8, onCloseAutoFocus: (event) => {
                        if (!restoreFocusSelector) {
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
                        const input = document.querySelector(restoreFocusSelector);
                        input?.focus();
                    }, children: entries.map((entry) => (_jsx(SelectItem, { value: entry.value, onClick: onCurrentValueCommit ? () => armCurrentValueCommit(entry.value) : undefined, onPointerUp: onCurrentValueCommit
                            ? (event) => {
                                if (event.button === 0 && event.pointerType === "mouse") {
                                    armCurrentValueCommit(entry.value);
                                }
                            }
                            : undefined, onKeyDown: onCurrentValueCommit
                            ? (event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    armCurrentValueCommit(entry.value);
                                }
                            }
                            : undefined, "data-testid": testId(TID_CHAT_THOUGHT_LEVEL_SELECT_ITEM, entry.value), children: _jsx("span", { className: "first-letter:uppercase", children: getThoughtLevelLabel(intl, provider, option, entry) }) }, entry.value))) })] }));
    }
    return (_jsx(ControlHintTooltip, { title: effectiveTooltipTitle, shortcut: shortcutLabel, triggerRef: triggerRef, children: _jsx(Button, { type: "button", variant: "ghost", size: "default", disabled: disabled, "data-chat-toolbar-popover-trigger": "true", "data-composer-thought-control": composerCollapsePriority !== undefined || undefined, "data-composer-collapse-priority": composerCollapsePriority, "data-testid": TID_CHAT_THOUGHT_LEVEL_SELECT_TRIGGER, className: cn("gap-1 rounded-lg px-1.5 py-1.5 text-ui-base", composerTriggerClassName, triggerClassName), "aria-label": currentLabel, onClick: handleClick, children: triggerContent }) }));
}
//# sourceMappingURL=ThoughtLevelCycleControl.js.map