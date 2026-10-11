import { type IZCodeTaskService as IZCodeTaskServiceShape } from "../session/zcodeTaskService.js";
import type { ICredentialService } from "../credential/credential.js";
import type { ISettingService } from "../setting/setting.js";
import { type ZCodeAgentAppRuntimePreferences } from "../zcode-agent/zcodeAgent.js";
import { type RemoteBotWorkspaceRuntimeServices } from "#src/bots/botRemoteRuntimeServices.js";
interface ParentPortLike {
    postMessage(message: unknown, transfer?: unknown[]): void;
    on(event: "message", listener: (event: ParentPortMessageEvent) => void): void;
    off?(event: "message", listener: (event: ParentPortMessageEvent) => void): void;
}
interface ParentPortMessageEvent {
    data: unknown;
    ports?: unknown[];
}
export declare function createBotRemoteWorkspaceService(params: {
    parentPort?: ParentPortLike | null;
    settingService: ISettingService;
    credentialService: ICredentialService;
    createRuntimeServicesFromPort?: (port: unknown) => RemoteBotWorkspaceRuntimeServices;
}): {
    isConnected(target: {
        workspacePath: string;
        workspaceIdentity: string;
    }): Promise<boolean>;
    ensureConnected(target: {
        workspacePath: string;
        workspaceIdentity: string;
    }): Promise<{
        ok: boolean;
        message?: string;
    }>;
    getZCodeTaskService(target: {
        workspacePath: string;
        workspaceIdentity: string;
    }): Promise<IZCodeTaskServiceShape | null>;
    getModelSelectionService(target: {
        workspacePath: string;
        workspaceIdentity: string;
    }): Promise<import("../index.js").IModelSelectionService | null>;
    syncAppRuntimePreferences(preferences: ZCodeAgentAppRuntimePreferences): Promise<void>;
    dispose(): void;
} | undefined;
export {};
//# sourceMappingURL=botRemoteWorkspaceBridge.d.ts.map