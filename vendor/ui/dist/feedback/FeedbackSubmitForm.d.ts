import type { FeedbackSubmitDraft } from "@/feedback/feedbackStore.js";
import type { IFeedbackService } from "@zcode/services";
import type { IPlatformService } from "@zcode/shared";
export { SubmitProgressView } from "@/feedback/FeedbackSubmitProgressView.js";
export { readCurrentAgentModelContext } from "@/feedback/feedbackSubmitModelContext.js";
export declare function shouldAutoCloseFeedbackOnTicketCreated({ includeLogs, screenshotCount, }: {
    includeLogs: boolean;
    screenshotCount: number;
}): boolean;
export declare function FeedbackSubmitForm({ feedbackService, platform: _platform, initialDraft, submissionJobId, onSubmitted, onViewTickets, onCancel, }: {
    feedbackService: IFeedbackService;
    platform: IPlatformService;
    initialDraft?: FeedbackSubmitDraft | null;
    submissionJobId?: string | null;
    onSubmitted: (ticketId: string) => void;
    onViewTickets: () => void;
    onCancel: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FeedbackSubmitForm.d.ts.map