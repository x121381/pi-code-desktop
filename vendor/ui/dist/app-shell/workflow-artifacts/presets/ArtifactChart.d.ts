/**
 * `chart` 预置渲染器的**入口**：懒加载 + 局部故障隔离，本模块自己不碰 recharts。
 *
 * 为什么必须懒：recharts 在模块初始化阶段会触发 decimal.js-light 的 LN10 校验，在 Electron
 * Linux 容器里会阻断整个 renderer 启动（`AppUsagePanel.tsx` 里记着的那次修复；spec 的
 * 「预置渲染器」行也把 `lazy()` 写成硬要求）。所以：
 * - 绘图体在 `ArtifactChartView.tsx`，只经 `lazy()` 的动态 import 抵达；
 * - 这个文件与 `index.ts` 的静态依赖里没有 recharts，谁 import 它们都不会把图表打进首屏。
 *
 * 调用方也可以绕过这层，自己 `lazy(() => import(".../ArtifactChartView.js"))` 并接管
 * Suspense / 错误边界——本文件只是那套接法的默认封装。
 */
import type { ArtifactItem } from "@/app-shell/workflow-artifacts/presets/apply.js";
import type { PresetLabels } from "@/app-shell/workflow-artifacts/presets/parts.js";
import type { ChartSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
export declare function ArtifactChart({ spec, items, compact, labels, className, }: {
    spec: ChartSpec;
    items: readonly ArtifactItem[];
    compact?: boolean;
    labels: PresetLabels;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArtifactChart.d.ts.map