import type { ICommandsService } from "@zcode/services";
import type { CommandAgentSource, CommandConfig, CommandCreateParams, CommandDeleteParams, CommandSetEnabledParams, CommandUpdateParams } from "@zcode/shared";
interface UseCommandsOptions {
    commandsService: ICommandsService;
    workspacePath?: string;
    workspaceIdentity?: string;
    enabled?: boolean;
}
export declare function useCommands(options: UseCommandsOptions): {
    commands: import("@zcode/shared").ZCodeCommand[];
    userCommands: import("@zcode/shared").UserCommand[];
    pluginCommands: import("@zcode/shared").ZCodeCommand[];
    capability: {
        userScopeAvailable: boolean;
    };
    loading: boolean;
    error: string | null;
    operatingCommandId: string | null;
    projectionMatchesTarget: boolean;
    refresh: () => Promise<void>;
    createCommand: (config: CommandConfig, agentSource?: CommandAgentSource, params?: Omit<CommandCreateParams, "config" | "agentSource">) => Promise<import("@zcode/shared").UserCommand | null>;
    updateCommand: (params: CommandUpdateParams) => Promise<import("@zcode/shared").UserCommand | null>;
    deleteCommand: (params: CommandDeleteParams) => Promise<boolean>;
    toggleCommand: (params: CommandSetEnabledParams) => Promise<void>;
};
export {};
//# sourceMappingURL=useCommands.d.ts.map