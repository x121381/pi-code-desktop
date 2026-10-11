import { type ConversationSelectionLimitReason, type ConversationSelectionReference } from "@/lib/conversationSelectionReference.js";
export declare function useConversationSelectionReferences(options: {
    sessionId: string | null;
    workspaceKey: string;
}): {
    references: readonly ConversationSelectionReference[];
    limitReason: ConversationSelectionLimitReason | null;
    dismissLimitReason: () => void;
    removeReference: (id: string) => void;
    clearReferences: () => void;
};
//# sourceMappingURL=useConversationSelectionReferences.d.ts.map