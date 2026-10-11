import type { BotProviderCallbackResult, BotsConfigFile } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import { getWeixinUpdates } from "./providers/weixinProvider.js";
import { acquireWeixinPollingLock, type BotRuntimeLogger, type BotRuntimeStatusSink } from "./channelRuntime.js";
interface WeixinChannelRuntimeDeps {
    runBackgroundTasks?: boolean;
    credentialService: ICredentialService;
    logger: BotRuntimeLogger;
    statusSink: BotRuntimeStatusSink;
    ensureBotStorageMigrated(): Promise<void>;
    readConfig(): Promise<BotsConfigFile>;
    readWeixinGetUpdatesBuf(botId: string): Promise<string | undefined>;
    writeWeixinGetUpdatesBuf(botId: string, buf: string): Promise<void>;
    processProviderCallback(provider: "weixin", payload: unknown): Promise<BotProviderCallbackResult>;
    getUpdates?: typeof getWeixinUpdates;
    acquirePollingLock?: typeof acquireWeixinPollingLock;
}
export declare function createWeixinChannelRuntime(deps: WeixinChannelRuntimeDeps): {
    dispose: () => Promise<void>;
    refresh: (config?: BotsConfigFile) => Promise<void>;
    scheduleRefresh: (config?: BotsConfigFile) => void;
    stopPolling: (botId: string) => Promise<void>;
};
export {};
//# sourceMappingURL=weixinChannelRuntime.d.ts.map