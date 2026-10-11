import type { AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
import type { CodeCommentComposerAttachment } from "@/lib/codeCommentContext.js";
export declare function CodeCommentAttachmentChip({ comments, contentAlign, onRemove, onRemoveAll, }: {
    comments: readonly CodeCommentComposerAttachment[];
    contentAlign?: AttachmentHoverCardContentProps["align"];
    onRemove?: (comment: CodeCommentComposerAttachment) => void;
    onRemoveAll?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=CodeCommentAttachmentChip.d.ts.map