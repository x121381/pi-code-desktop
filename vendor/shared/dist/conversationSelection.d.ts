import { z } from "zod";
export declare const CONVERSATION_SELECTION_MAX_TEXT_LENGTH = 8000;
export declare const CONVERSATION_SELECTION_MAX_COUNT = 8;
export declare const CONVERSATION_SELECTION_MAX_TOTAL_LENGTH = 16000;
export declare const conversationQuoteSchema: z.ZodObject<{
    text: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    senderName: z.ZodOptional<z.ZodString>;
    senderId: z.ZodOptional<z.ZodString>;
    messageId: z.ZodOptional<z.ZodString>;
    sentAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const conversationQuotesSchema: z.ZodArray<z.ZodObject<{
    text: z.ZodString;
    path: z.ZodOptional<z.ZodString>;
    senderName: z.ZodOptional<z.ZodString>;
    senderId: z.ZodOptional<z.ZodString>;
    messageId: z.ZodOptional<z.ZodString>;
    sentAt: z.ZodOptional<z.ZodString>;
}, z.core.$strip>>;
export type ConversationSelectionText = z.infer<typeof conversationQuoteSchema>;
export declare function buildPromptWithConversationSelections(visibleContent: string, references: readonly ConversationSelectionText[]): string;
//# sourceMappingURL=conversationSelection.d.ts.map