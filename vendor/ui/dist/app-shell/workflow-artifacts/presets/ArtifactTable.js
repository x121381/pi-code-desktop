import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * `table` 预置渲染器：一行一条（或按 `key` upsert 的一行一实体）。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的行数 + 前 3 行；
 * - 全尺寸：`workflow-artifact` tab 里的完整表格，表头吸顶、自带纵横滚动。
 *
 * 刻意**不复用** `MarkdownTable`：那是一份 1400 行、带排序 / 选区 / 复制 / 虚拟化的富组件，
 * 为一张只读投影表把它整棵拖进来不划算（spec 允许「或轻量表格，实现期定」）。行数用一个
 * 固定上限兜住 DOM 规模，超出的部分在表头的计数里如实呈现——这比装一个虚拟器便宜得多，
 * 而条目本身在投影侧已经是有界的。
 */
import { memo, useMemo } from "react";
import { applyArtifactItems, } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { fieldHeading, PresetEmpty, PresetHeading, REVEAL_ANIMATION_CLASS, } from "@/app-shell/workflow-artifacts/presets/parts.js";
import { cn } from "@/components/lib/utils.js";
/** 小卡片里只露前几行——它是一个「有东西了」的信号，不是阅读面。 */
const COMPACT_ROWS = 3;
/** 全尺寸下真正挂进 DOM 的行数上限；再多也读不过来，且 DOM 规模必须有界。 */
const ARTIFACT_TABLE_MAX_ROWS = 200;
export const ArtifactTable = memo(function ArtifactTable({ spec, items, compact = false, labels, className, }) {
    const model = useMemo(() => applyArtifactItems("table", spec, items), [spec, items]);
    const total = model.rows.length;
    const visible = compact
        ? model.rows.slice(0, COMPACT_ROWS)
        : model.rows.slice(0, ARTIFACT_TABLE_MAX_ROWS);
    if (total === 0) {
        return (_jsxs("div", { className: className, children: [compact ? null : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title })), _jsx(PresetEmpty, { compact: compact, label: labels.empty })] }));
    }
    const count = (_jsx("span", { className: "shrink-0 font-mono text-ui-xs text-foreground-subtlest tabular-nums", "data-testid": "artifact-table-count", children: labels.itemsCount(total) }));
    return (_jsxs("div", { className: cn("min-w-0", className), "data-testid": "artifact-table", children: [compact ? (_jsx("div", { className: "mb-1.5 flex justify-end", children: count })) : (_jsx(PresetHeading, { className: "mb-3", description: spec.description, title: spec.title, trailing: count })), _jsx("div", { className: cn("min-w-0 overflow-auto rounded-lg border border-border", compact ? "" : "max-h-128"), children: _jsxs("table", { className: "w-full border-collapse text-left", children: [_jsx("thead", { className: "sticky top-0 z-10 bg-surface", children: _jsx("tr", { children: model.columns.map((column) => (_jsx("th", { className: "whitespace-nowrap border-b border-border px-2 py-1.5 text-ui-xs font-medium text-foreground-subtle", scope: "col", children: fieldHeading(column.label, column.unit) }, column.field))) }) }), _jsx("tbody", { children: visible.map((row) => (_jsx("tr", { className: cn("border-b border-border/60 last:border-b-0 hover:bg-hover", REVEAL_ANIMATION_CLASS), "data-testid": "artifact-table-row", children: row.cells.map((cell, index) => (_jsx("td", { className: "max-w-56 truncate px-2 py-1 font-mono text-ui-xs text-foreground", title: cell, children: cell }, model.columns[index]?.field ?? index))) }, row.id))) })] }) })] }));
});
//# sourceMappingURL=ArtifactTable.js.map