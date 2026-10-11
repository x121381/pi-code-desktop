import type { GitChangeSourceId, GitDiffResult } from "@zcode/shared";
export type GitPaneDiffPreviewPlan = {
    kind: "rich";
} | {
    kind: "patch";
} | {
    kind: "plain-text";
    lines: string[];
};
export declare function getSourceMessageId(sourceId: GitChangeSourceId): string;
export declare function getDiffFallbackMessageId(availability: GitDiffResult["availability"]): string;
export declare function getDiffCacheKey(sourceId: GitChangeSourceId, path: string): string;
export declare function getGitPaneDiffFindContent(diff: GitDiffResult | null): string | null;
export declare function getErrorMessage(error: unknown): string;
export declare function shouldRenderPatchOnlyGitDiffPreview(diff: GitDiffResult): boolean;
export declare function getGitPaneDiffPreviewPlan(diff: GitDiffResult | null): GitPaneDiffPreviewPlan;
export declare function shouldRenderPlainTextDiffPreview(patch: string): string[] | null;
//# sourceMappingURL=helpers.d.ts.map