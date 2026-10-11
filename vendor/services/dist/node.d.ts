import { type DynamicWorkflowMode, type ProviderProvisioningTrigger } from "@zcode/shared";
export { materializeZCodeBuiltinProviderConfig, ZCODE_BUILTIN_PROVIDER_CONFIG_FILE_ENV, } from "@zcode/provider-node";
import type { IChannel } from "@zcode/rpc";
export { createTopicResourcePeers, type TopicResourcePeers, } from "./zcode-agent/topicResourcePeers.js";
export { createTopicResourceRelayChannel } from "./zcode-agent/topicResourceRelayChannel.js";
export { createFileService } from "./file/fileService.js";
export { attributeHostProcessTree, createProcessResourceSampler, createProcessResourceTableReader, type HostResourceUsageAgent, type ProcessResourceSample, type ProcessResourceSampler, } from "./process/processResourceSampler.js";
export { createMediaPreviewService } from "./media-preview/mediaPreview.js";
export { createContentBundleCache } from "#src/cloud-content/contentBundleCache.js";
export type { ContentBundle } from "#src/cloud-content/contentBundleCache.js";
export type { CreateFileServiceOptions } from "./file/fileService.js";
export { defaultWorkspaceFileSearchFilter, type WorkspaceFileSearchDecision, type WorkspaceFileSearchEntry, type WorkspaceFileSearchFilter, } from "./file/workspaceFileMentionFilter.js";
export { createFsFaultInjector, getProcessFsFaultInjector, maybeThrowInjectedFsFault, parseFsFaultRulesFromEnvValue, resetProcessFsFaultInjectorForTests, setFsFaultInjectorForTests, ZCODE_E2E_FS_FAULTS_ALLOW_ENV, ZCODE_E2E_FS_FAULTS_ENV, } from "./fs/fsFaultInjection.js";
export type { FsFaultCheckInput, FsFaultHit, FsFaultInjector, FsFaultOperation, FsFaultRuleConfig, InjectedFsFaultError, } from "./fs/fsFaultInjection.js";
export { setDataBaseDir, getDataBaseDir, getZCodeDataRootDir, getConversationWorkspaceDir, getAppConfigDir, getExportLogStageDir, getExportLogDir, getFeedbackRootDir, getFeedbackAttachmentDir, getFeedbackLogArchiveDir, getGitCheckpointIndexRootDir, copyDataDirectory, validateDataBaseDirTarget, ZCODE_WINDOWS_APP_INSTALL_DIR_ENV, } from "./paths.js";
export { createGitService } from "./git/gitService.js";
export { GitCommitMessageGenerator } from "./git/gitCommitMessageGenerator.js";
export { createGitCheckpointService } from "./git/gitCheckpointService.js";
export { createSystemService } from "./system/systemService.js";
export { listSSHConfigAliasesFromLocalConfig } from "./system/sshConfigAlias.js";
export { createTerminalService } from "./terminal/terminalService.js";
export { createSettingService, createSettingServiceWithMigrations, } from "./setting/settingService.js";
export { createCredentialService } from "./credential/credentialService.js";
export { createBroadcastService } from "./broadcast/broadcastService.js";
export { createZCodeAgentService } from "./zcode-agent/zcodeAgentService.js";
export { createZCodeTaskServiceAdapter } from "./zcode-agent/zcodeTaskServiceAdapter.js";
export { createZCodeSessionService } from "./zcode-session/zcodeSessionService.js";
export { resolveDefaultZCodeAgentCommand, ZCodeAgentProcessManager, } from "./zcode-agent/zcodeAgentProcessManager.js";
export type { ZCodeAgentCommand, ZCodeAgentCommandResolver, ZCodeAgentCommandResolverContext, ZCodeAgentProcessManagerOptions, } from "./zcode-agent/zcodeAgentProcessManager.js";
export { ZCodeProtocolClient } from "./zcode-agent/zcodeProtocolClient.js";
export type { ZCodeProtocolTransport } from "./zcode-agent/zcodeProtocolTransport.js";
export { ZCodeStdioTransport } from "./zcode-agent/zcodeStdioTransport.js";
export { getZCodeStdioTapDevLogDir, readZCodeStdioTapDevState, setZCodeStdioTapDevEnabled, } from "./zcode-agent/zcodeStdioTapDevConfig.js";
export type { ZCodeStdioTapDevState } from "@zcode/shared";
export { createCuaHelperInstaller, requestHelperAccessibilityPermissionViaLaunchServices, requestHelperScreenRecordingPermissionViaLaunchServices, } from "./cua-permission-broker/index.js";
export { canonicalizeCuaHelperInstallerOptions, createCanonicalCuaHelperInstaller, normalizeCuaHelperArch, normalizeCuaHelperArchs, } from "./cua-permission-broker/cuaHelperInstaller.js";
export type { CuaHelperInstaller, CuaHelperInstallerOptions, } from "./cua-permission-broker/index.js";
export { createBotsService } from "./bots/botsService.js";
export { createFileWatcherService } from "./fileWatcher/fileWatcherService.js";
export { createOAuthService } from "./oauth/oauthService.js";
export { createOAuthProviderLogoutHandler } from "./oauth/oauthProviderLogout.js";
export { OAuthCredentialRepo } from "./oauth/repo/oauthCredentialRepo.js";
export { createTelemetryCore, ensureTelemetryDeviceMid } from "./telemetry/telemetryCore.js";
export type { EnsureTelemetryDeviceMidOptions } from "./telemetry/telemetryCore.js";
export type { AccountRequestAuthResolver } from "./model-provider/accountProviderRequestAuthService.js";
export { createAccountProviderCredentialStore } from "./model-provider/accountProviderCredentialStore.js";
export type { AccountProviderCredentialStore, AccountProviderCredentialStoreOptions, } from "./model-provider/accountProviderCredentialStore.js";
export { importLegacyPersonalProviderConfig } from "./model-provider/legacyPersonalProviderConfigImporter.js";
export { createAccountProviderConfigSource, createAccountProviderConnectionResolver, createCodingPlanFamilyAvailabilityResolver, resolveCurrentAccountAccess, } from "./model-provider/accountProviderConnectionResolver.js";
export { bindAccountProviderInvalidation } from "./model-provider/accountProviderInvalidation.js";
export type { AccountProviderConfigSourceOptions, AccountProviderConnectionResolverOptions, AccountProviderConnectionSettings, AccountProviderFamilyAvailabilityInput, AccountProviderFamilyAvailabilityResolver, CodingPlanFamilyAvailabilityResolverOptions, } from "./model-provider/accountProviderConnectionResolver.js";
export { createProviderConfigRuntime, ProviderConfigRuntime, } from "./model-provider/providerConfigRuntime.js";
export type { ProviderConfigRuntimeOptions } from "./model-provider/providerConfigRuntime.js";
export { createProviderRuntime, createProviderRuntimeFromConfigRuntime, EmptyAccountProviderConfigSource, ProviderRuntime, } from "./model-provider/providerRuntime.js";
export type { ProviderRuntimeDependencies, ProviderRuntimeOptions, } from "./model-provider/providerRuntime.js";
export { createProviderProvisioningSource, listProviderProvisioningCredentialKeys, resolveCredentialFilePath, type ProviderProvisioningSource, type ProviderProvisioningSourceOptions, } from "./model-provider/providerProvisioningSource.js";
export { createProviderProvisioningTarget, type ProviderProvisioningTargetOptions, } from "./model-provider/providerProvisioningTarget.js";
export { createModelSelectionService, createProviderSettingsService, IModelSelectionService, IProviderSettingsService, } from "./model-provider/providerFacadeServices.js";
export { createAccountRequestAuthService } from "./model-provider/accountRequestAuthService.js";
export type { IAccountRequestAuthService } from "./model-provider/accountRequestAuthService.js";
export { createAccountProviderRequestAuthService } from "./model-provider/accountProviderRequestAuthService.js";
export { resolveAccountTeamPlanRuntimeApiKey, resolveAccountTeamPlanRuntimeMaterial, } from "./model-provider/accountProviderTeamPlanRequestKey.js";
export { createAccountProjectTokenClient } from "./model-provider/accountProjectTokenClient.js";
export { createAccountProviderCredentialService } from "./model-provider/accountProviderCredentialService.js";
export { createUsageStatsService } from "./usage-stats/usageStatsService.js";
export { createStorageService } from "./storage/app/storageService.js";
export type { FsCleanerPort as StorageFsCleanerPort, RootsResolverPort as StorageRootsResolverPort, ScanRunnerPort as StorageScanRunnerPort, StorageScanProgress, StorageScanRunRequest, } from "./storage/app/ports.js";
export { createFsStorageCleaner } from "./storage/adapters/fsCleaner.js";
export { createStorageRootsResolver, resolveStorageRoots, } from "./storage/adapters/rootsResolver.js";
export { createFsVolumeProbe } from "./storage/adapters/volumeProbe.js";
export { runStorageScan } from "./storage/adapters/inProcessScanRunner.js";
export { createCodingPlanSubscriptionService } from "./coding-plan-subscription/codingPlanSubscriptionService.js";
export { createClientConfigService } from "./client-config/clientConfigService.js";
export { createClientScenesService } from "./client-scenes/clientScenesService.js";
export { createSkillsService } from "./skills/skillsService.js";
export { createSkillSyncService } from "./skill-sync/skillSyncService.js";
export { createMcpSyncService } from "./mcp-sync/mcpSyncService.js";
export { createPluginSyncService } from "./plugin-sync/pluginSyncService.js";
export { createPluginsService } from "./plugins/pluginsService.js";
export { createPluginManagementService } from "./plugins/pluginManagementService.js";
export { createSubagentsService } from "./subagents/subagentsService.js";
export { createCommandsService } from "./commands/commandsService.js";
export { createHooksService } from "./hooks/hooksService.js";
export { createMemoryService } from "./memory/memoryService.js";
export { createOutputStyleService } from "./output-style/outputStyleService.js";
export { createSettingsSyncService } from "./settings-sync/settingsSyncService.js";
export { createFeedbackDiagnosticArchive } from "./feedback/feedbackLogArchive.js";
export { createFeedbackService } from "./feedback/feedbackService.js";
export type { CreateFeedbackServiceOptions } from "./feedback/feedbackService.js";
export { createLocalPromptAttachmentTransferService } from "./prompt-attachment-transfer/promptAttachmentTransferService.js";
export { createLocalConversationShareArtifactSource, createRemoteConversationShareArtifactSource, } from "./conversation-share/conversationShareArtifactSource.js";
export { createNodeApiClient, NodeApiClient } from "./providers/api/nodeApiClient.js";
export { createHostApiNetworkTransport, type HostApiNetworkTransport, } from "./providers/api/nodeApiNetwork.js";
export { buildRuntimeProcessEnvPatch, captureLoginShellEnvSnapshot, normalizeRuntimeProcessEnv, prepareRuntimeProcessEnvPatch, } from "./runtime-tools/runtimeCommandEnv.js";
export { AutomationRepo, DISPATCH_RETRY_BASE_MS, DISPATCH_RETRY_CAP_MS, DISPATCH_MAX_ATTEMPTS, CLAIM_STALE_MS, computeRetryAt, } from "./session/automationRepo.js";
export { AutomationService, InvalidCronExprError } from "./session/automationService.js";
export { OffPeakTaskRepo, OFF_PEAK_CLAIM_STALE_MS } from "./session/offPeakTaskRepo.js";
export { buildTaskChangeSummary } from "./session/taskChangeSummary.js";
export { OffPeakTaskService } from "./session/offPeakTaskService.js";
export { IOffPeakTaskService } from "./session/offPeakTask.js";
export { IHighspeedCardService } from "./highspeed/highspeedCard.js";
export { createOffPeakServerClient, OffPeakServerError } from "./session/offPeakServerClient.js";
export { isOffPeakMockEnabled, startOffPeakMockGateway } from "./session/offPeakMockGateway.js";
export { buildOffPeakRequestAuth, createOffPeakOriginResolver, resolveOffPeakCredentials, resolveOffPeakCodingPlanSupport, resolveOffPeakMockUpstream, OffPeakCodingPlanUnavailableError, OffPeakCredentialsUnavailableError, OffPeakModelUnavailableError, OffPeakPermanentDispatchError, } from "./session/offPeakRuntimeModel.js";
export { createServiceLogger } from "./logger/serviceLogger.js";
export { buildOfficialMcpAuthHeaders, createOfficialMcpAuthHeadersResolver, resolveOfficialMcpCredentials, } from "./official-mcp/officialMcpCredentials.js";
export { computeAutomationNextRunAt, computeNextRunAt, computeScheduleRuleNextRunAt, isOneShotAutomation, isValidCronExpr, } from "./session/automationCron.js";
import { ServiceCollection } from "./collection.js";
import { ISettingService } from "./setting/setting.js";
import { ICredentialService } from "./credential/credential.js";
import type { CuaOperationStateReporter } from "./zcode-agent/cuaOperationTurnTracker.js";
import { ConversationShareService, conversationShareConnectionScopeFactory } from "./conversation-share/conversationShareService.js";
import { ConversationShareHttpClient } from "./conversation-share/conversationShareHttpClient.js";
import type { WorkspaceFileSearchFilter } from "./file/workspaceFileMentionFilter.js";
import { createSettingServiceWithMigrations } from "./setting/settingService.js";
import { createBroadcastService } from "./broadcast/broadcastService.js";
import type { ZCodeAgentCommandResolver } from "./zcode-agent/zcodeAgentProcessManager.js";
import type { SessionMessageSendRequested } from "#src/session/sessionMailbox.js";
import { type ProviderProvisioningSource } from "./model-provider/providerProvisioningSource.js";
import { type IAccountRequestAuthService } from "./model-provider/accountRequestAuthService.js";
import type { PluginSandboxHandle, PluginSandboxRegisterInput } from "@zcode/shared/mcp-apps";
import { type CreateFeedbackServiceOptions } from "./feedback/feedbackService.js";
import { type HostApiNetworkTransport } from "./providers/api/nodeApiNetwork.js";
import type { RuntimeProcessLifecycleReporter, RuntimeTaskReporter } from "#src/process/runtimeProcessLifecycle.js";
import { type ServiceLogger } from "#src/logger/serviceLogger.js";
import { isOfficialCuaPluginEnabledForWorkspace, type CuaHelperHost, type ManagedCuaProductHelperHost, type CuaProductMcpServerResolver, type CuaProductMcpServerResolverContext, type CuaPermissionStatusQueryOptions } from "#src/cua-permission-broker/index.js";
import { type WindowsCuaRuntime } from "#src/cua-permission-broker/windowsCuaDevRuntime.js";
import { type ServiceAuthorityMode, type BrowserBackendDescriptor, type BrowserClientMode, type BrowserCommand, type ZCodeAutomation, type ZCodeAutomationRun } from "@zcode/shared";
export { ConversationShareService, ConversationShareHttpClient, conversationShareConnectionScopeFactory, };
type DefaultCuaProductHelper = {
    host: ManagedCuaProductHelperHost;
    macPermissionHost?: CuaHelperHost;
    resolver: CuaProductMcpServerResolver;
};
interface ManagedCuaHelperHostDispose {
    stop(): Promise<void>;
}
export type OffPeakRequestAuthBuilder = (ticketId: string) => Promise<{
    apiKey: string;
    headers: Record<string, string>;
    accountScope?: string;
}>;
/** Local Host 进程内能力；不会随 ServiceCollection 暴露到通用 RPC Channel。 */
export declare function getAccountRequestAuthService(services: ServiceCollection): IAccountRequestAuthService | undefined;
/** Local Host 进程内的 Provisioning Source；不会把凭据通过通用 RPC 暴露给 Renderer。 */
export declare function getProviderProvisioningSource(services: ServiceCollection): ProviderProvisioningSource | undefined;
/** Local Host 私有的闲时请求鉴权装配；复用正式 Registry/Account Access 解析，不进入 RPC。 */
export declare function getOffPeakRequestAuthBuilder(services: ServiceCollection): OffPeakRequestAuthBuilder | undefined;
export declare function registerManagedCuaHelperHostForDispose(services: ServiceCollection, host: ManagedCuaHelperHostDispose): void;
export declare function registerHostApiNetworkTransportForDispose(services: ServiceCollection, transport: HostApiNetworkTransport): void;
export declare function shouldEnableDefaultCuaProductHelper(options?: {
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
}): boolean;
/**
 * 是否在当前 host 创建默认 CUA product Helper。Computer Use Helper 只能由**桌面本地** authority 创建：
 * - desktop-attached-remote 与 standalone-server 都绝不自动创建，避免远端 workspace 在错误的
 *   host 上启动 Helper，破坏 shared-host attachment 与权限边界；
 * - 已显式注入 resolver 时不重复创建。
 * 平台/环境层面的启用与否另由 shouldEnableDefaultCuaProductHelper 决定。
 */
