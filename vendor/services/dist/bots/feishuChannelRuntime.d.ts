import { type BotProvider, type BotProviderCallbackResult, type BotsConfigFile } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import { startFeishuBotWebSocket } from "./providers/feishuProvider.js";
import { acquireFeishuWebSocketLock, type BotRuntimeLogger, type BotRuntimeStatusSink } from "./channelRuntime.js";
interface FeishuChannelRuntimeDeps {
    runBackgroundTasks?: boolean;
    onConnectionInvalidated?(botId: string): void;
    credentialService: ICredentialService;
    logger: BotRuntimeLogger;
    statusSink: BotRuntimeStatusSink;
    ensureBotStorageMigrated(): Promise<void>;
    readConfig(): Promise<BotsConfigFile>;
    summarizeCallbackPayload(payload: unknown): string;
    processProviderCallback(provider: BotProvider, payload: unknown): Promise<BotProviderCallbackResult>;
    acquireWebSocketLock?: typeof acquireFeishuWebSocketLock;
    startWebSocket?: typeof startFeishuBotWebSocket;
}
export declare function createFeishuChannelRuntime(deps: FeishuChannelRuntimeDeps): {
    dispose: () => Promise<void>;
    refresh: (config?: BotsConfigFile) => Promise<void>;
    scheduleRefresh: (config?: BotsConfigFile) => void;
    stopWebSocket: (botId: string) => Promise<void>;
};
export {};
//# sourceMappingURL=feishuChannelRuntime.d.ts.map