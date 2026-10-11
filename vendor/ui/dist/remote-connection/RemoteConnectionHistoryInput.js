import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useRef, useState } from "react";
import { cn } from "../components/lib/utils.js";
import { Command, CommandEmpty, CommandItem, CommandList } from "../components/ui/command.js";
import { Input } from "../components/ui/input.js";
import { Popover, PopoverAnchor, PopoverContent } from "../components/ui/popover.js";
import { shouldIgnoreRemoteConnectionHistoryPopoverInteractOutside } from "../remote-connection/remoteConnectionHistoryPopover.js";
function matchesSuggestion(value, query) {
    const normalizedValue = value.trim().toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return true;
    }
    return normalizedValue.includes(normalizedQuery);
}
export function RemoteConnectionHistoryInput({ containerClassName, suggestionWidth, label, placeholder, value, suggestions, emptyText, onChange, ...inputProps }) {
    const [open, setOpen] = useState(false);
    const [filterWithCurrentValue, setFilterWithCurrentValue] = useState(false);
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const keepInputFocusOnOpenRef = useRef(false);
    const suppressOpenUntilRef = useRef(0);
    const skipNextBlurRef = useRef(false);
    const filteredSuggestions = useMemo(() => {
        if (!filterWithCurrentValue) {
            return suggestions;
        }
        return suggestions.filter((item) => matchesSuggestion(item, value));
    }, [filterWithCurrentValue, suggestions, value]);
    const requestOpenFromInput = useCallback((options) => {
        if (Date.now() < suppressOpenUntilRef.current || suggestions.length === 0) {
            return;
        }
        if (options?.resetFilter !== false) {
            setFilterWithCurrentValue(false);
        }
        keepInputFocusOnOpenRef.current = true;
        setOpen(true);
    }, [suggestions.length]);
    const handleOpenChange = useCallback((nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) {
            return;
        }
        keepInputFocusOnOpenRef.current = false;
        setFilterWithCurrentValue(false);
        if (skipNextBlurRef.current) {
            skipNextBlurRef.current = false;
        }
    }, []);
    return (_jsxs("div", { ref: containerRef, className: cn("w-full", containerClassName), children: [label ? (_jsx("label", { className: "mb-1 block text-ui-base text-foreground-subtle", children: label })) : null, _jsxs(Popover, { open: open && suggestions.length > 0, onOpenChange: handleOpenChange, children: [_jsx(PopoverAnchor, { asChild: true, children: _jsx(Input, { ref: inputRef, size: "lg", placeholder: placeholder, value: value, onFocus: () => requestOpenFromInput(), onClick: () => requestOpenFromInput(), onChange: (event) => {
                                onChange(event.target.value);
                                setFilterWithCurrentValue(true);
                                requestOpenFromInput({ resetFilter: false });
                            }, autoComplete: "off", ...inputProps }) }), _jsx(PopoverContent, { align: "start", className: "max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-menu p-1 shadow-lg", style: {
                            width: suggestionWidth ?? "var(--radix-popover-trigger-width)",
                        }, onInteractOutside: (event) => {
                            const targetNode = event.target;
                            if (shouldIgnoreRemoteConnectionHistoryPopoverInteractOutside({
                                isTargetInsideContainer: targetNode instanceof Node && containerRef.current?.contains(targetNode) === true,
                            })) {
                                // 首次鼠标点击输入框时会先触发 focus 打开建议列表，
                                // 随后的同一次 click 又会被 Popover 视为“内容外点击”而立刻关闭。
                                // 这里把来自当前输入框容器的交互排除掉，避免出现第一次 focus 连续闪两次。
                                event.preventDefault();
                            }
                        }, onOpenAutoFocus: (event) => {
                            // Popover 默认会把焦点抢到弹层内，输入框一旦失焦，用户就没法边看历史边继续输入过滤。
                            // 这里在“由输入框触发打开”时拦截自动聚焦，把焦点留在输入框里，保证 focus 展示和连续输入都成立。
                            if (!keepInputFocusOnOpenRef.current) {
                                return;
                            }
                            event.preventDefault();
                            inputRef.current?.focus();
                            keepInputFocusOnOpenRef.current = false;
                        }, children: _jsx(Command, { className: "rounded-lg bg-transparent p-0 text-foreground", children: _jsx(CommandList, { className: "max-h-56 scroll-py-1", children: filteredSuggestions.length === 0 ? (_jsx(CommandEmpty, { className: "px-3 py-5 text-ui-base text-foreground-subtle", children: emptyText })) : (filteredSuggestions.map((item) => (_jsx(CommandItem, { value: item, className: "min-h-8 rounded-lg px-3 py-1.5 text-ui-base text-foreground data-selected:bg-menu-hover data-selected:text-foreground", onPointerDown: () => {
                                        skipNextBlurRef.current = true;
                                    }, onSelect: (selected) => {
                                        onChange(selected);
                                        setFilterWithCurrentValue(false);
                                        // 选中历史项后，input 的 click/focus 会立刻重放，弹层会出现“刚关就重开”。
                                        // 这里用一个很短的抑制窗口屏蔽这次连带事件，避免交互抖动。
                                        suppressOpenUntilRef.current = Date.now() + 120;
                                        setOpen(false);
                                    }, children: _jsx("span", { className: "truncate", children: item }) }, item)))) }) }) })] })] }));
}
//# sourceMappingURL=RemoteConnectionHistoryInput.js.map