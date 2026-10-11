import { type FeishuBotProvider } from "@zcode/shared";
export declare function useBotGroupTask(taskId: string | null, workspacePath: string, workspaceIdentity?: string): {
    context: import("@zcode/shared").BotState | null;
    provider: FeishuBotProvider | undefined;
    busyId: string | null;
    retry: (deliveryId: string) => Promise<void>;
    reconcile: (deliveryId: string, received: boolean) => Promise<void>;
    retryPreparation: (messageId: string) => Promise<void>;
};
//# sourceMappingURL=useBotGroupTask.d.ts.map