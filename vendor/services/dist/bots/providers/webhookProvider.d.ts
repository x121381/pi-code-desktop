import type { BotProviderAdapter } from "./types.js";
interface WebhookProviderDeps {
    loadCredential(key: string): Promise<string | null>;
}
export declare function createWebhookBotProvider(deps: WebhookProviderDeps): BotProviderAdapter;
export {};
//# sourceMappingURL=webhookProvider.d.ts.map