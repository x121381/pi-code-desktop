import type { BotProviderAdapter } from "./types.js";
interface TelegramProviderDeps {
    loadCredential(key: string): Promise<string | null>;
}
export declare function createTelegramBotProvider(deps: TelegramProviderDeps): BotProviderAdapter;
export {};
//# sourceMappingURL=telegramProvider.d.ts.map