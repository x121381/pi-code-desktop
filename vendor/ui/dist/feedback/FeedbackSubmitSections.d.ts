import type { ReactNode } from "react";
import type { FeedbackSubmissionProgressState } from "@/feedback/feedbackSubmissionJob.js";
export declare function DescriptionSection({ value, max, onChange, formatMessage, }: {
    value: string;
    max: number;
    onChange: (value: string) => void;
    formatMessage: (id: string) => string;
}): import("react/jsx-runtime").JSX.Element;
export declare function ContactSection({ value, max, onChange, formatMessage, }: {
    value: string;
    max: number;
    onChange: (value: string) => void;
    formatMessage: (id: string) => string;
}): import("react/jsx-runtime").JSX.Element;
export declare function LogUploadToggle({ checked, onCheckedChange, label, hint, }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    hint: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function SubmitFooter({ submitting, submitProgress, submitDisabled, onCancel, onViewTickets, onSubmit, formatMessage, }: {
    submitting: boolean;
    submitProgress: FeedbackSubmissionProgressState | null;
    submitDisabled: boolean;
    onCancel: () => void;
    onViewTickets: () => void;
    onSubmit: () => void;
    formatMessage: (id: string) => string;
}): import("react/jsx-runtime").JSX.Element;
export declare function Section({ title, right, children, }: {
    title: string;
    right?: ReactNode;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=FeedbackSubmitSections.d.ts.map