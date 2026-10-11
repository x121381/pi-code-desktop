export declare function useBotPrivateDeliveryRetry(botId: string, deliveryId: string): {
    state: "done" | "idle" | "error" | "sending";
    retry: () => Promise<void>;
};
//# sourceMappingURL=useBotPrivateDeliveryRetry.d.ts.map