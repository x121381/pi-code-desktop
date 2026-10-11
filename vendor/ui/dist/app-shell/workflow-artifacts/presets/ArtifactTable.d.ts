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
import { type ArtifactItem } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { type PresetLabels } from "@/app-shell/workflow-artifacts/presets/parts.js";
import type { TableSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
export declare const ArtifactTable: import("react").MemoExoticComponent<({ spec, items, compact, labels, className, }: {
    spec: TableSpec;
    items: readonly ArtifactItem[];
    compact?: boolean;
    labels: PresetLabels;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=ArtifactTable.d.ts.map