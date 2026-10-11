import type { ConversationShareAttempt } from "@/store/conversationShareSelectionStore.js";
export type { ConversationShareAttempt } from "@/store/conversationShareSelectionStore.js";
export interface ConversationShareAttemptIdFactory {
    now?: () => number;
    randomUUID?: () => string | undefined;
}
export declare function ensureConversationShareAttempt(current: ConversationShareAttempt | null, attemptKey: string, sessionId: string, factory?: ConversationShareAttemptIdFactory): ConversationShareAttempt;
//# sourceMappingURL=conversationShareAttempt.d.ts.map