import type { ZCodeConfigOption } from "@zcode/shared";
export interface FeedbackAgentModelContext {
    model?: string;
    display?: string;
    optionCount?: number;
    optionsPreview?: string[];
}
export declare function readCurrentAgentModelContext(configOptions?: readonly ZCodeConfigOption[] | null): FeedbackAgentModelContext;
//# sourceMappingURL=feedbackSubmitModelContext.d.ts.map