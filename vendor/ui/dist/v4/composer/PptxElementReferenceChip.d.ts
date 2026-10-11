import type { AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
import type { PptxElementReference } from "@/lib/pptxElementReference.js";
export declare function PptxElementReferenceChip({ references, contentAlign, onOpen, onRemove, onRemoveAll, }: {
    references: readonly PptxElementReference[];
    contentAlign?: AttachmentHoverCardContentProps["align"];
    onOpen?: (reference: PptxElementReference) => void;
    onRemove?: (id: string) => void;
    onRemoveAll?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PptxElementReferenceChip.d.ts.map