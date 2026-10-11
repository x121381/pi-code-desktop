import type { AssistantTextRow } from "@zcode/shared/zcode-protocol-v4";
import { type AssistantPreviewCard } from "@/lib/assistantPreviewCards.js";
export interface BuildAssistantPreviewCardsForAssistantTextRowParams {
    row: AssistantTextRow;
    assistantTextRows: readonly AssistantTextRow[];
    latestAssistantTextRow?: AssistantTextRow;
    workspacePath: string;
    changedFilePaths?: readonly string[];
}
export declare function buildAssistantPreviewCardsForAssistantTextRow({ row, assistantTextRows, latestAssistantTextRow, workspacePath, changedFilePaths, }: BuildAssistantPreviewCardsForAssistantTextRowParams): AssistantPreviewCard[];
//# sourceMappingURL=assistantPreviewCards.d.ts.map