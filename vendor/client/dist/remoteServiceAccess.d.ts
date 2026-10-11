import { IGenUiService } from "@zcode/services";
import { type IChannelClient } from "@zcode/rpc";
import { IFileService, IMediaPreviewService, IGitService, IGitCheckpointService, ISystemService, ITerminalService, ISettingService, IOnboardingRecordService, ICredentialService, IBroadcastService, IZCodeTaskService, IZCodeAgentService, IZCodeSessionService, ICuaPermissionService, IConversationShareService, IBotsService, IFileWatcherService, IOAuthService, IModelSelectionService, IProviderSettingsService, IProviderProvisioningTargetService, IUsageStatsService, ICodingPlanSubscriptionService, IClientConfigService, IClientScenesService, ICloudContentService, IMarketingTouchService, IOffPeakTaskService, IHighspeedCardService, ISkillsService, ISkillSyncService, IMcpSyncService, IPluginUiAppToolsService, IPluginUiSamplingService, IPluginUiBridgeService, IPluginSyncService, IPluginsService, IPluginManagementService, ISubagentsService, ICommandsService, IHooksService, IMemoryService, IOutputStyleService, ISettingsSyncService, IFeedbackService, IPromptAttachmentTransferService, IWindowControllerService, type IServiceAccessor } from "@zcode/services";
/**
 * RemoteServiceAccess — 通过 ChannelClient 自动创建类型安全的服务代理
 *
 * 新增服务只需在此添加一个 getter。
 */
export declare class RemoteServiceAccess implements IServiceAccessor {
    readonly fileService: IFileService;
    readonly mediaPreviewService: IMediaPreviewService;
    readonly gitService: IGitService;
    readonly gitCheckpointService: IGitCheckpointService;
    readonly systemService: ISystemService;
    readonly terminalService: ITerminalService;
    readonly settingService: ISettingService;
    readonly onboardingRecordService: IOnboardingRecordService;
    readonly credentialService: ICredentialService;
    readonly broadcastService: IBroadcastService;
    readonly zcodeTaskService: IZCodeTaskService;
    readonly windowControllerService: IWindowControllerService;
    readonly zcodeAgentService: IZCodeAgentService;
    readonly zcodeSessionService: IZCodeSessionService;
    readonly cuaPermissionService: ICuaPermissionService;
    readonly conversationShareService: IConversationShareService;
    readonly botsService: IBotsService;
    readonly fileWatcherService: IFileWatcherService;
    readonly oauthService: IOAuthService;
    readonly providerSettingsService: IProviderSettingsService;
    readonly modelSelectionService: IModelSelectionService;
    /** Host-only target proxy；不属于 IServiceAccessor，避免向 Renderer 暴露 Secret 写入接口。 */
    readonly providerProvisioningTargetService: IProviderProvisioningTargetService;
    readonly usageStatsService: IUsageStatsService;
    readonly codingPlanSubscriptionService: ICodingPlanSubscriptionService;
    readonly clientConfigService: IClientConfigService;
    readonly clientScenesService: IClientScenesService;
    readonly cloudContentService: ICloudContentService;
    readonly marketingTouchService: IMarketingTouchService;
    readonly offPeakTaskService: IOffPeakTaskService;
    readonly highspeedCardService: IHighspeedCardService;
    readonly skillsService: ISkillsService;
    readonly skillSyncService: ISkillSyncService;
    readonly mcpSyncService: IMcpSyncService;
    readonly genUiService: IGenUiService;
    readonly pluginUiBridgeService: IPluginUiBridgeService;
    readonly pluginUiSamplingService: IPluginUiSamplingService;
    readonly pluginUiAppToolsService: IPluginUiAppToolsService;
    readonly pluginSyncService: IPluginSyncService;
    readonly pluginsService: IPluginsService;
    readonly pluginManagementService: IPluginManagementService;
    readonly subagentsService: ISubagentsService;
    readonly commandsService: ICommandsService;
    readonly hooksService: IHooksService;
    readonly memoryService: IMemoryService;
    readonly outputStyleService: IOutputStyleService;
    readonly settingsSyncService: ISettingsSyncService;
    readonly feedbackService: IFeedbackService;
    readonly promptAttachmentTransferService: IPromptAttachmentTransferService;
    constructor(channelClient: IChannelClient);
}
//# sourceMappingURL=remoteServiceAccess.d.ts.map