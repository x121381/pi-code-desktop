/**
 * `metrics` 预置渲染器：一排瓦片，每块显示**最后一条带该字段**的条目里的值。
 *
 * 两种形态：
 * - `compact`：run 侧板卡片里的瓦片行，横向排，只有值和标签；
 * - 全尺寸：`workflow-artifact` tab 里的网格，值更大、带单位。
 */
import { type ArtifactItem } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { type PresetLabels } from "@/app-shell/workflow-artifacts/presets/parts.js";
import type { MetricsSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
export declare const ArtifactMetrics: import("react").MemoExoticComponent<({ spec, items, compact, labels, className, }: {
    spec: MetricsSpec;
    items: readonly ArtifactItem[];
    compact?: boolean;
    labels: PresetLabels;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=ArtifactMetrics.d.ts.map