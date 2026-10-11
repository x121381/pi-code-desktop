import type { AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
import { type ConversationSelectionDisplayReference } from "@/lib/conversationSelectionReference.js";
export declare function ConversationSelectionReferenceChip({ references, contentAlign, onRemove, onRemoveAll, }: {
    references: readonly ConversationSelectionDisplayReference[];
    contentAlign?: AttachmentHoverCardContentProps["align"];
    onRemove?: (id: string) => void;
    onRemoveAll?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationSelectionReferenceChip.d.ts.map