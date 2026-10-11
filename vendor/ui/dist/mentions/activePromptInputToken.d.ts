import { type ActivePromptInputTrigger } from "@/lib/promptInputTriggers.js";
export interface PromptInputTextSelectionSnapshot {
    cursorOffset: number;
    nodeKey: string;
    text: string;
    textBeforeCursor: string;
}
export interface ActivePromptInputTokenSnapshot extends ActivePromptInputTrigger {
    nodeKey: string;
    tokenEnd: number;
    tokenStart: number;
    tokenText: string;
}
export declare function createActivePromptInputTokenSnapshot(selection: PromptInputTextSelectionSnapshot): ActivePromptInputTokenSnapshot | null;
export declare function reconcileActivePromptInputTokenSnapshot(previous: ActivePromptInputTokenSnapshot | null, selection: PromptInputTextSelectionSnapshot, selectionOnly: boolean): ActivePromptInputTokenSnapshot | null;
export declare function getActivePromptInputTokenReplacementRange(snapshot: ActivePromptInputTokenSnapshot | null, selection: PromptInputTextSelectionSnapshot): {
    end: number;
    start: number;
} | null;
//# sourceMappingURL=activePromptInputToken.d.ts.map