import type { ZCodeInstalledPluginSummary, ZCodePluginInfo } from "@zcode/shared";
import type { IPluginManagementService } from "@zcode/services";
interface UsePluginUninstallInput {
    pluginService: IPluginManagementService;
    installedPlugins: ZCodeInstalledPluginSummary[];
    plugins: ZCodePluginInfo[];
    operationId: string | null;
    onAfterUninstall: () => Promise<void>;
}
export interface PluginUninstallController {
    pendingPlugin: ZCodePluginInfo | ZCodeInstalledPluginSummary | null;
    uninstalling: boolean;
    requestUninstall: (pluginId: string) => void;
    cancelUninstall: () => void;
    confirmUninstall: () => Promise<void>;
}
/**
 * 集中管理插件卸载的确认流程：UI 各入口（已安装详情、市场面板）都通过它发起卸载，
 * 共用同一份 pending 状态、确认弹窗目标解析与卸载收尾逻辑。
 */
export declare function usePluginUninstall({ pluginService, installedPlugins, plugins, operationId, onAfterUninstall, }: UsePluginUninstallInput): PluginUninstallController;
export {};
//# sourceMappingURL=usePluginUninstall.d.ts.map