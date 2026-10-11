import { type FeedbackTicketModule, type FeedbackTicketSeverity, type FeedbackTicketType } from "@zcode/shared";
import type { IFeedbackService } from "@zcode/services";
import type { ScreenshotAttachmentDraft } from "@/feedback/FeedbackScreenshotPicker.js";
import type { FeedbackAgentModelContext } from "@/feedback/feedbackSubmitModelContext.js";
import { type FeedbackSubmissionCopy, type FeedbackSubmissionJob } from "@/feedback/feedbackSubmissionJob.js";
export declare const DEFAULT_FEEDBACK_TYPE: FeedbackTicketType;
export declare const DEFAULT_FEEDBACK_SEVERITY: FeedbackTicketSeverity;
export declare const DEFAULT_FEEDBACK_MODULE: FeedbackTicketModule;
export declare function startSimplifiedFeedbackSubmission({ feedbackService, title, description, contact, screenshots, includeLogs, ticketType, ticketSeverity, ticketModule, modelContext, locale, copy, formatMessage, onTicketCreated, onCompleted, onError, }: {
    feedbackService: IFeedbackService;
    title?: string;
    description: string;
    contact: string;
    screenshots: ScreenshotAttachmentDraft[];
    includeLogs: boolean;
    ticketType: FeedbackTicketType;
    ticketSeverity: FeedbackTicketSeverity;
    ticketModule: FeedbackTicketModule;
    modelContext: FeedbackAgentModelContext;
    locale: "zh-CN" | "en-US";
    copy: FeedbackSubmissionCopy;
    formatMessage: (descriptor: {
        id: string;
    }, values?: Record<string, string>) => string;
    onTicketCreated?: (ticketId: string) => void;
    onCompleted: (ticketId: string) => void;
    onError: (message: string) => void;
}): Promise<FeedbackSubmissionJob>;
//# sourceMappingURL=feedbackSubmitSubmission.d.ts.map