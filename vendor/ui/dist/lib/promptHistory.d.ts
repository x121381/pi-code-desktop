export declare const MAX_PROMPT_HISTORY = 30;
type PromptHistoryDirection = "up" | "down";
interface PromptHistoryNavigationResult {
    nextIndex: number | null;
    nextValue: string;
    shouldHandle: boolean;
}
export declare function appendPromptHistoryEntry(entries: readonly string[], entry: string, limit?: number): string[];
export declare function navigatePromptHistory(entries: readonly string[], currentIndex: number | null, direction: PromptHistoryDirection): PromptHistoryNavigationResult;
export {};
//# sourceMappingURL=promptHistory.d.ts.map