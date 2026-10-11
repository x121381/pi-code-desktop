import type { FeedbackTicketSummary } from "@zcode/shared";
import type { IFeedbackService } from "@zcode/services";
export declare function TicketsView({ feedbackService, onCreateNew, }: {
    feedbackService: IFeedbackService;
    onCreateNew: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function TicketsInitialLoadingState(): import("react/jsx-runtime").JSX.Element;
export declare function FeedbackTicketList({ items, selectedTicketId, copiedTicketId, onCopyTicketId, }: {
    items: FeedbackTicketSummary[];
    selectedTicketId: string | null;
    copiedTicketId: string | null;
    onCopyTicketId: (ticketId: string) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=TicketsView.d.ts.map