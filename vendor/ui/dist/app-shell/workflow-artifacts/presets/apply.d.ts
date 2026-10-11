/**
 * `applyArtifactItems` —— 把一串 `report(item, artifactId)` 条目折成预置看板的视图模型。
 *
 * 纯函数、不含 React：看板本身**不存数据**，它的每一个点 / 行 / 卡片都是一条 journal 上
 * `kind = "report"` 且 `artifact_id` 命中的条目。同一批条目重放两次必须得到同一张图，所以这里不许有任何
 * 时间、随机或外部状态；折叠规则全部由 spec 决定。
 *
 * 条目只会**追加**（journal 只追加），所以四种折叠都可以按到达顺序单遍完成。
 */
import { type ArtifactChartScale, type ArtifactChartType, type ArtifactPresetKind, type ArtifactPresetSpec, type BoardSpec, type ChartSpec, type MetricsSpec, type TableSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
/**
 * 一条到达的条目。`sequence` 是 run 内全局递增的事件序号——它同时是 React key
 * （新点揭示动画靠它区分「这个点是新来的」）与增量取数的游标；`siteId × ordinal`
 * 是 journal 上的身份（同 Results 区的 key 习语），用于没有 spec key 时的行/卡身份。
 */
export type ArtifactItem = {
    sequence: number;
    siteId: string;
    ordinal: number;
    /** 整条 item（老 CLI、或没有点名字段的取数）。 */
    item?: unknown;
    /**
     * 只取字段时：spec 点名的路径 → 值（CLI 在 SQLite 里取好、超长的值已截短）。走不通的路径
     * 不在表里。在场时折叠只读它，不读 `item`。
     */
    fields?: Record<string, unknown>;
};
export type ChartSeriesModel = {
    /** recharts 的 dataKey；用序号而不是字段路径，点路径里的 "." 会被 recharts 当嵌套读法。 */
    key: string;
    field: string;
    label: string;
    unit?: string;
    /** 调色板槽位（see seriesColorVar）。 */
    colorIndex: number;
};
export type ChartPointModel = Record<string, number | string | null> & {
    /** 稳定 React key：只有新点播揭示动画，老点不重播。 */
    sequence: number;
    /** x 轴上的位置。非数值 x 时是到达序号。 */
    x: number;
    /** x 轴刻度上显示的文本。 */
    xLabel: string;
};
export type ChartModel = {
    kind: "chart";
    type: ArtifactChartType;
    scale: ArtifactChartScale;
    series: ChartSeriesModel[];
    points: ChartPointModel[];
    x: {
        label: string;
        unit?: string;
        numeric: boolean;
    };
    /** 参考线：取自第一条带该字段的条目。log 轴下非正的参考线同样丢弃。 */
    baseline?: {
        value: number;
        label: string;
        unit?: string;
    };
    /** memo 比较用的定义域；无点时缺席。 */
    domain?: {
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
    };
};
type TableColumnModel = {
    field: string;
    label: string;
    unit?: string;
};
type TableRowModel = {
    id: string;
    sequence: number;
    cells: string[];
};
type TableModel = {
    kind: "table";
    columns: TableColumnModel[];
    rows: TableRowModel[];
};
export type MetricTileModel = {
    field: string;
    label: string;
    unit?: string;
    /** 最后一条带该字段的条目里的值；从没出现过则缺席。 */
    value?: string;
    raw?: unknown;
    /** 该值来自哪一条条目——瓦片刷新时的动画 key。 */
    sequence?: number;
};
type MetricsModel = {
    kind: "metrics";
    metrics: MetricTileModel[];
};
export type BoardCardModel = {
    id: string;
    sequence: number;
    title: string;
    status: string;
    details: {
        label: string;
        value: string;
        unit?: string;
    }[];
};
export type BoardColumnModel = {
    id: string;
    /** 「其他」列没有 spec 给的名字，标签由渲染器用 labels.otherColumn 补。 */
    other: boolean;
    cards: BoardCardModel[];
};
type BoardModel = {
    kind: "board";
    columns: BoardColumnModel[];
    cardCount: number;
};
type ArtifactPresetModel = ChartModel | TableModel | MetricsModel | BoardModel;
/**
 * 点路径读取："timing.after"、"rounds.0.ms"。规则是协议上的契约
 * （`readWorkflowArtifactField`）：CLI 只取字段时在 SQLite 里按同一套规则取值，两边必须逐字相同。
 */
export declare function readArtifactField(item: unknown, path: string): unknown;
/** 单元格 / 卡片明细的显示文本。对象走紧凑 JSON——比 "[object Object]" 有用得多。 */
export declare function formatArtifactValue(value: unknown): string;
export declare function applyArtifactItems(kind: "chart", spec: ChartSpec, items: readonly ArtifactItem[]): ChartModel;
export declare function applyArtifactItems(kind: "table", spec: TableSpec, items: readonly ArtifactItem[]): TableModel;
export declare function applyArtifactItems(kind: "metrics", spec: MetricsSpec, items: readonly ArtifactItem[]): MetricsModel;
export declare function applyArtifactItems(kind: "board", spec: BoardSpec, items: readonly ArtifactItem[]): BoardModel;
export declare function applyArtifactItems(kind: ArtifactPresetKind, spec: ArtifactPresetSpec, items: readonly ArtifactItem[]): ArtifactPresetModel;
export {};
//# sourceMappingURL=apply.d.ts.map