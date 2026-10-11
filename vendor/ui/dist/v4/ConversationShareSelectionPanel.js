import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo, useEffect, useLayoutEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../components/lib/utils.js";
import { Checkbox } from "../components/ui/checkbox.js";
import { ScrollArea } from "../components/ui/scroll-area.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { resolveConversationShareSelectionPanelMotion } from "../v4/conversationShareModeMotion.js";
import { CONVERSATION_SHARE_SELECTION_PANEL_CENTER_Y_PROPERTY, CONVERSATION_SHARE_SELECTION_PANEL_MAX_HEIGHT_PROPERTY, } from "../v4/conversationShareSelectionPanelLayout.js";
import { resolveConversationShareScrollbarIndicatorMetrics } from "../v4/conversationShareScrollbarMetrics.js";
const PANEL_LAYOUT_STYLE = {
    // 固定高度会让少量候选留下大块空白，并在底部 dock 增高时覆盖输入区。
    // 面板自身按内容自然撑开，max-height 与 top 由共享会话容器动态提供。
    height: "auto",
    maxHeight: `var(${CONVERSATION_SHARE_SELECTION_PANEL_MAX_HEIGHT_PROPERTY}, calc(100% - 3rem))`,
    top: `var(${CONVERSATION_SHARE_SELECTION_PANEL_CENTER_Y_PROPERTY}, 50%)`,
};
function ConversationShareSelectionPanelImpl({ visible, items, selectedRowIds, onToggle, onInspect, }) {
    const { intl } = useZCodeIntl();
    const prefersReducedMotion = useReducedMotion() === true;
    const motionConfig = resolveConversationShareSelectionPanelMotion(prefersReducedMotion);
    const panelRef = useRef(null);
    const scrollShellRef = useRef(null);
    const scrollContentRef = useRef(null);
    const visualThumbRef = useRef(null);
    useLayoutEffect(() => {
        if (!visible)
            return;
        const panel = panelRef.current;
        const content = scrollContentRef.current;
        if (!panel || !content)
            return;
        const syncNaturalHeight = () => {
            // 面板的上下 padding 各 8px；content 的 scrollHeight 始终代表完整候选列表，
            // 即使外层已经被 max-height 截断，也不会把可滚动内容误测成当前 viewport 高度。
            const naturalHeight = content.scrollHeight + 16;
            if (naturalHeight > 16)
                panel.style.height = `${naturalHeight}px`;
        };
        syncNaturalHeight();
        if (typeof ResizeObserver === "undefined")
            return;
        const resizeObserver = new ResizeObserver(syncNaturalHeight);
        resizeObserver.observe(content);
        return () => resizeObserver.disconnect();
    }, [items.length, visible]);
    useEffect(() => {
        if (!visible)
            return;
        const shell = scrollShellRef.current;
        const visualThumb = visualThumbRef.current;
        const viewport = shell?.querySelector('[data-slot="scroll-area-viewport"]');
        if (!shell || !visualThumb || !viewport)
            return;
        let animationFrame = 0;
        const updateVisualThumb = () => {
            animationFrame = 0;
            const metrics = resolveConversationShareScrollbarIndicatorMetrics({
                trackSize: shell.clientHeight,
                viewportSize: viewport.clientHeight,
                contentSize: viewport.scrollHeight,
                scrollOffset: viewport.scrollTop,
            });
            visualThumb.style.display = metrics.visible ? "block" : "none";
            visualThumb.style.height = `${metrics.size}px`;
            visualThumb.style.transform = `translateY(${metrics.offset}px)`;
        };
        const scheduleVisualThumbUpdate = () => {
            if (animationFrame !== 0)
                cancelAnimationFrame(animationFrame);
            animationFrame = requestAnimationFrame(updateVisualThumb);
        };
        viewport.addEventListener("scroll", scheduleVisualThumbUpdate, { passive: true });
        const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(scheduleVisualThumbUpdate);
        resizeObserver?.observe(shell);
        resizeObserver?.observe(viewport);
        if (viewport.firstElementChild instanceof HTMLElement) {
            resizeObserver?.observe(viewport.firstElementChild);
        }
        scheduleVisualThumbUpdate();
        return () => {
            viewport.removeEventListener("scroll", scheduleVisualThumbUpdate);
            resizeObserver?.disconnect();
            if (animationFrame !== 0)
                cancelAnimationFrame(animationFrame);
        };
    }, [items.length, visible]);
    return (_jsx(AnimatePresence, { initial: false, children: visible ? (_jsx(motion.aside, { ref: panelRef, "aria-label": intl.formatMessage({ id: "conversationShare.partial.panelLabel" }), "data-testid": "conversation-share-selection-panel", "data-conversation-share-left-navigation": "true", "data-conversation-share-mode-motion": "selection-panel", className: "group/share-selection-panel absolute left-4 z-30 flex h-auto w-[14.375rem] flex-col overflow-hidden rounded-xl bg-popover py-2 text-popover-foreground shadow-md ring-1 ring-inset ring-popover-border max-md:left-2 max-md:w-[min(14.375rem,calc(100vw-1rem))]", style: PANEL_LAYOUT_STYLE, initial: motionConfig.initial, animate: motionConfig.animate, exit: motionConfig.exit, transition: motionConfig.transition, children: _jsxs("div", { ref: scrollShellRef, className: "relative min-h-0 flex-1", children: [_jsx(ScrollArea, { type: "always", "data-testid": "conversation-share-selection-scroll-area", className: "size-full min-h-0 flex-1 [&_[data-radix-scroll-area-viewport]>div]:!block [&_[data-radix-scroll-area-viewport]>div]:!w-full", 
                        // scale-y-50 只缩短 Radix thumb 的绘制结果，位移仍按原长度计算，
                        // 因而滚动到底后可见 thumb 仍停在轨道中段。原始 thumb 仅保留拖动命中，
                        // 视觉 thumb 由完整 scroll progress 独立映射到整条轨道。
                        scrollbarClassName: "opacity-0 transition-opacity group-hover/share-selection-panel:opacity-100 group-focus-within/share-selection-panel:opacity-100 data-vertical:!w-2.5 data-vertical:!pr-1 data-vertical:!pl-0 [&_[data-slot=scroll-area-thumb]]:!min-w-1.5 [&_[data-slot=scroll-area-thumb]]:!bg-transparent [@media(hover:none)]:opacity-100", children: _jsx("div", { ref: scrollContentRef, className: "flex min-w-0 flex-col gap-2 px-2", children: items.length > 0 ? (items.map((item, index) => {
                                const selected = selectedRowIds.has(item.rowId);
                                return (_jsxs("div", { "data-conversation-share-selection-item": "true", "data-conversation-share-selection-state": selected ? "selected" : "unselected", className: cn("group flex items-center rounded-lg p-1 transition-colors hover:bg-menu-hover", 
                                    // 设计稿首项采用 12/4px 间距，其余项采用 8/6px，保留该光学差异。
                                    index === 0 ? "gap-3" : "gap-2"), children: [_jsx("div", { className: "relative flex size-6 shrink-0 items-center justify-center", children: _jsx("label", { "data-conversation-share-checkbox-hit-area": "true", className: "absolute flex size-8 cursor-pointer items-center justify-center", children: _jsx(Checkbox, { checked: selected, disabled: item.isRunning, "aria-label": item.userPreview, onCheckedChange: () => {
                                                        if (!item.isRunning)
                                                            onToggle(item.rowId);
                                                    }, 
                                                    // 共享 Checkbox 会继承全局图标线宽，局部分享设计稿的勾选路径明确要求 1.33。
                                                    checkIconStrokeWidth: 1.33, className: "size-3.5 border-foreground bg-transparent data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background" }) }) }), _jsxs("button", { type: "button", disabled: item.isRunning, "aria-label": item.userPreview, onClick: () => onInspect({ unitIndex: item.unitIndex, rowId: item.rowId }), className: cn("flex min-w-0 flex-1 flex-col rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", index === 0 ? "gap-1" : "gap-1.5"), children: [_jsx("span", { className: cn("block truncate text-ui-base font-medium leading-5 transition-colors", selected ? "text-foreground" : "text-foreground-subtlest"), children: item.userPreview }), _jsx("span", { className: cn("block truncate text-ui-sm leading-4 transition-colors", selected ? "text-foreground-subtle" : "text-foreground-subtlest"), children: item.assistantPreview })] })] }, item.key));
                            })) : (_jsx("p", { className: "px-2 py-4 text-ui-sm text-foreground-subtle", children: intl.formatMessage({ id: "conversationShare.partial.empty" }) })) }) }), _jsx("div", { ref: visualThumbRef, "aria-hidden": "true", "data-testid": "conversation-share-selection-scroll-thumb", className: "pointer-events-none absolute right-1 top-0 z-10 hidden w-1.5 rounded-full bg-border opacity-0 transition-opacity group-hover/share-selection-panel:opacity-100 group-focus-within/share-selection-panel:opacity-100 [@media(hover:none)]:opacity-100" })] }) }, "conversation-share-selection-panel")) : null }));
}
export const ConversationShareSelectionPanel = memo(ConversationShareSelectionPanelImpl);
//# sourceMappingURL=ConversationShareSelectionPanel.js.map