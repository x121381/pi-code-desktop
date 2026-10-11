export type ChatEmptyGreetingMessageId = "chat.empty.greeting.morningEarly" | "chat.empty.greeting.morning" | "chat.empty.greeting.noon" | "chat.empty.greeting.afternoon" | "chat.empty.greeting.evening" | "chat.empty.greeting.lateNight";
export declare function getChatEmptyGreetingMessageId(date?: Date): ChatEmptyGreetingMessageId;
export declare function getNextChatEmptyGreetingDelayMs(date?: Date): number;
export declare function resolveGreetingFontSizePx({ availableWidthPx, naturalTextWidthPx, compactForRemoteControl, }: {
    availableWidthPx: number;
    naturalTextWidthPx: number;
    compactForRemoteControl?: boolean;
}): number;
export declare function ConversationDraftEmptyState({ className, compactForRemoteControl, }: {
    className?: string;
    compactForRemoteControl?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationDraftEmptyState.d.ts.map