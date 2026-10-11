// Descriptors & collection (browser-safe)
export { createServiceDescriptor } from "./descriptors.js";
export { ServiceCollection } from "./collection.js";
export { IModelSelectionService, IProviderSettingsService, } from "./model-provider/providerFacadeServices.js";
export { createAccountRequestAuthService, } from "./model-provider/accountRequestAuthService.js";
export { IProviderProvisioningTargetService } from "./model-provider/providerProvisioning.js";
export { collectServiceMemoryDiagnostics, memoryDiagnosticsRegistry, registerMemoryDiagnosticsProvider, } from "./memoryDiagnostics.js";
export { ConversationShareServiceError, createUnsupportedConversationShareService, IConversationShareService, } from "./conversation-share/conversationShare.js";
// Conversation share 的具体实现依赖 Node 文件系统，只能从 @zcode/services/node 引入；
// 根入口必须保持 browser-safe，避免 renderer 解析到 node:* 模块。
export { createConversationTelemetryService, } from "./conversation-telemetry/conversationTelemetry.js";
// File service — IFileService is both a type (interface) and value (descriptor)
export { IFileService } from "./file/file.js";
export { IMediaPreviewService } from "./media-preview/mediaPreview.js";
export { ICloudContentService } from "#src/cloud-content/cloudContent.js";
export { IMarketingTouchService } from "#src/marketing-touch/marketingTouch.js";
// Git service — IGitService is both a type (interface) and value (descriptor)
export { IGitService } from "./git/git.js";
export { IGitCheckpointService } from "./git/gitCheckpoint.js";
// System service — ISystemService is both a type (interface) and value (descriptor)
export { ISystemService } from "./system/system.js";
// Terminal service — ITerminalService is both a type (interface) and value (descriptor)
export { ITerminalService } from "./terminal/terminal.js";
// Setting service — ISettingService is both a type (interface) and value (descriptor)
export { ISettingService } from "./setting/setting.js";
// Credential service — ICredentialService is both a type (interface) and value (descriptor)
export { ICredentialService } from "./credential/credential.js";
// Broadcast service — IBroadcastService is both a type (interface) and value (descriptor)
export { IBroadcastService } from "./broadcast/broadcast.js";
// Onboarding 完成记录服务（本地持久化，后续上传服务器）
export { IOnboardingRecordService } from "./onboarding/onboardingRecord.js";
// ZCode task wrapper service — task 列表/置顶/归档等 app 侧包装状态入口。
export { IZCodeTaskService } from "./session/zcodeTaskService.js";
export { IWindowControllerService } from "./window-controller/windowController.js";
// ZCode agent service — IZCodeAgentService is both a type (interface) and value (descriptor)
export { IZCodeAgentService, ZCODE_AGENT_RUNTIME_UNAVAILABLE_CODE, } from "./zcode-agent/zcodeAgent.js";
export { isZCodeAgentMcpStatusModeUnsupportedError, ZCODE_AGENT_MCP_STATUS_MODE_UNSUPPORTED_ERROR_CODE, ZCodeAgentMcpStatusModeUnsupportedError, } from "./zcode-agent/zcodeAgentErrors.js";
export { createZCodeAgentConnectionScope, readTrustedZCodeAgentV4Connection, } from "./zcode-agent/zcodeAgentConnectionScope.js";
// ZCode session service — app-facing session facade without ZCode Agent naming.
export { IZCodeSessionService } from "./zcode-session/zcodeSession.js";
// Bots service — IBotsService is both a type (interface) and value (descriptor).
export { IBotsService } from "./bots/bots.js";
// Hooks service — IHooksService is both a type (interface) and value (descriptor).
export { IHooksService } from "./hooks/hooks.js";
// Memory service — IMemoryService is both a type (interface) and value (descriptor).
export { IMemoryService, PROJECT_MEMORY_FILE_CHANGED_ERROR_CODE, PROJECT_MEMORY_PREVIEW_LIMIT_EXCEEDED_ERROR_CODE, } from "./memory/memory.js";
// OutputStyle service — IOutputStyleService is both a type (interface) and value (descriptor).
export { IOutputStyleService } from "./output-style/outputStyle.js";
// FileWatcher service — IFileWatcherService is both a type (interface) and value (descriptor)
export { IFileWatcherService } from "./fileWatcher/fileWatcher.js";
// OAuth service — IOAuthService is both a type (interface) and value (descriptor)
export { IOAuthService } from "./oauth/oauth.js";
// UsageStats service — IUsageStatsService is both a type (interface) and value (descriptor)
export { IUsageStatsService } from "./usage-stats/usageStats.js";
// CodingPlanSubscription service — ICodingPlanSubscriptionService is both a type (interface) and value (descriptor)
export { ICodingPlanSubscriptionService, } from "./coding-plan-subscription/codingPlanSubscription.js";
export { IClientScenesService, } from "./client-scenes/clientScenes.js";
export { isValidCronExpr } from "./session/automationCronValidation.js";
// 闲时任务管理服务（与 automation 服务面独立）；接口/描述符 browser-safe。
export { IOffPeakTaskService } from "./session/offPeakTask.js";
// Skills service — ISkillsService is both a type (interface) and value (descriptor)
export { ISkillsService } from "./skills/skills.js";
export { ISkillSyncService } from "./skill-sync/skillSync.js";
export { IMcpSyncService } from "./mcp-sync/mcpSync.js";
export { IPluginSyncService } from "./plugin-sync/pluginSync.js";
export { ICuaPermissionService, isCuaPermissionStatusAvailable, } from "./cua-permission-broker/cuaPermissionService.js";
export { ICuaPipSessionService, } from "./cua-permission-broker/cuaPipSession.js";
// Plugins service — IPluginsService is both a type (interface) and value (descriptor)
export { IPluginsService } from "./plugins/plugins.js";
// 设置页插件管理薄服务（UI 平台能力面不再直触 zcodeAgentService）
export { IPluginManagementService } from "./plugins/pluginManagement.js";
// Subagents service — ISubagentsService is both a type (interface) and value (descriptor)
export { ISubagentsService } from "./subagents/subagents.js";
// Commands service — ICommandsService is both a type (interface) and value (descriptor)
export { ICommandsService } from "./commands/commands.js";
export { ISettingsSyncService } from "./settings-sync/settingsSync.js";
export { IFeedbackService } from "./feedback/feedback.js";
export { IPromptAttachmentTransferService } from "./prompt-attachment-transfer/promptAttachmentTransfer.js";
// 插件 UI 桥：描述符、参数类型与工厂；App-Provided Tools 另有独立描述符。
export { createPluginUiBridgeService, createPluginUiAppToolsService, createPluginUiSamplingService, IPluginUiSamplingService, PluginUiBridgeError, IPluginUiAppToolsService, } from "./plugin-ui-bridge/index.js";
export { IPluginUiBridgeService, } from "./plugin-ui-bridge/contract.js";
export { IClientConfigService } from "./client-config/clientConfig.js";
export { IHighspeedCardService } from "./highspeed/highspeedCard.js";
export { HighspeedCardService, createHighspeedHttpTransport, buildHighspeedTurnExecution, } from "./highspeed/highspeedCardService.js";
export { createHighspeedMockTransport } from "./highspeed/highspeedMockTransport.js";
export { IGenUiService } from "./gen-ui/contract.js";
//# sourceMappingURL=index.js.map