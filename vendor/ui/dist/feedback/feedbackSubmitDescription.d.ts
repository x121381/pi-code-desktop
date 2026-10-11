import type { FeedbackAgentModelContext } from "@/feedback/feedbackSubmitModelContext.js";
import type { FeedbackTicketModule, FeedbackTicketSeverity, FeedbackTicketType } from "@zcode/shared";
type MessageFormatter = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
export declare function buildFeedbackTitle(description: string, formatMessage: MessageFormatter): string;
export declare function buildDeveloperFacingDescription({ raw, modelContext, ticketType, ticketModule, ticketSeverity, formatMessage, }: {
    raw: string;
    modelContext: FeedbackAgentModelContext;
    ticketType?: FeedbackTicketType;
    ticketModule?: FeedbackTicketModule;
    ticketSeverity?: FeedbackTicketSeverity;
    formatMessage: MessageFormatter;
}): string;
export {};
//# sourceMappingURL=feedbackSubmitDescription.d.ts.map