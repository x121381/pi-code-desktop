import type { PresetLabels } from "@/app-shell/workflow-artifacts/presets/index.js";
import type { WorkflowCompletionArtifact } from "./WorkflowArtifactTile.js";
type WorkflowArtifactIndexColumns = "auto" | "one";
/**
 * 索引本身：行 + 可选的门。`columns="auto"` 是卡上的两列流（≥ 2 × 220px 才成两列），`"one"` 是侧板
 * 的单列。`rule` 在上方画那条细线（跟在交付物行之后时要；索引独占卡时不要）。行依次落地，从
 * `firstDelayMs` 起每行错 30ms，门排在最后一行之后。
 */
export declare function WorkflowArtifactIndex({ artifacts, columns, firstDelayMs, folded, labels, lineTestId, more, moreTestId, onOpenArtifact, onOpenRun, rule, testId, tooltipOf, truncated, }: {
    artifacts: readonly WorkflowCompletionArtifact[];
    labels: PresetLabels;
    columns?: WorkflowArtifactIndexColumns;
    rule?: boolean;
    /** 画「还有 N 个」；`folded` 是 N。 */
    more?: boolean;
    folded?: number;
    truncated?: boolean;
    firstDelayMs?: number;
    onOpenArtifact?: (artifactId: string) => void;
    onOpenRun?: () => void;
    testId?: string;
    lineTestId?: string;
    moreTestId?: string;
    tooltipOf?: (artifact: WorkflowCompletionArtifact) => string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkflowArtifactIndex.d.ts.map