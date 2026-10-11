import type { IZCodeTaskService } from "../session/zcodeTaskService.js";
import type { IBroadcastService } from "../broadcast/broadcast.js";
import type { ICredentialService } from "../credential/credential.js";
import type { ISettingService } from "../setting/setting.js";
import type { IModelSelectionService } from "../model-provider/providerFacadeServices.js";
import type { ZCodeAgentAppRuntimePreferences } from "../zcode-agent/zcodeAgent.js";
import type { IBotsService } from "./bots.js";
import { BotsRepo } from "./repo.js";
interface BotsServiceDeps {
    credentialService: ICredentialService;
    zcodeTaskService: IZCodeTaskService;
    broadcastService?: IBroadcastService;
    settingService?: ISettingService;
    modelSelectionService: Pick<IModelSelectionService, "getView">;
    remoteWorkspaceService?: BotRemoteWorkspaceService;
    repo?: BotsRepo;
    runStartupBackgroundTasks?: boolean;
}
interface BotRemoteWorkspaceTarget {
    workspacePath: string;
    workspaceIdentity: string;
}
interface BotRemoteWorkspaceReconnectResult {
    ok: boolean;
    message?: string;
}
interface BotRemoteWorkspaceService {
    isConnected(target: BotRemoteWorkspaceTarget): Promise<boolean>;
    ensureConnected(target: BotRemoteWorkspaceTarget): Promise<BotRemoteWorkspaceReconnectResult>;
    getZCodeTaskService?(target: BotRemoteWorkspaceTarget): Promise<IZCodeTaskService | null>;
    getModelSelectionService?(target: BotRemoteWorkspaceTarget): Promise<Pick<IModelSelectionService, "getView"> | null>;
    syncAppRuntimePreferences?(preferences: ZCodeAgentAppRuntimePreferences): Promise<void>;
}
export declare function createBotsService(deps: BotsServiceDeps): IBotsService & {
    disposeAll(): void;
    disposeAllAndWait(): Promise<void>;
};
export {};
//# sourceMappingURL=botsService.d.ts.map