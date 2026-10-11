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
import { type ArtifactItem } from "@/app-shell/workflow-artifacts/presets/apply.js";
import { type PresetLabels } from "@/app-shell/workflow-artifacts/presets/parts.js";
import type { BoardSpec } from "@/app-shell/workflow-artifacts/presets/spec.js";
export declare const ArtifactBoard: import("react").MemoExoticComponent<({ spec, items, compact, labels, className, }: {
    spec: BoardSpec;
    items: readonly ArtifactItem[];
    compact?: boolean;
    labels: PresetLabels;
    className?: string;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=ArtifactBoard.d.ts.map