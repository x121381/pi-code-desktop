import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cloneElement, isValidElement, useCallback, } from "react";
import { cn } from "@/components/lib/utils.js";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip.js";
import { isAppleKeyboardPlatform } from "@/lib/keyboardShortcuts.js";
const shortcutKbdBaseClassName = "rounded-md h-4 inline-flex items-center bg-tooltip-tag px-1.5 text-ui-xs font-medium text-tooltip-tag-foreground";
function setRef(ref, value) {
    if (!ref) {
        return;
    }
    if (typeof ref === "function") {
        ref(value);
        return;
    }
    ref.current = value;
}
export function ControlHintTooltip({ children, title, description, shortcut, standalone = false, open, onOpenChange, side = "top", align = "center", sideOffset = 2, className, triggerClassName, triggerRef, }) {
    const useAppleShortcutFont = isAppleKeyboardPlatform();
    const shortcutFontClassName = useAppleShortcutFont ? "tracking-normal" : "font-mono";
    const shortcutFontStyle = useAppleShortcutFont
        ? {
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", sans-serif',
        }
        : undefined;
    const isTriggerElement = isValidElement(children);
    const childRef = isTriggerElement ? children.props.ref : undefined;
    // Radix Tooltip/Dropdown/Popper 的 asChild trigger 会在 ref 变化时同步 setState。
    // 这里必须稳定 callback ref 身份，否则每次 render 都会触发 ref detach/attach 并形成更新循环。
    const composedTriggerRef = useCallback((value) => {
        setRef(childRef, value);
        setRef(triggerRef, value);
    }, [childRef, triggerRef]);
    const trigger = isTriggerElement ? (cloneElement(children, {
        // 以前额外包一层 span，Radix Tooltip/Select/Popover 多层 asChild 组合时，
        // 事件和 ref 会落到不同 DOM 上，触发 SlotClone 渲染栈错误。这里直接合到真实触发器。
        className: cn("shrink-0", children.props.className, triggerClassName),
        ref: composedTriggerRef,
    })) : (_jsx("span", { ref: triggerRef, className: cn("inline-flex shrink-0", triggerClassName), children: children }));
    // 大会话会为每条消息动作渲染大量 ControlHintTooltip，逐个创建 Provider
    // 会把 Radix 上下文树放大到消息数量级；共享 Provider 统一放在 Root。
    const tooltip = (_jsxs(Tooltip, { open: open, onOpenChange: onOpenChange, children: [_jsx(TooltipTrigger, { asChild: true, children: trigger }), _jsxs(TooltipContent, { align: align, side: side, sideOffset: sideOffset, className: cn(description
                    ? "max-w-72 flex-col items-start gap-1.5 px-3 py-2 text-left"
                    : "max-w-[min(28rem,calc(100vw-1rem))] items-center gap-2 px-2.5 py-1 text-left has-data-[slot=kbd]:pr-1", className), children: [description ? (_jsxs("div", { className: "flex w-full items-start justify-between gap-3", children: [_jsx("span", { className: "text-ui-sm font-medium leading-4 text-tooltip-foreground", children: title }), shortcut ? (_jsx("kbd", { "data-slot": "kbd", className: cn(shortcutKbdBaseClassName, shortcutFontClassName, "shrink-0"), style: shortcutFontStyle, children: shortcut })) : null] })) : (_jsx("span", { className: "text-ui-sm font-medium whitespace-pre-line break-words text-tooltip-foreground", children: title })), description ? (_jsx("span", { className: "max-w-64 text-ui-sm/relaxed text-tooltip-foreground/80", children: description })) : null, !description && shortcut ? (_jsx("kbd", { "data-slot": "kbd", className: cn(shortcutKbdBaseClassName, shortcutFontClassName, "shrink-0"), style: shortcutFontStyle, children: shortcut })) : null] })] }));
    // 少数组件需要支持脱离 Root 的 SSR/单测渲染；由封装按需补 Provider，
    // 避免业务层重新组合 Tooltip primitives，同时不让列表中的常规提示重复创建上下文。
    return standalone ? _jsx(TooltipProvider, { children: tooltip }) : tooltip;
}
//# sourceMappingURL=ControlHintTooltip.js.map