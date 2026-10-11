/**
 * Hooks barrel export
 *
 * 所有服务和平台操作的 hooks 统一从此导出。
 * 组件应通过 hooks 访问服务，不再直接使用 services.* 或 window.zcode.*。
 */
export { ServiceProvider, useServices } from "./useServices.js";
export { useBaseWorkspaceServices, useWorkspaceServices } from "./useWorkspaceServices.js";
export { PlatformProvider, usePlatform, useSelectDirectory, useConnectRemote, } from "./usePlatform.js";
export { useReaddir } from "./useFileService.js";
export { useWatchedReaddir } from "./useFileWatcherService.js";
export { useSystemInfo, useIntranetProbe } from "./useSystemService.js";
export { useWorkspaceHomePath } from "./useWorkspaceHomePath.js";
export { useTerminal } from "./useTerminalService.js";
export { useSettings, useRecentProjects } from "./useSettingService.js";
export { useSkills } from "./useSkills.js";
export { usePlugins } from "./usePlugins.js";
export { useOnboardingRecordService } from "./useOnboardingRecordService.js";
export { useConfirmDialog } from "./useConfirmDialog.js";
export { useAlertDialog } from "./useAlertDialog.js";
export { useCredentials, useAuthToken } from "./useCredentials.js";
export { useZCodeAgentService } from "./useZCodeAgentService.js";
export { useGitAutoRefresh } from "./useGitAutoRefresh.js";
export { useGitRepository } from "./useGitRepository.js";
export { useGitActions } from "./useGitActions.js";
export { useWorkspaceProviderConfigFile } from "./useWorkspaceProviderConfigFile.js";
export { useTaskNativeSessionLogFile } from "./useTaskNativeSessionLogFile.js";
export { useTaskSessionFilePath } from "./useTaskSessionFilePath.js";
export { useUsageStats } from "./useUsageStats.js";
//# sourceMappingURL=index.d.ts.map