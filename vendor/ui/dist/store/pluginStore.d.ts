import type { AvailablePluginSummary, InstalledPluginSummary, PluginMarketplaceSummary, PluginsCapability } from "@zcode/shared";
import type { IPluginsService } from "@zcode/services";
interface PluginStoreState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    loadedWorkspacePath: string | null;
    loadedWorkspaceIdentity: string | null;
    marketplaces: PluginMarketplaceSummary[];
    availablePlugins: AvailablePluginSummary[];
    installedPlugins: InstalledPluginSummary[];
    capability: PluginsCapability | null;
    loading: boolean;
    refreshing: boolean;
    error: string | null;
    addingMarketplaceSource: string | null;
    removingMarketplaceName: string | null;
    updatingMarketplaceName: string | null;
    installingPluginId: string | null;
    uninstallingPluginId: string | null;
    settingPluginEnabledId: string | null;
    settingPluginEnabledValue: boolean | null;
    initialize: (workspacePath: string, pluginsService: IPluginsService, workspaceIdentity?: string) => Promise<void>;
    refresh: (pluginsService: IPluginsService, workspaceIdentity?: string) => Promise<void>;
    addMarketplace: (source: string, pluginsService: IPluginsService, workspaceIdentity?: string) => Promise<boolean>;
    removeMarketplace: (marketplace: string, pluginsService: IPluginsService, workspaceIdentity?: string) => Promise<boolean>;
    updateMarketplace: (marketplace: string | null, pluginsService: IPluginsService, workspaceIdentity?: string) => Promise<boolean>;
    installPlugin: (pluginName: string, marketplace: string, scopeOrPluginsService: InstalledPluginSummary["scope"] | IPluginsService, maybePluginsService?: IPluginsService, workspaceIdentity?: string) => Promise<boolean>;
    uninstallPlugin: (pluginName: string, marketplace: string, scopeOrPluginsService: InstalledPluginSummary["scope"] | IPluginsService, maybePluginsService?: IPluginsService, workspaceIdentity?: string) => Promise<boolean>;
    setPluginEnabled: (pluginName: string, marketplace: string, scopeOrEnabled: InstalledPluginSummary["scope"] | boolean, enabledOrPluginsService: boolean | IPluginsService, maybePluginsService?: IPluginsService, workspaceIdentity?: string, nativeScope?: InstalledPluginSummary["nativeScope"]) => Promise<boolean>;
    resetWorkspaceContext: () => void;
}
export declare const usePluginStore: import("zustand").UseBoundStore<import("zustand").StoreApi<PluginStoreState>>;
export {};
//# sourceMappingURL=pluginStore.d.ts.map