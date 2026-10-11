export declare const CODE_COMMENT_ADD_TO_CHAT_EVENT = "zcode:code-comment-add-to-chat";
export declare const CODE_COMMENT_REMOVE_FROM_CHAT_EVENT = "zcode:code-comment-remove-from-chat";
export declare const CODE_COMMENT_REMOVE_BROADCAST_CHANNEL = "code-comment:remove-from-chat";
export declare const CODE_COMMENT_PREVIEW_RESTORE_BROADCAST_CHANNEL = "code-comment:restore-preview";
export interface CodeCommentRange {
    startLine: number;
    endLine: number;
}
export interface CodeCommentPayload extends CodeCommentRange {
    id?: string;
    workspacePath: string;
    workspaceIdentity?: string;
    sourcePath?: string;
    sourceTitle: string;
    selectedText: string;
    comment: string;
    contextLabel?: string;
    commentLabel?: string;
}
export interface CodeCommentComposerAttachment extends CodeCommentPayload {
    id: string;
}
export interface CodeCommentRemovePayload {
    id: string;
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface CodeCommentPreview extends CodeCommentRange {
    id: string;
    sourcePath?: string;
    sourceTitle: string;
    selectedText: string;
    comment: string;
}
interface ParsedCodeCommentPrompt {
    visibleContent: string;
    codeCommentAttachments: CodeCommentComposerAttachment[];
}
type CodeCommentAddToChatEvent = CustomEvent<CodeCommentPayload>;
type CodeCommentRemoveFromChatEvent = CustomEvent<CodeCommentRemovePayload>;
export declare function getCodeCommentWorkspaceKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function isCodeCommentMarkedRemoved(payload: CodeCommentRemovePayload): boolean;
export declare function markCodeCommentRemoved(payload: CodeCommentRemovePayload): void;
export declare function unmarkCodeCommentRemoved(payload: CodeCommentRemovePayload): void;
export declare function isCodeCommentAddToChatEvent(event: Event): event is CodeCommentAddToChatEvent;
export declare function isCodeCommentRemoveFromChatEvent(event: Event): event is CodeCommentRemoveFromChatEvent;
export declare function isCodeCommentRemovePayload(payload: unknown): payload is CodeCommentRemovePayload;
export declare function isCodeCommentPayload(payload: unknown): payload is CodeCommentPayload;
export declare function buildPromptWithCodeComments(text: string, attachments: readonly CodeCommentComposerAttachment[]): string;
export declare function parsePromptCodeComments(content: string, options: {
    workspacePath: string;
    workspaceIdentity?: string;
}): ParsedCodeCommentPrompt;
export declare function dispatchCodeCommentAddToChat(payload: CodeCommentPayload): boolean;
export declare function dispatchCodeCommentRemoveFromChat(payload: CodeCommentRemovePayload): void;
export {};
//# sourceMappingURL=codeCommentContext.d.ts.map