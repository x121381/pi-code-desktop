import type { DraftSuggestedPromptItem } from "@/v4/draftSuggestedPromptItems.js";
type FeatureRecommendedPrompt = DraftSuggestedPromptItem & {
    mode: "office" | "coding";
};
export declare const featureSuggestedPrompts: FeatureRecommendedPrompt[];
export declare function getRecommendedPromptPool(isOfficeMode: boolean): DraftSuggestedPromptItem[];
export {};
//# sourceMappingURL=featureSuggestedPrompts.d.ts.map