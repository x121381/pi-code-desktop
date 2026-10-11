export type PromptInputTrigger = "/" | "@" | "$" | "#";
export interface ActivePromptInputTrigger {
    trigger: PromptInputTrigger;
    query: string;
}
export declare function getPromptInputTriggerSignature(activeTrigger: ActivePromptInputTrigger | null): string | null;
export interface PromptInputSuggestionItem {
    id: string;
    trigger: PromptInputTrigger;
    value: string;
    label: string;
    description: string;
    keywords?: string[];
    data?: {
        path?: string;
        scope?: "built-in" | "workspace" | "user" | "plugin";
        source?: "built-in" | "user" | "plugin";
        model?: string;
    };
}
interface PromptInputReplacement {
    cursorOffset: number;
    text: string;
}
type PromptInputReplacementCandidates = string | readonly string[];
export declare function extractActivePromptInputTrigger(textBeforeCursor: string): ActivePromptInputTrigger | null;
export declare function getActivePromptInputTokenTailLength(activeTrigger: ActivePromptInputTrigger, textAfterCursor: string, replacementCandidates: PromptInputReplacementCandidates): number;
export declare function filterPromptInputSuggestions(suggestions: PromptInputSuggestionItem[], query: string | null): PromptInputSuggestionItem[];
export declare function getBestPromptInputSuggestionIndex(suggestions: PromptInputSuggestionItem[], query: string | null): number;
export declare function replaceActivePromptInputToken(textBeforeCursor: string, textAfterCursor: string, suggestion: Pick<PromptInputSuggestionItem, "trigger" | "value">): PromptInputReplacement | null;
export {};
//# sourceMappingURL=promptInputTriggers.d.ts.map