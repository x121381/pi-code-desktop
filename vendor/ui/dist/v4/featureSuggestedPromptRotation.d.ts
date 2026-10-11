import type { DraftSuggestedPromptItem } from "@/v4/draftSuggestedPromptItems.js";
type Mode = "office" | "coding";
export declare function subscribeRecommendedPrompts(listener: () => void): () => boolean;
export declare function getRecommendedPromptsRevision(): number;
export declare function registerRecommendedPromptPane(id: string, mode: Mode): void;
export declare function unregisterRecommendedPromptPane(id: string): void;
export declare function advanceRecommendedPromptPane(id: string): void;
export declare function getRecommendedPromptsForPane(id: string, mode: Mode): DraftSuggestedPromptItem[];
export {};
//# sourceMappingURL=featureSuggestedPromptRotation.d.ts.map