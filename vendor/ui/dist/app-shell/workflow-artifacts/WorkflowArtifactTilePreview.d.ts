import { type WorkflowCompletionArtifact } from "@/components/workflow-timeline/WorkflowArtifactTile.js";
import type { Theme } from "@/useTheme.js";
type PreviewMode = "markdown" | "csv" | "text" | "image";
export declare function previewModeFor(artifact: {
    kind: WorkflowCompletionArtifact["kind"];
    contentType?: string;
    bytes?: number;
}): PreviewMode | undefined;
/** 最小的 CSV 读法：只认逗号与成对引号，够画一张缩略；不是解析器。 */
export declare function csvPreviewRows(text: string): string[][];
export declare function WorkflowArtifactTilePreview({ artifact, runId, sessionId, theme, }: {
    artifact: WorkflowCompletionArtifact;
    sessionId: string;
    runId: string;
    theme: Theme;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkflowArtifactTilePreview.d.ts.map