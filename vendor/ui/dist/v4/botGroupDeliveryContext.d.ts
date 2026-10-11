export declare const DeliveryContext: import("react").Context<({
    context: import("@zcode/shared").BotState | null;
    provider: import("@zcode/shared").FeishuBotProvider | undefined;
    busyId: string | null;
    retry: (deliveryId: string) => Promise<void>;
    reconcile: (deliveryId: string, received: boolean) => Promise<void>;
    retryPreparation: (messageId: string) => Promise<void>;
} & {
    taskId: string | null;
}) | null>;
export declare function useBotTopicInterruption(sourceCommandIds: readonly string[]): boolean;
//# sourceMappingURL=botGroupDeliveryContext.d.ts.map