export declare function shouldCreateDefaultCuaProductHelper(opts: {
    serviceAuthorityMode?: ServiceAuthorityMode;
    hasRemoteWorkspaceIdentity?: boolean;
    hasInjectedResolver: boolean;
    hasBuiltInCuaPlugin: boolean;
}): boolean;
export declare function shouldUseCuaPermissionService(opts: {
    platform?: NodeJS.Platform;
    cuaEnabled: boolean;
}): boolean;
export declare function shouldRetainDefaultCuaProductHelper(): boolean;
export declare function shouldEnableCuaOperationStateReporter(opts: {
    serviceAuthorityMode?: ServiceAuthorityMode;
    hasReporter: boolean;
}): boolean;
export declare function runCuaScreenCaptureReadinessProbe(host: Pick<CuaHelperHost, "queryScreenCaptureProbe">, screenRecording: "granted" | "denied" | "unknown", queryOptions?: CuaPermissionStatusQueryOptions): Promise<boolean>;
/**
 * Screen Recording 的展示态取值：优先短命 Helper 读到的 TCC 真值，拿不到才沿用常驻 Helper 的报告。
 *
 * 为什么不能直接信常驻 Helper：macOS 撤销 Screen Recording 对**已运行进程**不生效 ——
 * 进程在退出前保留已获得的录屏能力，`CGPreflightScreenCaptureAccess()` 也继续返回撤销前的值。
 * 于是用户在系统设置里关掉授权后，常驻 broker Helper 会一直报 granted 直到它自己重启，
 * 设置页跟着显示「已授权」；而下一次 Helper 重启 CUA 就真的不可用了。
 * 授予方向同样陈旧：刚授权完常驻 Helper 仍可能报 denied。
 *
 * fail-open 是刻意的：预检失败（open 失败 / 超时 / 结果不合法）时沿用报告值，
 * 不比不做预检更糟。硬报 denied 会把已授权用户推进一次无意义的授权引导。
 */
