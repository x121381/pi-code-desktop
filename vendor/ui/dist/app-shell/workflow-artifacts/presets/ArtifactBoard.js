import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * `board` 预置渲染器：按 `status` 分列的卡片墙，卡片按 `key` upsert。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的**各列计数**（一眼看出「12 个里 3 个还没过」）；
 * - 全尺寸：`workflow-artifact` tab 里的列 + 卡片。
 *
 * **无拖拽**：这是 journal 的只读投影，卡片的位置由脚本 `report` 出来的 status 决定；
 * 让用户拖动会凭空造出一个「谁是权威」的问题（v1 明确不做交互式筛选 / 排序）。
 */
import { memo, useMemo } from "react";
import { applyArtifactItems, } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { PresetEmpty, PresetHeading, REVEAL_ANIMATION_CLASS, } from "@/app-shell/workflow-artifacts/presets/parts.js";
import { cn } from "@/components/lib/utils.js";
function columnLabel(column, labels) {
    return column.other ? labels.otherColumn : column.id;
}
function BoardCard({ card }) {
    return (_jsxs("div", { className: cn("rounded-lg border border-card-border bg-card px-2 py-1.5", REVEAL_ANIMATION_CLASS), "data-card-id": card.id, "data-testid": "artifact-board-card", children: [_jsx("div", { className: "truncate text-ui-sm font-medium text-foreground", title: card.title, children: card.title }), card.details.length > 0 ? (_jsx("dl", { className: "mt-1 space-y-0.5", children: card.details.map((detail) => (_jsxs("div", { className: "flex min-w-0 items-baseline gap-1.5", children: [_jsx("dt", { className: "shrink-0 text-ui-xs text-foreground-subtlest", children: detail.label }), _jsx("dd", { className: "min-w-0 flex-1 truncate text-right font-mono text-ui-xs text-foreground-subtle", title: detail.value, children: detail.value })] }, detail.label))) })) : null] }));
}
export const ArtifactBoard = memo(function ArtifactBoard({ spec, items, compact = false, labels, className, }) {
    const model = useMemo(() => applyArtifactItems("board", spec, items), [spec, items]);
    if (model.cardCount === 0) {
        return (_jsxs("div", { className: className, children: [compact ? null : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title })), _jsx(PresetEmpty, { compact: compact, label: labels.empty })] }));
    }
    if (compact) {
        return (_jsx("div", { className: cn("flex flex-wrap gap-1.5", className), "data-testid": "artifact-board-compact", children: model.columns.map((column) => (_jsxs("span", { className: "flex min-w-0 items-baseline gap-1 rounded-md bg-surface px-1.5 py-0.5", "data-column-id": column.id, "data-testid": "artifact-board-column-count", children: [_jsx("span", { className: "truncate text-ui-xs text-foreground-subtle", children: columnLabel(column, labels) }), _jsx("span", { className: "shrink-0 font-mono text-ui-xs text-foreground tabular-nums", children: column.cards.length })] }, column.id))) }));
    }
    return (_jsxs("div", { className: cn("min-w-0", className), "data-testid": "artifact-board", children: [_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title, trailing: _jsx("span", { className: "font-mono text-ui-xs text-foreground-subtlest tabular-nums", children: labels.itemsCount(model.cardCount) }) }), _jsx("div", { className: "flex min-w-0 gap-2 overflow-x-auto pb-1", children: model.columns.map((column) => (_jsxs("section", { className: "flex w-44 shrink-0 flex-col gap-1.5 rounded-lg bg-surface p-2", "data-column-id": column.id, "data-testid": "artifact-board-column", children: [_jsxs("header", { className: "flex items-baseline justify-between gap-2", children: [_jsx("h4", { className: "min-w-0 truncate text-ui-sm font-medium text-foreground", title: columnLabel(column, labels), children: columnLabel(column, labels) }), _jsx("span", { className: "shrink-0 font-mono text-ui-xs text-foreground-subtlest tabular-nums", children: column.cards.length })] }), column.cards.map((card) => (_jsx(BoardCard, { card: card }, card.id)))] }, column.id))) })] }));
});
//# sourceMappingURL=ArtifactBoard.js.map