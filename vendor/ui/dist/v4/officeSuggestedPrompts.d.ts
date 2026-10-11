import type { DraftSuggestedPromptItem } from "@/v4/draftSuggestedPromptItems.js";
type RecommendedPrompt = DraftSuggestedPromptItem & {
    category: "development" | "office" | "finance" | "utility";
};
export declare const officeSuggestedPrompts: RecommendedPrompt[];
export declare function getRecommendedPromptPool(isOfficeMode: boolean, occupation?: string | null): DraftSuggestedPromptItem[];
export declare const defaultSuggestedPrompts: DraftSuggestedPromptItem[];
export {};
//# sourceMappingURL=officeSuggestedPrompts.d.ts.map