import type { CodeCommentPreview, CodeCommentRange } from "@/lib/codeCommentContext.js";
import type { CodeReviewCodeViewerSource } from "@/lib/codeViewer.js";
export interface CodeReviewContentProjection {
    focusedRange: CodeCommentRange | null;
    inlineComments: readonly CodeCommentPreview[];
    targetLineOutOfRange: boolean;
    topComment: CodeCommentPreview | null;
}
export declare function resolveCodeReviewContentProjection(source: CodeReviewCodeViewerSource, content: string): CodeReviewContentProjection;
//# sourceMappingURL=previewPaneCodeReview.d.ts.map