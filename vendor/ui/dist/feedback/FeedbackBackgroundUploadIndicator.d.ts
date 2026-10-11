import { type FeedbackSubmissionJobSnapshot, type FeedbackSubmissionJobStatus, type FeedbackSubmissionProgressState } from "@/feedback/feedbackSubmissionJob.js";
interface FeedbackBackgroundUploadIndicatorProps {
    feedbackDialogOpen: boolean;
}
export interface FeedbackBackgroundUploadIndicatorViewProps {
    status: FeedbackSubmissionJobStatus;
    progress: FeedbackSubmissionProgressState;
    ticketId?: string;
    error?: string;
    onOpen: () => void;
    onContinueUpload: () => void;
    onDismiss: () => void;
    defaultExpanded?: boolean;
}
export declare function shouldOpenExistingFeedbackTicket(status: FeedbackSubmissionJobStatus, ticketId: string | undefined): ticketId is string;
export type FeedbackBackgroundOpenTarget = {
    kind: "submission";
    jobId: string;
} | {
    kind: "ticket";
    ticketId: string;
};
export declare function getFeedbackBackgroundOpenTarget(job: Pick<FeedbackSubmissionJobSnapshot, "id" | "status" | "ticketId">): FeedbackBackgroundOpenTarget;
export declare function FeedbackBackgroundUploadIndicator({ feedbackDialogOpen, }: FeedbackBackgroundUploadIndicatorProps): import("react/jsx-runtime").JSX.Element | null;
export declare function FeedbackBackgroundUploadIndicatorView({ status, progress, ticketId, error, onOpen, onContinueUpload, onDismiss, defaultExpanded, }: FeedbackBackgroundUploadIndicatorViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=FeedbackBackgroundUploadIndicator.d.ts.map