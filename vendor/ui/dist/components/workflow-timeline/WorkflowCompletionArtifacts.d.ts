import type { ReactNode } from "react";
import type { PresetLabels } from "@/app-shell/workflow-artifacts/presets/index.js";
import { type WorkflowCompletionArtifact } from "./WorkflowArtifactTile.js";
/**
 * 完成卡的产物区。
 * 从 `WorkflowCompletionCard` 拆出来：卡本身要守 400 行的门。
 *
 * - **有交付物**（打了 primary 旗子的那件，或清单只有一件）：交付物行，然后其余产物作**索引**——
 *   一件一行，卡宽时两列；至多六行，从第七件起五行 + 一行「还有 N 个」（点开 run 侧板看全部）。
 * - **没有交付物**：没有哪一件配得上一张预览，就一张也不画——索引独占产物区，同一个上限。
 *
 * 只有交付物的框读字节（预览要么读得清，要么不画）；索引行与「还有 N 个」从不读。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出。
 */
/** 卡上索引的行数上限，也是不折叠时的上限。 */
export declare const COMPLETION_INDEX_MAX = 6;
export interface CompletionArtifactLayout {
    /** 交付物；缺席即索引独占。 */
    primary?: WorkflowCompletionArtifact;
    /** 画成行的那些件（交付物之外）。 */
    lines: readonly WorkflowCompletionArtifact[];
    /** 没画出来的件数（「还有 N 个」的 N）。 */
    folded: number;
    /** 画「还有 N 个」：有折叠的件，或清单被发射侧砍过（此时 N 不可知，写 `…`）。 */
    more: boolean;
}
/** 布局的**唯一**判定；卡（节奏）、取数门（哪些件读字节）与渲染都从这里读。 */
export declare function completionArtifactLayout(artifacts: readonly WorkflowCompletionArtifact[], truncated: boolean): CompletionArtifactLayout;
/** 卡上画出来的格数（行算一格，每条索引行一格，「还有 N 个」一格）：四格数字的落地节拍接在它们之后。 */
export declare function completionArtifactCellCount(layout: CompletionArtifactLayout): number;
/** 会读字节的那些件：只有交付物的框读；索引行与门从不读。 */
export declare function completionPreviewIds(layout: CompletionArtifactLayout): ReadonlySet<string>;
export declare function WorkflowCompletionArtifacts({ artifactsTruncated, labels, layout, onOpenArtifact, onOpenRun, renderPreview, }: {
    layout: CompletionArtifactLayout;
    artifactsTruncated: boolean;
    labels: PresetLabels;
    renderPreview?: (artifact: WorkflowCompletionArtifact) => ReactNode;
    onOpenArtifact?: (artifactId: string) => void;
    onOpenRun?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowCompletionArtifacts.d.ts.map