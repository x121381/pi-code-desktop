export declare const ZCODE_OFFICIAL_PLUGIN_MARKETPLACE = "zcode-plugins-official";
/**
 * 与 apps/zcode-cli/packages/bootstrap/src/app/official-plugin-definitions.ts 的 defaultEnabled 保持一致。
 * services 侧（skills / commands / subagents）共用这一份，避免再出现 zcode-guide 那样某一处漏掉的分叉。
 */
export declare const DEFAULT_ENABLED_OFFICIAL_PLUGIN_IDS: ReadonlySet<string>;
export interface OfficialPluginCacheRoot {
    /** 缓存目录名，即官方插件 name。 */
    name: string;
    /** 数字感知降序后的可用版本目录，首项为最新版本。 */
    versionRoots: string[];
}
/**
 * 扫描 `<plugins storage>/cache/zcode-plugins-official/<name>/<version>/`。
 * 内置官方插件由 CLI seed 到这里、没有 installed_plugins.json 记录，services 只读安装记录时会漏掉它们。
 * 版本目录跳过 CLI 的备份 / seed 锁 / 临时目录，并按数字感知降序排序，与 CLI 回退选取一致。
 */
export declare function scanOfficialPluginCacheRoots(pluginStorageRoot: string): Promise<OfficialPluginCacheRoot[]>;
//# sourceMappingURL=officialPluginCache.d.ts.map