import type { CommandCreateParams, CommandDeleteParams, CommandSetEnabledParams, CommandUpdateParams, UserCommand, ZCodeCommand } from "@zcode/shared";
import type { ICommandsService } from "@zcode/services";
interface CommandsStoreState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    loadedWorkspacePath: string | null;
    loadedWorkspaceIdentity: string | null;
    commands: ZCodeCommand[];
    userCommands: UserCommand[];
    pluginCommands: ZCodeCommand[];
    capability: {
        userScopeAvailable: boolean;
    };
    loading: boolean;
    error: string | null;
    operatingCommandId: string | null;
    initialize: (workspacePath: string | undefined, commandsService: ICommandsService, workspaceIdentity?: string) => Promise<void>;
    refresh: (commandsService: ICommandsService) => Promise<void>;
    createCommand: (params: CommandCreateParams, commandsService: ICommandsService) => Promise<UserCommand | null>;
    updateCommand: (params: CommandUpdateParams, commandsService: ICommandsService) => Promise<UserCommand | null>;
    deleteCommand: (params: CommandDeleteParams, commandsService: ICommandsService) => Promise<boolean>;
    toggleCommand: (params: CommandSetEnabledParams, commandsService: ICommandsService) => Promise<void>;
}
export declare const useCommandsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<CommandsStoreState>>;
export {};
//# sourceMappingURL=commandsStore.d.ts.map