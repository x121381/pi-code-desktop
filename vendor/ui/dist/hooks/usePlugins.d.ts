export declare function usePlugins(workspacePath: string | null, workspaceIdentity?: string | null): {
    marketplaces: import("@zcode/shared").PluginMarketplaceSummary[];
    availablePlugins: import("@zcode/shared").AvailablePluginSummary[];
    installedPlugins: import("@zcode/shared").InstalledPluginSummary[];
    capability: import("@zcode/shared").PluginsCapability | null;
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
    refresh: () => Promise<void>;
    addMarketplace: (source: string) => Promise<boolean>;
    removeMarketplace: (marketplace: string) => Promise<boolean>;
    updateMarketplace: (marketplace?: string) => Promise<boolean>;
    installPlugin: (pluginName: string, marketplace: string, scope?: "workspace" | "user") => Promise<boolean>;
    uninstallPlugin: (pluginName: string, marketplace: string, scope: "workspace" | "user") => Promise<boolean>;
    setPluginEnabled: (pluginName: string, marketplace: string, scope: "workspace" | "user", enabled: boolean, nativeScope?: "user" | "project" | "local") => Promise<boolean>;
};
//# sourceMappingURL=usePlugins.d.ts.map