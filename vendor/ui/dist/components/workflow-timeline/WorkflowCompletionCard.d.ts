import { type ReactNode } from "react";
import type { WorkflowCompletionArtifact } from "./WorkflowArtifactTile.js";
export { COMPLETION_INDEX_MAX } from "./WorkflowCompletionArtifacts.js";
/**
 * 完成卡：主代理消化一条 **completed** 工作流通知的那一轮，
 * 轮尾落下这张卡。顺序即论点——表头 → 这次 run **交付了什么**（交付物行）→ **还做了什么**（产物索引，
 * 一件一行）→ **花了多少**（四格数字）。三段之间各隔一条细线，像一张收据。产物区在 `WorkflowCompletionArtifacts`。
 *
 * 纯展示：产物清单、四个数字、每件产物的预览都由宿主交进来（预览要读字节，那是宿主的活）。
 * 没有 chevron——没有可展开的东西；整卡不是开关。
 *
 * 数字的诚实：拿不到的格写 `—`，不写 0。
 */
export interface WorkflowCompletionFigures {
    durationMs?: number;
    tokens?: number;
    subagents?: number;
    /** 进过的阶段数（`run.phases`）；没有 phase() 标记的脚本拿不到，写 `—`。 */
    phases?: number;
}
export interface WorkflowCompletionCardProps {
    name: string;
    figures: WorkflowCompletionFigures;
    artifacts: readonly WorkflowCompletionArtifact[];
    /** 发射侧砍过：「还有 N 个」的 N 写 `…`。 */
    artifactsTruncated?: boolean;
    /** 画出来的框的预览（只有交付物行有框）；缺席（或回 undefined）即纸页字形。 */
    renderPreview?: (artifact: WorkflowCompletionArtifact) => ReactNode;
    onOpenRun?: () => void;
    onOpenArtifact?: (artifactId: string) => void;
    /**
     * 表头状态之前的插槽：「已保存」芯片（docs/dynamic-workflow/transcript-and-notifications.md
     * 「Saving the run, and running it again」）。宿主建，卡只摆。
     */
    headerLeading?: ReactNode;
    /** 表头 ⤢ 之前的插槽：「保存」/「再次运行」。缺席即这张卡没有会话上下文，或两道门关着。 */
    headerTrailing?: ReactNode;
    testIdKey: string;
}
/**
 * tokens 的紧凑写法：`812` / `386.4k` / `1.30M`。千位一位小数、百万两位——固定位数让四格
 * 的等宽数字在 run 与 run 之间对得齐。全值进 title。
 */
export declare function formatCompactCount(count: number): {
    value: string;
    unit: string;
};
export declare function WorkflowCompletionCard({ artifacts, artifactsTruncated, figures, headerLeading, headerTrailing, name, onOpenArtifact, onOpenRun, renderPreview, testIdKey, }: WorkflowCompletionCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowCompletionCard.d.ts.map