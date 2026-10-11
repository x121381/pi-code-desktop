import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect } from "react";
import {} from "./ModelTrajectorySearch.js";
import { applyTrajectorySearchHighlights, clearTrajectorySearchHighlights, isTrajectorySearchTargetMounted, scrollTrajectorySearchRangeIntoView, } from "./ModelTrajectorySearchHighlight.js";
import { CallCard } from "./ModelTrajectoryPaneParts.js";
export function ModelTrajectoryTimeline({ items, searchQuery, searchMatches, activeSearchMatch, intl, scrollContainerRef, }) {
    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollContainerRef.current,
        getItemKey: (index) => items[index]?.key ?? index,
        estimateSize: () => 240,
        overscan: 3,
    });
    // 搜索切换会同时收起旧命中并展开新命中；此时禁止 virtualizer 根据每次测高回调连续
    // 修正滚动锚点，由下方文本级定位在布局稳定后一次完成滚动。
    virtualizer.shouldAdjustScrollPositionOnItemSizeChange = () => !searchQuery;
    const roleWidthLabels = ["system", "user", "assistant", "tool"].map((role) => intl.formatMessage({ id: `modelTrajectory.role.${role}` }));
    const virtualItems = virtualizer.getVirtualItems();
    const firstVirtualItem = virtualItems[0];
    const lastVirtualItem = virtualItems.at(-1);
    const topSpacerHeight = firstVirtualItem?.start ?? 0;
    const bottomSpacerHeight = lastVirtualItem ? virtualizer.getTotalSize() - lastVirtualItem.end : 0;
    // 只跟踪挂载集合。把 start 放进依赖会让每次动态测高都重新安排一次精确滚动。
    const mountedRowsKey = virtualItems.map((item) => item.key).join("|");
    useEffect(() => () => clearTrajectorySearchHighlights(), []);
    useEffect(() => {
        const root = scrollContainerRef.current;
        if (!activeSearchMatch ||
            !root ||
            isTrajectorySearchTargetMounted(root, activeSearchMatch.expansionKey)) {
            return;
        }
        // 目标已经挂载时跳过 Call 级预滚动，否则随后文本级定位会造成连续两次跳动。
        virtualizer.scrollToIndex(activeSearchMatch.callIndex, { align: "center" });
    }, [activeSearchMatch, scrollContainerRef, virtualizer]);
    useEffect(() => {
        const root = scrollContainerRef.current;
        if (!root || !searchQuery) {
            clearTrajectorySearchHighlights();
            return;
        }
        let secondFrame = 0;
        const firstFrame = window.requestAnimationFrame(() => {
            virtualizer.measure();
            secondFrame = window.requestAnimationFrame(() => {
                const activeRange = applyTrajectorySearchHighlights({
                    root,
                    query: searchQuery,
                    matches: searchMatches,
                    activeMatch: activeSearchMatch,
                });
                if (activeRange)
                    scrollTrajectorySearchRangeIntoView(activeRange, root);
            });
        });
        return () => {
            window.cancelAnimationFrame(firstFrame);
            window.cancelAnimationFrame(secondFrame);
        };
    }, [
        activeSearchMatch,
        mountedRowsKey,
        scrollContainerRef,
        searchMatches,
        searchQuery,
        virtualizer,
    ]);
    return (_jsxs("ol", { "data-trajectory-timeline": "", className: "grid grid-cols-[max-content_minmax(0,1fr)_auto] gap-x-2", children: [roleWidthLabels.map((label) => (_jsx("li", { "aria-hidden": "true", className: "invisible col-start-1 row-start-1 h-0 overflow-hidden whitespace-nowrap font-mono text-ui-sm", children: label }, label))), topSpacerHeight > 0 ? (_jsx("li", { "aria-hidden": "true", className: "col-span-full", style: { height: topSpacerHeight } })) : null, virtualItems.map((virtualItem) => {
                const item = items[virtualItem.index];
                if (!item)
                    return null;
                return (_jsx("li", { ref: virtualizer.measureElement, "data-index": virtualItem.index, "data-trajectory-virtual-row": "", className: "col-span-full grid w-full grid-cols-subgrid", children: _jsx(CallCard, { record: item.record, index: virtualItem.index, inputMessages: item.inputMessages, expansionKeyPrefix: item.key, intl: intl }) }, item.key));
            }), bottomSpacerHeight > 0 ? (_jsx("li", { "aria-hidden": "true", className: "col-span-full", style: { height: bottomSpacerHeight } })) : null] }));
}
export function resolveTrajectoryTimelineItems(records) {
    let previousConversationMessageCount = 0;
    return records.map((record, index) => {
        const resolvedInput = resolveTrajectoryInputMessages({
            index,
            previousConversationMessageCount,
            record,
        });
        previousConversationMessageCount = resolvedInput.nextConversationMessageCount;
        return {
            key: `${record.requestId}:${index}`,
            record,
            inputMessages: resolvedInput.inputMessages,
        };
    });
}
export function resolveTrajectoryInputMessages({ record, index, previousConversationMessageCount, }) {
    const messages = record.request.messages;
    const usesConversationDelta = shouldUseConversationDelta(record);
    const deltaMessages = usesConversationDelta
        ? computeDeltaMessages(messages, previousConversationMessageCount, index)
        : messages;
    return {
        // 首条展示完整起始上下文；后续主会话只展示非 assistant 的新增（assistant 由上一条 Output 呈现）。
        // sidecar/compact 等辅助请求有独立 prompt，不能套用主会话的消息数 delta，否则会隐藏标题生成 prompt。
        inputMessages: usesConversationDelta
            ? index === 0
                ? deltaMessages
                : deltaMessages.filter((message) => message.role !== "assistant")
            : deltaMessages,
        nextConversationMessageCount: usesConversationDelta
            ? messages.length
            : previousConversationMessageCount,
    };
}
function shouldUseConversationDelta(record) {
    const kind = record.callSource?.kind;
    return kind === undefined || kind === "main" || kind === "subagent";
}
function computeDeltaMessages(messages, previousMessageCount, index) {
    if (index === 0)
        return messages;
    if (messages.length > previousMessageCount)
        return messages.slice(previousMessageCount);
    if (messages.length < previousMessageCount)
        return messages;
    return [];
}
//# sourceMappingURL=ModelTrajectoryTimeline.js.map