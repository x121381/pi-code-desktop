import { IGenUiService } from "@zcode/services";
import { ProxyChannel } from "@zcode/rpc";
import { IFileService, IMediaPreviewService, IGitService, IGitCheckpointService, ISystemService, ITerminalService, ISettingService, IOnboardingRecordService, ICredentialService, IBroadcastService, IZCodeTaskService, IZCodeAgentService, IZCodeSessionService, ICuaPermissionService, IConversationShareService, IBotsService, IFileWatcherService, IOAuthService, IModelSelectionService, IProviderSettingsService, IProviderProvisioningTargetService, IUsageStatsService, ICodingPlanSubscriptionService, IClientConfigService, IClientScenesService, ICloudContentService, IMarketingTouchService, IOffPeakTaskService, IHighspeedCardService, ISkillsService, ISkillSyncService, IMcpSyncService, IPluginUiAppToolsService, IPluginUiSamplingService, IPluginUiBridgeService, IPluginSyncService, IPluginsService, IPluginManagementService, ISubagentsService, ICommandsService, IHooksService, IMemoryService, IOutputStyleService, ISettingsSyncService, IFeedbackService, IPromptAttachmentTransferService, IWindowControllerService, } from "@zcode/services";
/**
 * RemoteServiceAccess — 通过 ChannelClient 自动创建类型安全的服务代理
 *
 * 新增服务只需在此添加一个 getter。
 */
