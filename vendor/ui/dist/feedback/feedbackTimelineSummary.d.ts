import type { FeedbackTicketEvent } from "@zcode/shared";
type MessageFormatter = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
export declare function getUserFacingEventSummary(event: FeedbackTicketEvent, formatMessage?: MessageFormatter): string;
export {};
//# sourceMappingURL=feedbackTimelineSummary.d.ts.map