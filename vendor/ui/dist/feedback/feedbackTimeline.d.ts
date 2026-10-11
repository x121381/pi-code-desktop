import type { FeedbackComment, FeedbackCommentAttachment, FeedbackTicketEvent, FeedbackTicketEventType } from "@zcode/shared";
type MessageFormatter = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
interface FeedbackTimelineItem {
    id: string;
    kind: "event" | "reply";
    createdAt: string;
    type?: FeedbackTicketEventType;
    summary?: string;
    actor?: string | null;
    body?: string;
    attachments?: FeedbackCommentAttachment[];
    isStaff?: boolean;
}
export declare function getFeedbackTimelineItems(events: FeedbackTicketEvent[], comments: FeedbackComment[], formatMessage?: MessageFormatter): FeedbackTimelineItem[];
export declare function FeedbackTimeline({ events, comments, showDurations, }: {
    events: FeedbackTicketEvent[];
    comments: FeedbackComment[];
    showDurations?: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=feedbackTimeline.d.ts.map