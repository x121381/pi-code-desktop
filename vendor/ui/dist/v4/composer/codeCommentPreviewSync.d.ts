import { type CodeCommentComposerAttachment } from "@/lib/codeCommentContext.js";
interface BroadcastMessage {
    channel: string;
    payload: unknown;
}
export declare function removeCodeCommentPreview(attachment: CodeCommentComposerAttachment, port?: {
    send: (message: BroadcastMessage) => Promise<void> | void;
}): void;
export {};
//# sourceMappingURL=codeCommentPreviewSync.d.ts.map