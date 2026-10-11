import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { EMPTY_SCROLL_MASK_STATE, getVerticalScrollMaskStyle, resolveVerticalScrollMaskState, } from "@/mentions/components/scrollMask.js";
import { ToolCallBlock } from "@/ToolCallBlocks.js";
import { ToolLayout } from "@/ToolCallBlocks/ToolLayout.js";
import { buildCuaSummaryPresentation } from "@/ToolCallBlocks/renderers/cua.js";
import { CUA_TOOL_ICON } from "@/ToolCallBlocks/renderers/cuaIcon.js";
const TERMINAL_CUA_STATUSES = new Set(["completed", "failed", "stopped"]);
const STICK_TO_BOTTOM_THRESHOLD_PX = 8;
export function scrollCuaGroupToBottom(viewport) {
    viewport.scrollTop = viewport.scrollHeight;
}
export function isCuaGroupViewportAtBottom(viewport) {
    return (viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop <=
        STICK_TO_BOTTOM_THRESHOLD_PX);
}
function CuaGroupChildren({ events, context, renderAssistantMessage, renderReasoning, }) {
    const viewportRef = useRef(null);
    const contentRef = useRef(null);
    const shouldStickToBottomRef = useRef(true);
    const [scrollMaskState, setScrollMaskState] = useState(EMPTY_SCROLL_MASK_STATE);
    const updateScrollState = useCallback(() => {
        const viewport = viewportRef.current;
        if (!viewport) {
            setScrollMaskState(EMPTY_SCROLL_MASK_STATE);
            return;
        }
        shouldStickToBottomRef.current = isCuaGroupViewportAtBottom(viewport);
        setScrollMaskState(resolveVerticalScrollMaskState({
            clientHeight: viewport.clientHeight,
            scrollHeight: viewport.scrollHeight,
            scrollTop: viewport.scrollTop,
        }));
    }, []);
    const scrollToBottom = useCallback(() => {
        if (!viewportRef.current)
            return;
        scrollCuaGroupToBottom(viewportRef.current);
        updateScrollState();
    }, [updateScrollState]);
    useLayoutEffect(() => {
        if (shouldStickToBottomRef.current)
            scrollToBottom();
    }, [events.length, scrollToBottom]);
    useEffect(() => {
        const viewport = viewportRef.current;
        const content = contentRef.current;
        if (!viewport || !content || typeof ResizeObserver === "undefined")
            return;
        // 每次尺寸变化都强制吸底会让用户向上查看历史时被截图加载或流式
        // message 拉回底部。只有用户原本位于底部时才跟随新内容。
        const observer = new ResizeObserver(() => {
            if (shouldStickToBottomRef.current)
                scrollToBottom();
            else
                updateScrollState();
        });
        observer.observe(viewport);
        observer.observe(content);
        return () => observer.disconnect();
    }, [scrollToBottom, updateScrollState]);
    const scrollMaskData = scrollMaskState.showTop && scrollMaskState.showBottom
        ? "both"
        : scrollMaskState.showTop
            ? "top"
            : scrollMaskState.showBottom
                ? "bottom"
                : "none";
    return (_jsx("div", { ref: viewportRef, className: "max-h-72 overflow-y-auto overscroll-contain", "data-cua-group-scroll-mask": scrollMaskData, onScroll: updateScrollState, style: getVerticalScrollMaskStyle(scrollMaskState), children: _jsx("div", { ref: contentRef, className: "ml-2 space-y-2 border-border border-l pl-3.5", children: events.map((event) => event.kind === "tool" ? (_jsx(ToolCallBlock, { toolCallNode: event.node, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showIcon: true, cuaAppIconClassName: "size-5", onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain, onLoadFullToolCallFields: context.onLoadFullToolCallFields }, `tool:${event.row.toolCallId}`)) : event.kind === "assistantMessage" ? (_jsx("div", { className: "min-w-0 py-1 text-ui-base text-foreground-subtle", children: _jsx("div", { className: "min-w-0", children: renderAssistantMessage?.(event) ?? (_jsx("span", { className: "whitespace-pre-wrap break-words", children: event.row.text })) }) }, `message:${event.row.rowId}`)) : (_jsx("div", { className: "min-w-0 py-1", children: renderReasoning?.(event) ?? (_jsx("span", { className: "whitespace-pre-wrap break-words", children: event.row.text })) }, `reasoning:${event.row.rowId}`))) }) }));
}
export function CuaGroupToolCallBlock(context) {
    const { intl } = useZCodeIntl();
    const { toolCall, childToolCalls } = context.toolCallNode;
    const events = context.events ??
        childToolCalls.map((node) => ({
            kind: "tool",
            row: {
                rowId: 0,
                turnId: "",
                createdAt: 0,
                createdAtSeq: 0,
                kind: "toolCall",
                toolCallId: node.toolCall.toolId,
                toolName: node.toolCall.toolName ?? node.toolCall.kind ?? "Computer Use",
                status: "success",
                input: node.toolCall.input,
                inputText: "",
            },
            node,
        }));
    const latestSummaryEvent = events.findLast((event) => event.kind === "tool" && TERMINAL_CUA_STATUSES.has(event.node.toolCall.status));
    const latestToolSummary = latestSummaryEvent !== undefined
        ? buildCuaSummaryPresentation(latestSummaryEvent.node.toolCall, intl, {
            appIconClassName: "size-5",
        })
        : null;
    const isRunning = context.isRunning || toolCall.status === "in_progress";
    const eventCount = events.length;
    const messageCount = events.filter((event) => event.kind === "assistantMessage").length;
    const eventCountText = intl.formatMessage({
        id: eventCount === 1
            ? "chat.toolCall.cua.group.event.one"
            : "chat.toolCall.cua.group.event.other",
    }, { count: eventCount });
    const messageCountText = messageCount > 0 || !isRunning
        ? intl.formatMessage({
            id: messageCount === 1
                ? "chat.toolCall.cua.group.message.one"
                : "chat.toolCall.cua.group.message.other",
        }, { count: messageCount })
        : null;
    const animatedTextClass = isRunning
        ? "cua-group-gradient-text min-w-0 truncate"
        : "min-w-0 truncate text-foreground-subtlest";
    const primaryText = latestSummaryEvent ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-2", children: [_jsx("span", { className: "shrink-0 size-4 flex items-center justify-center [&_svg]:size-4", children: latestToolSummary?.icon ?? CUA_TOOL_ICON }), _jsx("span", { className: animatedTextClass, children: latestToolSummary ? (_jsxs("span", { className: "inline-flex min-w-0 items-center gap-1.5", children: [_jsx("span", { className: "shrink-0 font-medium", children: latestToolSummary.appName }), _jsx("span", { className: "min-w-0 truncate", children: latestToolSummary.primaryText })] })) : null }), latestToolSummary?.isFailed ? (_jsx("span", { className: "shrink-0 text-foreground-subtlest", children: intl.formatMessage({ id: "chat.toolCall.status.failed" }) })) : null] })) : null;
    const diffCount = (_jsxs("span", { className: "inline-flex shrink-0 items-center gap-2 whitespace-nowrap", children: [latestSummaryEvent || !isRunning ? _jsx("span", { children: "\u00B7" }) : null, _jsxs("span", { children: [eventCountText, messageCountText ? `, ${messageCountText}` : null] })] }));
    const renderContent = useCallback(() => (_jsx(CuaGroupChildren, { events: events, context: context, renderAssistantMessage: context.renderAssistantMessage, renderReasoning: context.renderReasoning })), [context, events]);
    return (_jsx(ToolLayout, { toolId: toolCall.toolId, icon: isRunning ? null : CUA_TOOL_ICON, showIcon: !isRunning, canToggle: context.canToggle ?? true, forceOpen: !isRunning && (context.forceOpen ?? false), kindLabel: isRunning ? null : intl.formatMessage({ id: "chat.toolCall.cua.group.completedLabel" }), primaryText: isRunning ? primaryText : null, prioritizePrimaryText: true, diffCount: diffCount, animateSummaryContent: isRunning, disableSummaryContentAnimation: context.disableSummaryContentAnimation, summaryContentKey: latestSummaryEvent
            ? `cua:${toolCall.toolId}:tool:${latestSummaryEvent.row.toolCallId}:${latestSummaryEvent.node.toolCall.status}`
            : `cua:${toolCall.toolId}:empty`, isRunning: isRunning, title: isRunning
            ? (latestToolSummary?.title ?? toolCall.title)
            : intl.formatMessage({ id: "chat.toolCall.cua.group.completedLabel" }), renderContent: renderContent }));
}
//# sourceMappingURL=cua-group.js.map