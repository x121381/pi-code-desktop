import type { FeedbackSubmissionAttachmentDraft } from "@/feedback/feedbackSubmissionJob.js";
export interface ScreenshotAttachmentDraft extends FeedbackSubmissionAttachmentDraft {
    id: string;
}
export declare function FeedbackScreenshotPicker({ screenshots, screenshotHint, screenshotPrivacyHint, addScreenshotLabel, removeScreenshotLabel, onChange, onAddFiles, }: {
    screenshots: ScreenshotAttachmentDraft[];
    screenshotHint: string;
    screenshotPrivacyHint: string;
    addScreenshotLabel: string;
    removeScreenshotLabel: string;
    onChange: (screenshots: ScreenshotAttachmentDraft[]) => void;
    onAddFiles: (files: File[]) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function readScreenshotDraft(file: File): Promise<ScreenshotAttachmentDraft>;
//# sourceMappingURL=FeedbackScreenshotPicker.d.ts.map