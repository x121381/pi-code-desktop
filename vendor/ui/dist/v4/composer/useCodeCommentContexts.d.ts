import { type CodeCommentComposerAttachment } from "@/lib/codeCommentContext.js";
export interface UseCodeCommentContextsOptions {
    listenAddToChatEvents?: boolean;
    onContextRemoved?: (context: CodeCommentComposerAttachment) => void;
    requestFocus?: () => void;
    scopeKey: string;
}
export interface UseCodeCommentContextsResult {
    contexts: readonly CodeCommentComposerAttachment[];
    hasContexts: boolean;
    removeContext: (context: Pick<CodeCommentComposerAttachment, "id" | "workspaceIdentity" | "workspacePath">) => void;
    clearContexts: () => void;
    getContexts: () => readonly CodeCommentComposerAttachment[];
}
export declare function useCodeCommentContexts({ listenAddToChatEvents, onContextRemoved, requestFocus, scopeKey, }: UseCodeCommentContextsOptions): UseCodeCommentContextsResult;
//# sourceMappingURL=useCodeCommentContexts.d.ts.map