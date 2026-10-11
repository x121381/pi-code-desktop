import type { ReactNode } from "react";
import type { FeedbackTicketStatus } from "@zcode/shared";
export declare function StatusIndicator({ status, withDot, children, className, }: {
    status: FeedbackTicketStatus;
    withDot?: boolean;
    children?: ReactNode;
    className?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function FeedbackErrorTip({ message }: {
    message: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=feedbackBadges.d.ts.map