export class RemoteServiceAccess {
    fileService;
    mediaPreviewService;
    gitService;
    gitCheckpointService;
    systemService;
    terminalService;
    settingService;
    onboardingRecordService;
    credentialService;
    broadcastService;
    zcodeTaskService;
    windowControllerService;
    zcodeAgentService;
    zcodeSessionService;
    // cuaPermissionService 在 IServiceAccessor 上是可选（远端/bots host 不提供），但桌面 renderer
    // 经 RPC 一定能拿到（main host 始终注册此 descriptor；非 macOS / 未启用时方法返回 available:false）。
    cuaPermissionService;
    conversationShareService;
    botsService;
    fileWatcherService;
    oauthService;
    providerSettingsService;
    modelSelectionService;
    /** Host-only target proxy；不属于 IServiceAccessor，避免向 Renderer 暴露 Secret 写入接口。 */
    providerProvisioningTargetService;
    usageStatsService;
    codingPlanSubscriptionService;
    clientConfigService;
    clientScenesService;
    cloudContentService;
    marketingTouchService;
    offPeakTaskService;
    highspeedCardService;
    skillsService;
    skillSyncService;
    mcpSyncService;
    genUiService;
    pluginUiBridgeService;
    pluginUiSamplingService;
    pluginUiAppToolsService;
    pluginSyncService;
    pluginsService;
    pluginManagementService;
    subagentsService;
    commandsService;
    hooksService;
    memoryService;
    outputStyleService;
    settingsSyncService;
    feedbackService;
    promptAttachmentTransferService;
    constructor(channelClient) {
        this.fileService = ProxyChannel.toService(channelClient.getChannel(IFileService.channelName));
        // Host 已注册 media-preview channel，但遗漏 renderer proxy 时，PreviewPane
        // 会静默回退到 8 MiB 的 file.readMediaPreview，导致大 MP4 无法打开。
        this.mediaPreviewService = ProxyChannel.toService(channelClient.getChannel(IMediaPreviewService.channelName));
        this.gitService = ProxyChannel.toService(channelClient.getChannel(IGitService.channelName));
        this.gitCheckpointService = ProxyChannel.toService(channelClient.getChannel(IGitCheckpointService.channelName));
        this.systemService = ProxyChannel.toService(channelClient.getChannel(ISystemService.channelName));
        this.terminalService = ProxyChannel.toService(channelClient.getChannel(ITerminalService.channelName));
        this.settingService = ProxyChannel.toService(channelClient.getChannel(ISettingService.channelName));
        this.onboardingRecordService = ProxyChannel.toService(channelClient.getChannel(IOnboardingRecordService.channelName));
        this.credentialService = ProxyChannel.toService(channelClient.getChannel(ICredentialService.channelName));
        this.broadcastService = ProxyChannel.toService(channelClient.getChannel(IBroadcastService.channelName));
        this.zcodeTaskService = ProxyChannel.toService(channelClient.getChannel(IZCodeTaskService.channelName));
        this.windowControllerService = ProxyChannel.toService(channelClient.getChannel(IWindowControllerService.channelName));
        this.zcodeAgentService = ProxyChannel.toService(channelClient.getChannel(IZCodeAgentService.channelName));
        this.zcodeSessionService = ProxyChannel.toService(channelClient.getChannel(IZCodeSessionService.channelName));
        this.cuaPermissionService = ProxyChannel.toService(channelClient.getChannel(ICuaPermissionService.channelName));
        this.conversationShareService = ProxyChannel.toService(channelClient.getChannel(IConversationShareService.channelName));
        this.botsService = ProxyChannel.toService(channelClient.getChannel(IBotsService.channelName));
        this.fileWatcherService = ProxyChannel.toService(channelClient.getChannel(IFileWatcherService.channelName));
        this.oauthService = ProxyChannel.toService(channelClient.getChannel(IOAuthService.channelName));
        this.providerSettingsService = ProxyChannel.toService(channelClient.getChannel(IProviderSettingsService.channelName));
        this.modelSelectionService = ProxyChannel.toService(channelClient.getChannel(IModelSelectionService.channelName));
        Object.defineProperty(this, "providerProvisioningTargetService", {
            value: ProxyChannel.toService(channelClient.getChannel(IProviderProvisioningTargetService.channelName)),
            enumerable: false,
        });
        this.usageStatsService = ProxyChannel.toService(channelClient.getChannel(IUsageStatsService.channelName));
        this.codingPlanSubscriptionService = ProxyChannel.toService(channelClient.getChannel(ICodingPlanSubscriptionService.channelName));
        this.clientConfigService = ProxyChannel.toService(channelClient.getChannel(IClientConfigService.channelName));
        this.clientScenesService = ProxyChannel.toService(channelClient.getChannel(IClientScenesService.channelName));
        this.cloudContentService = ProxyChannel.toService(channelClient.getChannel(ICloudContentService.channelName));
        this.marketingTouchService = ProxyChannel.toService(channelClient.getChannel(IMarketingTouchService.channelName));
        this.offPeakTaskService = ProxyChannel.toService(channelClient.getChannel(IOffPeakTaskService.channelName));
        this.highspeedCardService = ProxyChannel.toService(channelClient.getChannel(IHighspeedCardService.channelName));
        this.skillsService = ProxyChannel.toService(channelClient.getChannel(ISkillsService.channelName));
        this.skillSyncService = ProxyChannel.toService(channelClient.getChannel(ISkillSyncService.channelName));
        this.mcpSyncService = ProxyChannel.toService(channelClient.getChannel(IMcpSyncService.channelName));
        this.genUiService = ProxyChannel.toService(channelClient.getChannel(IGenUiService.channelName));
        this.pluginUiBridgeService = ProxyChannel.toService(channelClient.getChannel(IPluginUiBridgeService.channelName));
        this.pluginUiSamplingService = ProxyChannel.toService(channelClient.getChannel(IPluginUiSamplingService.channelName));
        this.pluginUiAppToolsService = ProxyChannel.toService(channelClient.getChannel(IPluginUiAppToolsService.channelName));
        this.pluginSyncService = ProxyChannel.toService(channelClient.getChannel(IPluginSyncService.channelName));
        this.pluginsService = ProxyChannel.toService(channelClient.getChannel(IPluginsService.channelName));
        this.pluginManagementService = ProxyChannel.toService(channelClient.getChannel(IPluginManagementService.channelName));
        this.subagentsService = ProxyChannel.toService(channelClient.getChannel(ISubagentsService.channelName));
        this.commandsService = ProxyChannel.toService(channelClient.getChannel(ICommandsService.channelName));
        this.hooksService = ProxyChannel.toService(channelClient.getChannel(IHooksService.channelName));
        this.memoryService = ProxyChannel.toService(channelClient.getChannel(IMemoryService.channelName));
        this.outputStyleService = ProxyChannel.toService(channelClient.getChannel(IOutputStyleService.channelName));
        this.settingsSyncService = ProxyChannel.toService(channelClient.getChannel(ISettingsSyncService.channelName));
        this.feedbackService = ProxyChannel.toService(channelClient.getChannel(IFeedbackService.channelName));
        this.promptAttachmentTransferService = ProxyChannel.toService(channelClient.getChannel(IPromptAttachmentTransferService.channelName));
    }
}
//# sourceMappingURL=remoteServiceAccess.js.map