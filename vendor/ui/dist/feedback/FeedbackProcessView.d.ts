import type { FeedbackTicketDetail } from "@zcode/shared";
import type { IFeedbackService } from "@zcode/services";
export declare function FeedbackProcessView({ ticket, feedbackService, onBack, onRefresh, }: {
    ticket: FeedbackTicketDetail;
    feedbackService: IFeedbackService;
    onBack: () => void;
    onRefresh: () => Promise<void>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FeedbackProcessView.d.ts.map