export declare function resolveCuaScreenRecordingState(host: Pick<CuaHelperHost, "queryScreenRecordingPreflight">, reported: "granted" | "denied" | "unknown"): Promise<"granted" | "denied" | "unknown">;
export declare function createDynamicCuaProductMcpServerResolver(options: {
    isPluginEnabled: (context?: CuaProductMcpServerResolverContext) => boolean;
    getResolver: (context?: CuaProductMcpServerResolverContext) => CuaProductMcpServerResolver | undefined | Promise<CuaProductMcpServerResolver | undefined>;
    isResolverCurrent?: (resolver: CuaProductMcpServerResolver, context?: CuaProductMcpServerResolverContext) => boolean;
}): CuaProductMcpServerResolver;
type CreateDefaultCuaProductHelperOptions = {
    hasActiveTurn?: () => boolean;
    platform?: NodeJS.Platform;
    env?: NodeJS.ProcessEnv;
    resourcesPath?: string;
    arch?: NodeJS.Architecture;
    electronVersion?: string;
    resolveWindowsRuntime?: () => Promise<WindowsCuaRuntime>;
    createMacHost?: () => CuaHelperHost;
    createWindowsHost?: (runtime: WindowsCuaRuntime) => ManagedCuaProductHelperHost;
};
/**
 * Windows 侧 Helper 宿主的懒解析包装：把「解析安装包运行时」推迟到首次 start()/checkHealth()，
 * 并把解析结果缓存（含 rejection）。
 *
 * resolveWindowsCuaRuntime 可能因 missing-native-addon、artifact-integrity-mismatch、
 * incompatible-runtime-manifest 等原因失败。若只向调用方抛错而没有诊断记录，设置页的
 * 「未加载」状态无法说明具体原因。因此在这里记录一条带 reason 的
 * error 日志，且因为 rejection 被缓存、日志挂在同一条 promise 链上，重复 start() 不会刷屏。
 * 载荷只有 reason/artifact/errorName/message：解析发生在 mint token 与命名管道之前，天然不含密钥。
 */
