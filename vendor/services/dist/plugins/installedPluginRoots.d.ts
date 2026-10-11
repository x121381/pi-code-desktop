export interface InstalledPluginRoot {
    defaultEnabled: boolean;
    marketplace: string;
    rootPath: string;
}
export declare function readInstalledPluginRoots(pluginStorageRoot: string): Promise<InstalledPluginRoot[]>;
//# sourceMappingURL=installedPluginRoots.d.ts.map