/**
 * `chart` 预置渲染器的**实现**（recharts 在这个模块里，且只在这里）。
 *
 * 不要直接从 index 静态导入它：recharts 在模块初始化阶段会触发 decimal.js-light 的 LN10 校验，
 * 在 Electron Linux 容器里能阻断整个 renderer 启动（同 `AppUsagePanel.tsx` 里记下的那次修复）。
 * 对外的入口是 `ArtifactChart.tsx`，它用 `lazy()` 把这个模块推到首屏之外。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的**无轴 sparkline + 最新值**；
 * - 全尺寸：`workflow-artifact` tab 里的带轴图 + 图例 + 参考线 + tooltip。
 */
import { type ArtifactItem, type ChartModel } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { type PresetLabels } from "@/app-shell/workflow-artifacts/presets/parts.js";
import type { ChartSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
/**
 * 真正的绘图体，`memo` 且带自定义比较：**只在点数 / 定义域 / 序列构成变化时重渲染**。
 *
 * 理由是 portfolio 修过的第一帧冻结——recharts 会在 effect 里把 props 镜像进内部 store，
 * 父组件每次 render 都换一份 data 引用时，这条镜像链会被放大成成百上千次无意义更新。
 * 条目只追加，所以「点数 + 首尾 sequence + 定义域」足以判定数据是否真的变了。
 */
type PlotProps = {
    model: ChartModel;
    compact: boolean;
};
/**
 * `memo` 的比较谓词（`true` = 跳过重渲染）。单独导出是为了能直接测——「什么时候不重画」
 * 是这张图的性能契约本身，把它藏在 memo 的第二实参里就没法钉住了。
 */
export declare function chartPlotPropsEqual(previous: PlotProps, next: PlotProps): boolean;
export declare function ArtifactChartView({ spec, items, compact, labels, className, }: {
    spec: ChartSpec;
    items: readonly ArtifactItem[];
    compact?: boolean;
    labels: PresetLabels;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export default ArtifactChartView;
//# sourceMappingURL=ArtifactChartView.d.ts.map