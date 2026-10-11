import { type CodeCommentComposerAttachment, type CodeCommentPreview, type CodeCommentRemovePayload } from "@/lib/codeCommentContext.js";
type CodeCommentPreviewBucketKey = string;
interface CodeCommentPreviewStoreState {
    commentsByBucketKey: Record<CodeCommentPreviewBucketKey, CodeCommentPreview[]>;
    getComments: (params: CodeCommentPreviewBucketParams) => CodeCommentPreview[];
    addComment: (params: CodeCommentPreviewBucketParams & {
        comment: CodeCommentPreview;
    }) => void;
    removeComment: (params: CodeCommentPreviewBucketParams & {
        id: string;
    }) => void;
    removeCommentBySource: (payload: CodeCommentRemovePayload) => void;
    restoreCommentFromAttachment: (attachment: CodeCommentComposerAttachment) => void;
    clearSource: (params: CodeCommentPreviewBucketParams) => void;
}
interface CodeCommentPreviewBucketParams {
    workspacePath: string;
    workspaceIdentity?: string;
    sourcePath: string;
}
export declare function buildCodeCommentPreviewBucketKey({ workspacePath, workspaceIdentity, sourcePath, }: CodeCommentPreviewBucketParams): CodeCommentPreviewBucketKey;
export declare const useCodeCommentPreviewStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CodeCommentPreviewStoreState>>;
export {};
//# sourceMappingURL=codeCommentPreviewStore.d.ts.map