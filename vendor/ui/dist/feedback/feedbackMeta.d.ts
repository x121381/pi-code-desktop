import type { FeedbackTicketModule, FeedbackTicketSeverity, FeedbackTicketStatus, FeedbackTicketType } from "@zcode/shared";
import type { ComponentType, SVGProps } from "react";
interface TypeMeta {
    value: FeedbackTicketType;
    label: string;
    description: string;
    Icon: ComponentType<SVGProps<SVGSVGElement>>;
    /** 选中时图标颜色 */
    iconText: string;
}
type MessageFormatter = (descriptor: {
    id: string;
}, values?: Record<string, string>) => string;
export declare const FEEDBACK_TYPE_META: TypeMeta[];
export declare const SEVERITY_META: {
    value: FeedbackTicketSeverity;
    label: string;
    hint: string;
    dot: string;
}[];
interface StatusMeta {
    className: string;
    dot: string;
}
export declare const STATUS_META: Record<FeedbackTicketStatus, StatusMeta>;
export declare const SEVERITY_BADGE: Record<FeedbackTicketSeverity, {
    label: string;
    className: string;
}>;
export declare const FEEDBACK_MODULE_MESSAGE_IDS: Record<FeedbackTicketModule, string>;
export declare const FEEDBACK_STATUS_MESSAGE_IDS: Record<FeedbackTicketStatus, string>;
export declare function formatFeedbackModuleLabel(module: FeedbackTicketModule, formatMessage: MessageFormatter): string;
export declare function formatFeedbackStatusLabel(status: FeedbackTicketStatus, formatMessage: MessageFormatter): string;
export {};
//# sourceMappingURL=feedbackMeta.d.ts.map