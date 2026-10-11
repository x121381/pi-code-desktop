import type { AttachmentHoverCardContentProps } from "@/components/ai-elements/attachments.js";
import type { WebElementContextComposerAttachment } from "@/lib/webElementContext.js";
export declare function WebElementContextAttachmentChip({ contexts, contentAlign, onRemove, onRemoveAll, }: {
    contexts: readonly WebElementContextComposerAttachment[];
    contentAlign?: AttachmentHoverCardContentProps["align"];
    onRemove?: (id: string) => void;
    onRemoveAll?: () => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WebElementContextAttachmentChip.d.ts.map