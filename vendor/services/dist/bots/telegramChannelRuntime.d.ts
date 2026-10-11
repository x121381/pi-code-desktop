import type { BotConfig, BotProviderCallbackResult, BotsConfigFile } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import type { BotProviderAdapter } from "./providers/types.js";
import { acquireTelegramPollingLock, type BotRuntimeLogger, type BotRuntimeStatusSink } from "./channelRuntime.js";
interface TelegramChannelRuntimeDeps {
    runBackgroundTasks?: boolean;
    credentialService: ICredentialService;
    telegramProvider: BotProviderAdapter | null;
    logger: BotRuntimeLogger;
    statusSink: BotRuntimeStatusSink;
    ensureBotStorageMigrated(): Promise<void>;
    readConfig(): Promise<BotsConfigFile>;
    readTelegramOffset(botId: string): Promise<number | undefined>;
    writeTelegramOffset(botId: string, offset: number): Promise<void>;
    processProviderCallback(provider: "telegram", payload: unknown): Promise<BotProviderCallbackResult>;
    acquirePollingLock?: typeof acquireTelegramPollingLock;
}
export declare function createTelegramChannelRuntime(deps: TelegramChannelRuntimeDeps): {
    dispose: () => Promise<void>;
    refresh: (config?: BotsConfigFile) => Promise<void>;
    scheduleRefresh: (config?: BotsConfigFile) => void;
    stopPolling: (botId: string) => Promise<void>;
    syncCommands: (bot: BotConfig) => Promise<void>;
};
export {};
//# sourceMappingURL=telegramChannelRuntime.d.ts.map