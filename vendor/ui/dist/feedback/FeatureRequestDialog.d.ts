import type { IFeedbackService } from "@zcode/services";
export declare const FeatureRequestDialog: import("react").MemoExoticComponent<({ feedbackService, }: {
    feedbackService: IFeedbackService;
}) => import("react/jsx-runtime").JSX.Element>;
export declare function buildFeatureRequestDescription({ description, solution, source, formatMessage, }: {
    description: string;
    solution: string;
    source: string;
    formatMessage: (id: string, values?: Record<string, string>) => string;
}): string;
//# sourceMappingURL=FeatureRequestDialog.d.ts.map