export declare function createWindowsCuaHelperHost(options: {
    resolveRuntime: () => Promise<WindowsCuaRuntime>;
    createHost: (runtime: WindowsCuaRuntime) => ManagedCuaProductHelperHost;
    logger?: ServiceLogger;
}): ManagedCuaProductHelperHost;
export declare function createDefaultCuaProductHelper(options: CreateDefaultCuaProductHelperOptions): DefaultCuaProductHelper | undefined;
export declare const ZCODE_CUA_BUNDLED_HELPER_APP_PATH_ENV = "ZCODE_CUA_BUNDLED_HELPER_APP_PATH";
export declare function resolveBundledCuaHelperAppPath(env?: NodeJS.ProcessEnv): string | undefined;
export { isOfficialCuaPluginEnabledForWorkspace };
export declare function hasGlobalCliZCodeCuaServer(env?: NodeJS.ProcessEnv): boolean;
/**
 * 创建包含所有本地服务的 ServiceCollection
 *
 * @param options.parentPort - Electron host process 的 parentPort，
 *        用于 BroadcastService 跨窗口中转。传 null 则广播为空操作。
 */
export declare function createLocalServices(options: {
    /** 已鉴权 Desktop stdio 连接提供的私有回查频道；不作为公共 service 暴露。 */
    topicResourceRelayChannel?: (request: unknown) => IChannel;
    parentPort?: Parameters<typeof createBroadcastService>[0];
    /** Host 装配层注入的设置权威；与网络 transport 必须来自同一 Window Host 生命周期。 */
    settingService?: ISettingService;
    /** 与注入的本地 Setting 共用写队列；外部远端 Setting 不传，由其权威 Host 完成迁移。 */
    prepareLegacyAccountConnections?: ReturnType<typeof createSettingServiceWithMigrations>["prepareLegacyAccountConnections"];
    /** 注入后由 ServiceCollection 接管释放，并供 Host 其它 app-managed 下载复用。 */
    hostApiNetworkTransport?: HostApiNetworkTransport;
    /** Desktop Host 请求 Main 登记 Agent 已授权的精确本地视频路径。 */
    authorizeLocalMediaPreviewPath?: (path: string) => Promise<string>;
    /**
     * 动态工作流用户选择变化后的转发口（docs/dynamic-workflow/launch.md「The user's choice」）：
     * Desktop Host 把本机设置里的选择推给本窗口所有在线的 desktop-attached remote Host。
     */
    forwardDynamicWorkflowUserMode?: (mode: DynamicWorkflowMode | undefined) => void;
    /** Desktop Host 请求 Main 登记已校验的插件 UI HTML，换取沙箱句柄。 */
    registerPluginSandbox?: (input: PluginSandboxRegisterInput) => Promise<PluginSandboxHandle>;
    feedback?: Partial<Omit<CreateFeedbackServiceOptions, "apiClient" | "credentialService" | "oauthService">>;
    processLifecycleReporter?: RuntimeProcessLifecycleReporter;
    taskRuntimeReporter?: RuntimeTaskReporter;
    /** workspace 文件搜索默认使用内置过滤器；后续规则来源只需在 Host 装配时注入最终实现。 */
    workspaceFileSearchFilter?: WorkspaceFileSearchFilter;
    forwardSessionMessageSendRequested?: (request: SessionMessageSendRequested) => Promise<void> | void;
    /** desktop local host 在 manual run 落库后直接派发，不经过 scheduler 正常路径。 */
    onAutomationManualRunRequested?: (params: {
        automation: ZCodeAutomation;
        run: ZCodeAutomationRun;
    }) => Promise<void>;
    /** 闲时任务翻 schedulable 后请求宿主立即唤醒 scheduler（desktop host 注入 parentPort 转发）。 */
    onOffPeakSchedulerWakeRequested?: () => void;
    zcodeAgentCommandResolver?: ZCodeAgentCommandResolver;
    /** Desktop Main 提前异步采集的本机 runtime 环境；Local Host 注入后不再同步启动 login shell。 */
    runtimeProcessEnvPatch?: Record<string, string>;
    /** 本地桌面上次 workspace 缺失时，仅用于 Agent 子进程 spawn.cwd 兜底。 */
    zcodeAgentSpawnFallbackCwd?: string;
    /** desktop-attached remote server 从 Desktop Host 收到的一次性 Agent 网络配置。 */
    remoteAgentNetwork?: {
        httpProxy?: string;
        noProxy?: string;
    };
    /** 所属 Environment 的 ZCode Built-in Provider Config 物理路径。 */
    zcodeBuiltinProviderConfigFilePath: string;
    /** HTTP Server 只有在调用方明确配置认证时才暴露跨 Environment Provisioning target。 */
    providerProvisioningTargetEnabled?: boolean;
    /** Desktop Host 私有通知；只在 Source 成功持久化后请求 Main 调度远端镜像。 */
    onProviderProvisioningSourceChanged?: (trigger: Exclude<ProviderProvisioningTrigger, "environment-online">) => void;
    serviceAuthorityMode?: ServiceAuthorityMode;
    cuaProductMcpServerResolver?: CuaProductMcpServerResolver;
    agentTelemetry?: {
        getDeviceMid?: () => string | undefined;
        runtimeSurface?: "desktop_local_host" | "remote_workspace_host";
    };
    /** browser-use 执行桥（host→main WebContentsView+CDP）；desktop host 注入，缺省则 browser 不可用。 */
    browserControlExecutor?: {
        list(input: {
            requestId: string;
            sessionId: string;
            turnId?: string;
            workspaceKey: string;
            workspacePath: string;
            workspaceIdentity?: string;
            remoteSessionId?: string;
            clientMode: BrowserClientMode;
            sessionContext: "live" | "cached";
        }): Promise<BrowserBackendDescriptor[]>;
        execute(input: {
            requestId: string;
            browserId?: string;
            browserGeneration?: number;
            sessionId: string;
            turnId?: string;
            workspaceKey: string;
            workspacePath: string;
            workspaceIdentity?: string;
            remoteSessionId?: string;
            clientMode: BrowserClientMode;
            sessionContext: "live" | "cached";
            command: BrowserCommand;
        }): Promise<{
            ok: boolean;
            [k: string]: unknown;
        }>;
    };
    /** Windows desktop-local Host 的 CUA turn 状态投影；其它 authority 会在装配层拒绝。 */
    cuaOperationStateReporter?: CuaOperationStateReporter;
}): ServiceCollection;
export declare function createTelemetryUserIdLoader(credentialService: Pick<ICredentialService, "load">): () => Promise<string>;
/** 仅给同一事件账号返回当前 ZCode JWT；不缓存、不修改登录凭据。 */
export declare function createTelemetryAuthorizationLoader(credentialService: Pick<ICredentialService, "load">): (userId: string) => Promise<string | null>;
export declare function createTelemetryMarketingParamsLoader(credentialService: ICredentialService): () => Promise<import("@zcode/shared").OAuthLoginAttribution | null>;
export declare function disposeServiceResources(services: ServiceCollection): void;
export declare function disposeServiceResourcesAndWait(services: ServiceCollection): Promise<void>;
export { localRuntimeNetworkCapture } from "./zcode-agent/localRuntimeNetworkCapture.js";
//# sourceMappingURL=node.d.ts.map