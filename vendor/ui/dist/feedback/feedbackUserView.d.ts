import type { FeedbackComment, FeedbackTicketStatus } from "@zcode/shared";
type MessageFormatter = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
export declare const STATUS_USER_HINT: Record<FeedbackTicketStatus, string>;
export declare const STATUS_USER_HINT_MESSAGE_IDS: Record<FeedbackTicketStatus, string>;
export declare function formatFeedbackStatusHint(status: FeedbackTicketStatus, formatMessage: MessageFormatter): string;
export declare function formatRelativeTime(iso: string, formatMessage: MessageFormatter): string;
export declare function formatSubmittedAt(iso: string, formatMessage: MessageFormatter): string;
export declare function filterUserVisibleComments(comments: FeedbackComment[]): FeedbackComment[];
export declare function getUserFacingDescription(description: string): string;
export {};
//# sourceMappingURL=feedbackUserView.d.ts.map