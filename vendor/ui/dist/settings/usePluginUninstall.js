import { useCallback, useMemo, useState } from "react";
import { usePluginManagementStore } from "../store/pluginManagementStore.js";
/**
 * 集中管理插件卸载的确认流程：UI 各入口（已安装详情、市场面板）都通过它发起卸载，
 * 共用同一份 pending 状态、确认弹窗目标解析与卸载收尾逻辑。
 */
export function usePluginUninstall({ pluginService, installedPlugins, plugins, operationId, onAfterUninstall, }) {
    const uninstallPlugin = usePluginManagementStore((state) => state.uninstallPlugin);
    const [pendingId, setPendingId] = useState(null);
    const pendingPlugin = useMemo(() => {
        if (!pendingId)
            return null;
        return (installedPlugins.find((item) => item.id === pendingId) ??
            plugins.find((item) => item.id === pendingId) ??
            null);
    }, [installedPlugins, pendingId, plugins]);
    const uninstalling = pendingId !== null && operationId === `plugin:uninstall:${pendingId}`;
    const requestUninstall = useCallback((pluginId) => {
        setPendingId(pluginId);
    }, []);
    const cancelUninstall = useCallback(() => {
        setPendingId(null);
    }, []);
    const confirmUninstall = useCallback(async () => {
        if (!pendingId)
            return;
        await uninstallPlugin(pendingId, pluginService);
        await onAfterUninstall();
        setPendingId(null);
    }, [pluginService, onAfterUninstall, pendingId, uninstallPlugin]);
    return { pendingPlugin, uninstalling, requestUninstall, cancelUninstall, confirmUninstall };
}
//# sourceMappingURL=usePluginUninstall.js.map