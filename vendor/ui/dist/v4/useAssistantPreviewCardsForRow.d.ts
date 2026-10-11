import type { AssistantTextRow, ConversationRowTarget, V4ConversationFileChangesResult } from "@zcode/shared/zcode-protocol-v4";
import { type AssistantPreviewCard } from "@/lib/assistantPreviewCards.js";
import type { ConversationFileChangesRequestOptions, ConversationFileChangesState } from "@/v4/conversationRowContext.js";
interface UseAssistantPreviewCardsForAssistantTextRowParams {
    row?: AssistantTextRow;
    assistantTextRows: readonly AssistantTextRow[];
    latestAssistantTextRow?: AssistantTextRow;
    workspacePath: string;
    workspaceHomePath?: string;
    compactForRemoteControl?: boolean;
    fileChangesTarget: ConversationRowTarget | null;
    fileChangesState?: ConversationFileChangesState;
    fetchFileChanges?: (target: ConversationRowTarget, options: ConversationFileChangesRequestOptions) => Promise<V4ConversationFileChangesResult>;
}
export declare function useAssistantPreviewCardsForAssistantTextRow({ row, assistantTextRows, latestAssistantTextRow, workspacePath, workspaceHomePath, compactForRemoteControl, fileChangesTarget, fileChangesState, fetchFileChanges, }: UseAssistantPreviewCardsForAssistantTextRowParams): AssistantPreviewCard[];
export {};
//# sourceMappingURL=useAssistantPreviewCardsForRow.d.ts.map