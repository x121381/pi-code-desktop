import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- 提示面板集中承载虚拟列表和 E2E 定位属性，暂不为少量测试属性拆组件。 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TID_PROMPT_SUGGESTION_OPTION, TID_PROMPT_SUGGESTION_PANEL, TID_PROMPT_SUGGESTION_SECTION, TID_PROMPT_SUGGESTION_STATUS, testId, } from "@zcode/shared";
import { cn } from "../../components/lib/utils.js";
import { Info, LoaderIcon } from "lucide-react";
import { EMPTY_SCROLL_MASK_STATE, getVerticalScrollMaskStyle, resolveVerticalScrollMaskState, } from "../../mentions/components/scrollMask.js";
const OPTION_ROW_HEIGHT = 34;
const STATUS_ROW_HEIGHT = 40;
export const SECTION_HEADER_ROW_HEIGHT = 34;
// 分组标题改用 base 字号后，旧的 28px 虚拟行装不下默认行高与 12px 上下 padding。
// 使用与命令项一致的 32px 可见高度和 34px 虚拟行高度，避免裁切或覆盖下一行。
export const SECTION_HEADER_CLASS_NAME = "flex h-8 items-center px-3 text-ui-base font-semibold uppercase tracking-wide text-foreground-subtle";
export function buildVirtualRows(sections) {
    const rows = [];
    let flatOptionIndex = 0;
    const shouldRenderSectionHeader = sections.length > 1;
    for (const section of sections) {
        if (shouldRenderSectionHeader && section.title.trim().length > 0) {
            rows.push({
                kind: "section_header",
                sectionId: section.id,
                title: section.title,
            });
        }
        if (section.errorText) {
            rows.push({
                kind: "status",
                sectionId: section.id,
                content: "error",
                text: section.errorText,
            });
        }
        else if (section.loading) {
            rows.push({
                kind: "status",
                sectionId: section.id,
                content: "loading",
                text: section.loadingText ?? section.emptyText,
            });
        }
        else if (section.options.length === 0) {
            rows.push({
                kind: "status",
                sectionId: section.id,
                content: "empty",
                text: section.emptyText,
            });
        }
        else {
            for (const option of section.options) {
                rows.push({
                    kind: "option",
                    sectionId: section.id,
                    option,
                    flatOptionIndex,
                });
                flatOptionIndex += 1;
            }
        }
    }
    return rows;
}
export function MentionPanel({ title, description, footer, listMaxHeight, sections, emptyText, selectedIndex, hasActiveQuery, onSelect, trigger, }) {
    const scrollContainerRef = useRef(null);
    const [hoveredOptionIndex, setHoveredOptionIndex] = useState(null);
    const [scrollMaskState, setScrollMaskState] = useState(EMPTY_SCROLL_MASK_STATE);
    const virtualRows = useMemo(() => buildVirtualRows(sections), [sections]);
    const virtualizer = useVirtualizer({
        count: virtualRows.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: (index) => virtualRows[index]?.kind === "option"
            ? OPTION_ROW_HEIGHT
            : virtualRows[index]?.kind === "section_header"
                ? SECTION_HEADER_ROW_HEIGHT
                : STATUS_ROW_HEIGHT,
        overscan: 8,
    });
    const totalVirtualSize = virtualizer.getTotalSize();
    const updateScrollMaskState = useCallback(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) {
            setScrollMaskState(EMPTY_SCROLL_MASK_STATE);
            return;
        }
        const nextState = resolveVerticalScrollMaskState({
            clientHeight: scrollContainer.clientHeight,
            scrollHeight: scrollContainer.scrollHeight,
            scrollTop: scrollContainer.scrollTop,
        });
        setScrollMaskState((current) => current.showTop === nextState.showTop && current.showBottom === nextState.showBottom
            ? current
            : nextState);
    }, []);
    const scrollMaskStyle = useMemo(() => getVerticalScrollMaskStyle(scrollMaskState), [scrollMaskState]);
    // Scroll selected option into view
    const selectedVirtualIndex = useMemo(() => virtualRows.findIndex((row) => row.kind === "option" && row.flatOptionIndex === selectedIndex), [virtualRows, selectedIndex]);
    useEffect(() => {
        if (selectedVirtualIndex >= 0) {
            virtualizer.scrollToIndex(selectedVirtualIndex, { align: "auto" });
        }
    }, [selectedVirtualIndex, virtualizer]);
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) {
            setScrollMaskState(EMPTY_SCROLL_MASK_STATE);
            return;
        }
        let frameId = null;
        const scheduleUpdate = () => {
            if (frameId !== null) {
                return;
            }
            frameId = requestAnimationFrame(() => {
                frameId = null;
                updateScrollMaskState();
            });
        };
        updateScrollMaskState();
        scrollContainer.addEventListener("scroll", scheduleUpdate, {
            passive: true,
        });
        let resizeObserver = null;
        if (typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(scheduleUpdate);
            resizeObserver.observe(scrollContainer);
            const contentElement = scrollContainer.firstElementChild;
            if (contentElement) {
                resizeObserver.observe(contentElement);
            }
        }
        else {
            window.addEventListener("resize", scheduleUpdate);
        }
        return () => {
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
            scrollContainer.removeEventListener("scroll", scheduleUpdate);
            resizeObserver?.disconnect();
            if (typeof ResizeObserver === "undefined") {
                window.removeEventListener("resize", scheduleUpdate);
            }
        };
    }, [totalVirtualSize, updateScrollMaskState, virtualRows.length]);
    return (_jsxs("div", { className: "mb-1 overflow-hidden rounded-2xl border border-border bg-menu shadow-xs", "data-testid": TID_PROMPT_SUGGESTION_PANEL, "data-trigger": trigger, children: [virtualRows.length > 0 ? (_jsx("div", { ref: scrollContainerRef, className: "max-h-56 overflow-y-auto px-1 py-0.75", role: "listbox", "aria-label": title, onMouseLeave: () => setHoveredOptionIndex(null), style: { ...scrollMaskStyle, ...(listMaxHeight ? { maxHeight: listMaxHeight } : {}) }, children: _jsx("div", { style: {
                        height: `${totalVirtualSize}px`,
                        width: "100%",
                        position: "relative",
                    }, children: virtualizer.getVirtualItems().map((virtualItem) => {
                        const row = virtualRows[virtualItem.index];
                        if (!row)
                            return null;
                        return (_jsx("div", { style: {
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${virtualItem.size}px`,
                                transform: `translateY(${virtualItem.start}px)`,
                            }, children: row.kind === "status" ? (_jsx(StatusRow, { row: row })) : row.kind === "section_header" ? (_jsx(SectionHeaderRow, { row: row })) : (_jsx(OptionRow, { row: row, isSelected: row.flatOptionIndex === selectedIndex, isHovered: row.flatOptionIndex === hoveredOptionIndex, onSelect: onSelect, onHover: setHoveredOptionIndex })) }, virtualItem.key));
                    }) }) })) : hasActiveQuery && emptyText ? (_jsx("div", { className: "flex items-center justify-between px-4 py-3 text-ui-base text-foreground-subtlest", children: emptyText })) : null, !hasActiveQuery && footer ? footer : null, !hasActiveQuery && description ? (_jsxs("div", { className: "flex items-center gap-2 px-4 py-3 text-ui-base text-foreground-subtle", children: [_jsx(Info, { className: "size-4 shrink-0 text-foreground" }), _jsx("span", { children: description })] })) : null] }));
}
function SectionHeaderRow({ row }) {
    return (_jsx("div", { className: SECTION_HEADER_CLASS_NAME, "data-testid": testId(TID_PROMPT_SUGGESTION_SECTION, row.sectionId), "data-section-id": row.sectionId, children: row.title }));
}
function StatusRow({ row }) {
    if (row.content === "loading") {
        return (_jsxs("div", { className: "flex items-center gap-2 rounded-xl px-5 py-2 text-ui-base text-foreground-subtle", "data-testid": testId(TID_PROMPT_SUGGESTION_STATUS, row.sectionId), "data-section-id": row.sectionId, "data-status": "loading", children: [_jsx(LoaderIcon, { className: "size-3.5 shrink-0 animate-spin" }), _jsx("span", { children: row.text })] }));
    }
    if (row.content === "error") {
        return (_jsx("div", { className: "rounded-xl bg-destructive px-5 py-2 text-ui-base text-destructive-foreground", "data-testid": testId(TID_PROMPT_SUGGESTION_STATUS, row.sectionId), "data-section-id": row.sectionId, "data-status": "error", children: row.text }));
    }
    return (_jsx("div", { className: "rounded-xl px-5 py-2 text-ui-base text-foreground-subtlest", "data-testid": testId(TID_PROMPT_SUGGESTION_STATUS, row.sectionId), "data-section-id": row.sectionId, "data-status": "empty", children: row.text }));
}
function OptionRow({ row, isSelected, isHovered, onSelect, onHover, }) {
    const { option, flatOptionIndex } = row;
    const isDisabled = option.disabled === true;
    return (_jsx("div", { className: "py-px w-full", children: _jsx("button", { type: "button", role: "option", "aria-selected": isSelected, "aria-disabled": isDisabled, disabled: isDisabled, "data-testid": testId(TID_PROMPT_SUGGESTION_OPTION, option.id), "data-section-id": row.sectionId, "data-option-id": option.id, "data-option-index": flatOptionIndex, "data-selected": isSelected ? "true" : "false", "data-disabled": isDisabled ? "true" : "false", className: cn("flex h-8 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors", isDisabled
                ? "cursor-not-allowed opacity-50"
                : isSelected
                    ? "bg-selected"
                    : isHovered
                        ? "bg-hover"
                        : "hover:bg-hover"), onMouseDown: (event) => {
                event.preventDefault();
                // 禁选项不触发选择：fail closed，冲突 Plugin 不能被插入。
                if (isDisabled) {
                    return;
                }
                onSelect(flatOptionIndex);
            }, onMouseEnter: () => onHover(isDisabled ? null : flatOptionIndex), children: option.content ? (_jsx(_Fragment, { children: option.content })) : (_jsxs("span", { className: "min-w-0 flex-1 flex", children: [_jsxs("span", { className: "flex items-center gap-2 flex-auto", children: [_jsx("span", { className: "truncate text-ui-base font-medium text-foreground", children: option.label }), option.meta ? (_jsx("span", { className: "shrink-0 text-ui-xs text-foreground-subtlest", children: option.meta })) : null] }), _jsx("span", { className: "mt-1 block truncate text-ui-xs text-foreground-subtlest", children: isDisabled && option.disabledReason ? option.disabledReason : option.description })] })) }) }));
}
//# sourceMappingURL=MentionPanel.js.map