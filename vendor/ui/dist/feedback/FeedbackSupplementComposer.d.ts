import type { FeedbackAttachmentKind } from "@zcode/shared";
import type { IFeedbackService } from "@zcode/services";
export declare const MAX_SUPPLEMENT_ATTACHMENTS = 6;
export declare const MAX_SUPPLEMENT_ATTACHMENT_BYTES: number;
export interface SupplementAttachmentDraft {
    id: string;
    filename: string;
    contentType: string;
    dataBase64: string;
    size: number;
    kind: FeedbackAttachmentKind;
}
export declare function submitSupplementFeedback({ ticketId, feedbackService, comment, attachments, formatUploadedAttachments, }: {
    ticketId: string;
    feedbackService: Pick<IFeedbackService, "comment" | "uploadAttachmentData">;
    comment: string;
    attachments: SupplementAttachmentDraft[];
    formatUploadedAttachments: (names: string[]) => string;
}): Promise<void>;
export declare function FeedbackSupplementComposer({ ticketId, feedbackService, onSubmitted, title, description, }: {
    ticketId: string;
    feedbackService: IFeedbackService;
    onSubmitted: () => Promise<void>;
    title?: string;
    description?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FeedbackSupplementComposer.d.ts.map