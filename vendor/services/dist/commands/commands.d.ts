import type { CommandsListResult, CommandCreateParams, CommandUpdateParams, CommandDeleteParams, CommandSetEnabledParams, CommandAgentSource, UserCommand } from "@zcode/shared";
export interface ICommandsService {
    list(params: {
        agentSource?: CommandAgentSource;
        workspacePath?: string;
        workspaceIdentity?: string;
    }): Promise<CommandsListResult>;
    writeCommandFile(params: CommandCreateParams): Promise<{
        command: UserCommand;
    }>;
    updateCommandFile(params: CommandUpdateParams): Promise<{
        command: UserCommand;
    }>;
    deleteCommandFile(params: CommandDeleteParams): Promise<void>;
    setCommandEnabled(params: CommandSetEnabledParams): Promise<void>;
    getPrimaryUserCommandsDirectory(params?: {
        agentSource?: CommandAgentSource;
    }): Promise<{
        path: string;
    }>;
}
export declare const ICommandsService: import("../descriptors.js").ServiceDescriptor<ICommandsService>;
//# sourceMappingURL=commands.d.ts.map