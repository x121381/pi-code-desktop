import type { FeedbackTicketDetail } from "@zcode/shared";
import type { IFeedbackService } from "@zcode/services";
export declare function TicketDetailView({ ticket, feedbackService, onRefresh, onOpenProcess, }: {
    ticket: FeedbackTicketDetail;
    feedbackService: IFeedbackService;
    onRefresh: () => Promise<void>;
    onOpenProcess: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TicketDetail.d.ts.map