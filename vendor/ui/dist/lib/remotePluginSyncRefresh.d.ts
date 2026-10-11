import type { ICommandsService, IMcpSyncService, ISkillsService, IZCodeAgentService, IZCodeSessionService } from "@zcode/services";
export declare function refreshWorkspacePluginCapabilitiesAfterRemoteSync(params: {
    commandsService: ICommandsService;
    mcpSyncService: IMcpSyncService;
    reason: string;
    skillsService: ISkillsService;
    workspaceIdentity?: string | null;
    workspacePath?: string | null;
    zcodeAgentService: IZCodeAgentService;
    zcodeSessionService: Pick<IZCodeSessionService, "closeSession">;
}): Promise<void>;
//# sourceMappingURL=remotePluginSyncRefresh.d.ts.map