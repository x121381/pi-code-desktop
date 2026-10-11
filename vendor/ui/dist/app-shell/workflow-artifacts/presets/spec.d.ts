/**
 * 预置产物（chart / table / metrics / board）的 spec 类型镜像 + 宽松解析。
 *
 * 这里的 `artifact` 是**用户面**的那一个：
 * 脚本经 `artifact.chart(id, spec)` 声明、由 `report(item, id)` 流喂养的看板；不是引擎内部
 * `RunSettlement.artifact` 那个「顶层返回值」。
 *
 * **为什么要在 UI 侧再解析一遍。** spec 的权威校验在引擎（zod，非法形状直接 failRun），
 * 落到 journal 的是 canonical JSON，再经 v4 投影到达 renderer 时类型已经退化成 `unknown`。
 * renderer 拿到的可能是：新 CLI 写的合法 spec、老 CLI 写的少字段 spec、或者一条被截断/篡改的行。
 * 渲染器不该对这些情况抛异常把整个侧板炸掉——所以这一层只做**结构性**判断，
 * 能渲染就返回归一化后的 spec，不能渲染就返回 `undefined`（调用方降级成一张「无法渲染」的卡）。
 *
 * 宽松 = 多余的键原样忽略、坏掉的可选字段丢掉、必填字段缺失才判不可渲染。
 */
/** 从一条 report 条目里取一个值：条目内的点路径（"timing.after"）。 */
export type ArtifactField = {
    field: string;
    label?: string;
    unit?: string;
};
export type ArtifactChartType = "line" | "bar" | "scatter";
export type ArtifactChartScale = "linear" | "log";
/** 所有预置 spec 共享的展示字段（facade 的 `ArtifactOptions`）。 */
type ArtifactPresetOptions = {
    title?: string;
    description?: string;
};
export type ChartSpec = ArtifactPresetOptions & {
    /** 默认 "line"。 */
    type?: ArtifactChartType;
    x: ArtifactField;
    /** 多个 = 多条序列。 */
    y: ArtifactField | ArtifactField[];
    /** y 轴，默认 "linear"。 */
    scale?: ArtifactChartScale;
    /** 画成一条水平参考线，取自第一条**带该字段**的条目。 */
    baseline?: ArtifactField;
};
export type TableSpec = ArtifactPresetOptions & {
    columns: ArtifactField[];
    /** 行的身份字段；同 key 的后续条目替换该行。缺席 = 只追加。 */
    key?: string;
};
export type MetricsSpec = ArtifactPresetOptions & {
    /** 每块瓦片显示**最后一条带该字段**的条目里的值。 */
    metrics: ArtifactField[];
};
export type BoardSpec = ArtifactPresetOptions & {
    /** 卡片的身份字段；同 key 的后续条目移动 / 更新该卡。 */
    key: string;
    /** 卡片所在列的字段。 */
    status: string;
    /** 列序。status 不在列表里的条目落到末尾的「其他」列。 */
    columns: string[];
    /** 卡片标题字段（缺省用 key）与卡片上额外展示的字段。 */
    cardTitle?: string;
    detail?: ArtifactField[];
};
export type ArtifactPresetKind = "chart" | "table" | "metrics" | "board";
export type ArtifactPresetSpec = ChartSpec | TableSpec | MetricsSpec | BoardSpec;
/**
 * 把 wire 上的 `unknown` spec 解析成可渲染的形状；`undefined` = 渲染不了。
 *
 * 归一化的部分（下游因此不必再兜底）：`chart.y` 一律是数组、`chart.type` / `chart.scale`
 * 一律有值、空字符串 / 空白串一律当缺席。
 */
export declare function parseArtifactPresetSpec(kind: ArtifactPresetKind, spec: unknown): ArtifactPresetSpec | undefined;
/** `chart.y` 归一化后的读法；解析过的 spec 一定是数组，这里只做类型收窄。 */
export declare function chartSeriesFields(spec: ChartSpec): ArtifactField[];
/** 字段在界面上的名字：显式 `label` 优先，否则用点路径本身。 */
export declare function artifactFieldLabel(field: ArtifactField): string;
/**
 * 一张看板会读到的全部字段路径（去重、按 spec 里出现的顺序）：看板取数只让 CLI 取这些字段，
 * 而不是整条 item（docs/execution-engine.md「Reading the journal」）。`applyArtifactItems` 读的
 * 每一个路径都必须在这里——漏一个，那一列 / 那条序列就永远是空的。spec 画不了时回 `undefined`
 * （调用方退回取整条 item，渲染层自会显示「无法渲染」）。
 */
export declare function artifactPresetFieldPaths(kind: ArtifactPresetKind, rawSpec: unknown): string[] | undefined;
export {};
//# sourceMappingURL=spec.d.ts.map