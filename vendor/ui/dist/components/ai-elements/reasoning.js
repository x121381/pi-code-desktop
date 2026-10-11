/*
 * Derived from vercel/ai-elements (packages/elements/src/reasoning.tsx).
 * Copyright 2023 Vercel, Inc. Licensed under Apache-2.0.
 * Modified by ZCode: local integration, formatting and adaptations.
 * See THIRD-PARTY-NOTICES.md in the repository root for license and provenance.
 */
"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible.js";
import { cn } from "../lib/utils.js";
import { TID_CHAT_REASONING_CONTENT, TID_CHAT_REASONING_TRIGGER } from "@zcode/shared";
import { BrainIcon, ChevronRightIcon } from "lucide-react";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { QueuedSummaryContent } from "../../ToolCallBlocks/QueuedSummaryContent.js";
import { EMPTY_SCROLL_MASK_STATE, getVerticalScrollMaskStyle, resolveVerticalScrollMaskState, } from "../../mentions/components/scrollMask.js";
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, } from "react";
const ReasoningContext = createContext(null);
export const useReasoning = () => {
    const context = useContext(ReasoningContext);
    if (!context) {
        throw new Error("Reasoning components must be used within Reasoning");
    }
    return context;
};
const MS_IN_S = 1000;
const REASONING_CONTENT_COLLAPSE_UNMOUNT_DELAY_MS = 300;
const REASONING_BOTTOM_LOCK_DISTANCE_PX = 2;
export function shouldAutoCollapseReasoning({ autoCollapseKey, previousAutoCollapseKey, userInteracted, }) {
    return autoCollapseKey != null && autoCollapseKey !== previousAutoCollapseKey && !userInteracted;
}
export function getReasoningBottomDistance({ clientHeight, scrollHeight, scrollTop, }) {
    return Math.max(0, scrollHeight - clientHeight - scrollTop);
}
export function isReasoningScrollAtBottom(metrics) {
    return getReasoningBottomDistance(metrics) <= REASONING_BOTTOM_LOCK_DISTANCE_PX;
}
export const Reasoning = memo(({ className, isStreaming = false, autoCollapseKey = null, open, defaultOpen = false, onOpenChange, duration: durationProp, children, ...props }) => {
    const isOpenControlled = open !== undefined;
    const [isOpen, setIsOpen] = useControllableState({
        defaultProp: defaultOpen,
        onChange: onOpenChange,
        prop: open,
    });
    const [duration, setDuration] = useControllableState({
        defaultProp: undefined,
        prop: durationProp,
    });
    const startTimeRef = useRef(null);
    const contentUnmountDelayRef = useRef(null);
    const userInteractedRef = useRef(false);
    const previousAutoCollapseKeyRef = useRef(null);
    const [shouldRenderContent, setShouldRenderContent] = useState(() => isOpen);
    const handleOpenChange = useCallback((nextOpen) => {
        userInteractedRef.current = true;
        if (nextOpen) {
            setShouldRenderContent(true);
        }
        setIsOpen(nextOpen);
    }, [setIsOpen]);
    useEffect(() => {
        if (!isStreaming) {
            if (startTimeRef.current !== null) {
                setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
            }
            startTimeRef.current = null;
            return;
        }
        if (startTimeRef.current === null) {
            startTimeRef.current = Date.now();
        }
        // 收起态展示流式摘要，不需要为了隐藏的耗时每秒触发整块 reasoning 重渲染；
        // 展开时再按同一个开始时间补算并持续更新时间。
        if (!isOpen) {
            return;
        }
        const updateDuration = () => {
            if (startTimeRef.current === null) {
                return;
            }
            setDuration(Math.max(1, Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S)));
        };
        updateDuration();
        const durationTimer = window.setInterval(updateDuration, MS_IN_S);
        return () => window.clearInterval(durationTimer);
    }, [isOpen, isStreaming, setDuration]);
    useEffect(() => {
        const previousAutoCollapseKey = previousAutoCollapseKeyRef.current;
        previousAutoCollapseKeyRef.current = autoCollapseKey;
        if (isOpenControlled) {
            return;
        }
        // 输出边界是结束收起的补充信号；用户手动操作后，自动规则不能覆盖选择。
        if (shouldAutoCollapseReasoning({
            autoCollapseKey,
            previousAutoCollapseKey,
            userInteracted: userInteractedRef.current,
        })) {
            setIsOpen(false);
        }
    }, [autoCollapseKey, isOpenControlled, setIsOpen]);
    useEffect(() => {
        if (isOpen) {
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
                contentUnmountDelayRef.current = null;
            }
            setShouldRenderContent(true);
            return;
        }
        if (!shouldRenderContent) {
            return;
        }
        // 思考内容收起时不能立刻卸载 children。Radix 的高度动画需要
        // closed 阶段仍能读到真实内容高度；先让 300ms 收起动画跑完，再卸载重 DOM。
        contentUnmountDelayRef.current = window.setTimeout(() => {
            setShouldRenderContent(false);
            contentUnmountDelayRef.current = null;
        }, REASONING_CONTENT_COLLAPSE_UNMOUNT_DELAY_MS);
        return () => {
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
                contentUnmountDelayRef.current = null;
            }
        };
    }, [isOpen, shouldRenderContent]);
    useEffect(() => {
        return () => {
            if (contentUnmountDelayRef.current !== null) {
                window.clearTimeout(contentUnmountDelayRef.current);
            }
        };
    }, []);
    const contextValue = useMemo(() => ({ duration, isOpen, isStreaming, setIsOpen, shouldRenderContent }), [duration, isOpen, isStreaming, setIsOpen, shouldRenderContent]);
    return (_jsx(ReasoningContext.Provider, { value: contextValue, children: _jsx(Collapsible, { className: cn("not-prose flex flex-col", className), onOpenChange: handleOpenChange, open: isOpen, ...props, children: children }) }));
});
export function scrollReasoningSummaryToEnd(viewport) {
    viewport.scrollLeft = viewport.scrollWidth;
}
export function isReasoningSummaryOverflowing({ clientWidth, scrollWidth, }) {
    return scrollWidth > clientWidth + 1;
}
export function resolveReasoningStreamingSummary(streamingText) {
    const lines = streamingText.replace(/\r\n?/gu, "\n").split("\n");
    for (let index = lines.length - 1; index >= 0; index -= 1) {
        const text = lines[index]?.trim() ?? "";
        if (text.length > 0) {
            return { key: String(index), text };
        }
    }
    return null;
}
const REASONING_SUMMARY_MASK = "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)";
export function getReasoningSummaryMaskStyle(isOverflowing) {
    if (!isOverflowing) {
        return undefined;
    }
    return {
        WebkitMaskImage: REASONING_SUMMARY_MASK,
        maskImage: REASONING_SUMMARY_MASK,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
    };
}
export const ReasoningTrigger = memo(({ className, children, getThinkingMessage, streamingText = "", ...props }) => {
    const { isStreaming, isOpen, duration } = useReasoning();
    const { intl } = useZCodeIntl();
    const streamingSummary = isStreaming && !isOpen ? resolveReasoningStreamingSummary(streamingText) : null;
    const streamingSummaryRef = useRef(null);
    const streamingSummaryTextRef = useRef(null);
    const [isStreamingSummaryOverflowing, setIsStreamingSummaryOverflowing] = useState(false);
    useEffect(() => {
        const viewport = streamingSummaryRef.current;
        if (!viewport || !streamingSummary) {
            return;
        }
        const syncSummaryViewport = () => {
            setIsStreamingSummaryOverflowing((current) => {
                const next = isReasoningSummaryOverflowing(viewport);
                return current === next ? current : next;
            });
            // 流式摘要超过可用宽度后，普通 overflow-hidden 会固定显示旧前缀，
            // 最新 token 被裁在右侧。每次内容增长后把单行视口推到末尾，让旧内容向左移。
            scrollReasoningSummaryToEnd(viewport);
        };
        syncSummaryViewport();
        if (typeof ResizeObserver === "undefined") {
            return;
        }
        const resizeObserver = new ResizeObserver(syncSummaryViewport);
        resizeObserver.observe(viewport);
        if (streamingSummaryTextRef.current) {
            resizeObserver.observe(streamingSummaryTextRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [streamingSummary?.text]);
    const thinkingMessage = getThinkingMessage?.(isStreaming, duration) ??
        (isStreaming && !isOpen ? (_jsx("span", { className: "animated-gradient-text font-medium", children: intl.formatMessage({ id: "chat.reasoning.thinking" }) })) : duration === undefined ? (_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-foreground-subtlest", children: intl.formatMessage({ id: "chat.reasoning.thought" }) }), _jsx("span", { className: "font-normal text-foreground-subtlest", children: "\u00B7" }), _jsx("span", { className: "font-normal text-foreground-subtlest", children: intl.formatMessage({ id: "chat.reasoning.durationFewSeconds" }) })] })) : (_jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-foreground-subtlest", children: intl.formatMessage({ id: "chat.reasoning.thought" }) }), _jsx("span", { className: "font-normal text-foreground-subtlest", children: "\u00B7" }), _jsx("span", { className: "font-normal text-foreground-subtlest", children: intl.formatMessage({ id: "chat.reasoning.durationSeconds" }, { seconds: String(duration) }) })] })));
    return (_jsx(CollapsibleTrigger, { "data-testid": TID_CHAT_REASONING_TRIGGER, className: cn("group/reasoning inline-flex max-w-full min-w-0 items-center gap-2 self-start text-ui-base transition-colors", className), ...props, children: children ?? (_jsxs(_Fragment, { children: [_jsx(BrainIcon, { className: "size-4 shrink-0 text-foreground-subtlest" }), _jsx("span", { className: "shrink-0 whitespace-nowrap", "data-reasoning-label": "true", children: thinkingMessage }), streamingSummary ? _jsx("span", { className: "shrink-0 text-foreground-subtlest", children: "\u00B7" }) : null, streamingSummary ? (_jsx("span", { ref: streamingSummaryRef, className: "min-w-0 flex-1 overflow-hidden whitespace-nowrap text-foreground-subtle", "data-reasoning-streaming-mask": isStreamingSummaryOverflowing ? "both" : "none", "data-reasoning-streaming-line": "true", "data-reasoning-streaming-roll": "true", style: getReasoningSummaryMaskStyle(isStreamingSummaryOverflowing), children: _jsx(QueuedSummaryContent, { contentKey: `reasoning-line:${streamingSummary.key}`, contentRefreshVersion: streamingSummary.text, primaryText: _jsx("span", { ref: streamingSummaryTextRef, className: "inline-block min-w-max", "data-reasoning-streaming-text": "true", children: streamingSummary.text }), enabled: true }) })) : null, _jsx(ChevronRightIcon, { className: cn("size-4 shrink-0 text-foreground-subtlest transition-opacity transition-transform", isOpen
                        ? "rotate-90 opacity-100"
                        : "rotate-0 opacity-0 group-hover/reasoning:opacity-100") })] })) }));
});
export const ReasoningContent = memo(({ className, children, forceMount, variant = "default", ...props }) => {
    const { isOpen, shouldRenderContent } = useReasoning();
    const shouldRenderChildren = isOpen || shouldRenderContent || Boolean(forceMount);
    const scrollRef = useRef(null);
    const contentRef = useRef(null);
    const autoFollowBottomRef = useRef(true);
    const [scrollMaskState, setScrollMaskState] = useState(EMPTY_SCROLL_MASK_STATE);
    const updateScrollMaskState = useCallback(() => {
        const scrollNode = scrollRef.current;
        if (!scrollNode) {
            setScrollMaskState(EMPTY_SCROLL_MASK_STATE);
            return;
        }
        setScrollMaskState(resolveVerticalScrollMaskState({
            clientHeight: scrollNode.clientHeight,
            scrollHeight: scrollNode.scrollHeight,
            scrollTop: scrollNode.scrollTop,
        }));
    }, []);
    const scrollToReasoningBottom = useCallback(() => {
        const scrollNode = scrollRef.current;
        if (!scrollNode) {
            return;
        }
        scrollNode.scrollTop = scrollNode.scrollHeight;
        updateScrollMaskState();
    }, [updateScrollMaskState]);
    const handleScroll = useCallback(() => {
        const scrollNode = scrollRef.current;
        if (!scrollNode) {
            return;
        }
        autoFollowBottomRef.current = isReasoningScrollAtBottom({
            clientHeight: scrollNode.clientHeight,
            scrollHeight: scrollNode.scrollHeight,
            scrollTop: scrollNode.scrollTop,
        });
        updateScrollMaskState();
    }, [updateScrollMaskState]);
    useEffect(() => {
        if (!shouldRenderChildren) {
            autoFollowBottomRef.current = true;
            setScrollMaskState(EMPTY_SCROLL_MASK_STATE);
            return;
        }
        const scrollNode = scrollRef.current;
        if (!scrollNode || typeof ResizeObserver === "undefined") {
            if (autoFollowBottomRef.current) {
                scrollToReasoningBottom();
            }
            else {
                updateScrollMaskState();
            }
            return;
        }
        // thought 内容流式追加时 scrollHeight 会变化；同时监听容器和内容尺寸。
        // 默认吸底跟随最新思考；用户主动离底后暂停，直到用户自己滚回底部再恢复。
        const syncScrollPosition = () => {
            if (autoFollowBottomRef.current) {
                scrollToReasoningBottom();
                return;
            }
            updateScrollMaskState();
        };
        syncScrollPosition();
        const resizeObserver = new ResizeObserver(syncScrollPosition);
        resizeObserver.observe(scrollNode);
        if (contentRef.current) {
            resizeObserver.observe(contentRef.current);
        }
        return () => {
            resizeObserver.disconnect();
        };
    }, [scrollToReasoningBottom, shouldRenderChildren, updateScrollMaskState]);
    useEffect(() => {
        if (!shouldRenderChildren) {
            return;
        }
        if (autoFollowBottomRef.current) {
            scrollToReasoningBottom();
            return;
        }
        updateScrollMaskState();
    }, [children, scrollToReasoningBottom, shouldRenderChildren, updateScrollMaskState]);
    const scrollMaskStyle = getVerticalScrollMaskStyle(scrollMaskState);
    const scrollMaskData = scrollMaskState.showTop && scrollMaskState.showBottom
        ? "both"
        : scrollMaskState.showTop
            ? "top"
            : scrollMaskState.showBottom
                ? "bottom"
                : "none";
    return (_jsx(CollapsibleContent, { "data-reasoning-content": "true", "data-reasoning-content-variant": variant, "data-testid": TID_CHAT_REASONING_CONTENT, forceMount: forceMount, className: className, ...props, children: shouldRenderChildren ? (_jsx("div", { className: "pt-3", children: _jsx("div", { ref: scrollRef, className: cn("max-h-60 space-y-2 overflow-auto text-ui-base text-foreground-subtlest", 
                // CUA Group 已提供清晰的父级边界；子思考继续显示左导线与缩进会形成重复层级。
                variant === "default" && "ml-2 border-border border-l pl-3.5"), "data-reasoning-scroll-mask": scrollMaskData, onScroll: handleScroll, style: scrollMaskStyle, children: _jsx("div", { ref: contentRef, className: "min-w-0 whitespace-pre-wrap break-words text-foreground-subtlest", children: children }) }) })) : null }));
});
Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
//# sourceMappingURL=reasoning.js.map