import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID } from "../plugin-marketplaces.js";
/**
 * 扫描 `<plugins storage>/cache/zcode-plugins-official/<name>/<version>/`。
 * 内置官方插件由 CLI seed 到这里、没有 installed_plugins.json 记录，services 只读安装记录时会漏掉它们。
 * 版本目录跳过 CLI 的备份 / seed 锁 / 临时目录，并按数字感知降序排序，与 CLI 回退选取一致。
 */
export async function scanOfficialPluginCacheRoots(pluginStorageRoot) {
    const cacheRoot = join(pluginStorageRoot, "cache", ZCODE_OFFICIAL_PLUGIN_MARKETPLACE_ID);
    let pluginEntries;
    try {
        pluginEntries = await readdir(cacheRoot, { withFileTypes: true });
    }
    catch {
        return [];
    }
    const roots = [];
    for (const pluginEntry of pluginEntries) {
        if (!pluginEntry.isDirectory())
            continue;
        const pluginDir = join(cacheRoot, pluginEntry.name);
        let versionEntries;
        try {
            versionEntries = await readdir(pluginDir, { withFileTypes: true });
        }
        catch {
            continue;
        }
        const versionRoots = versionEntries
            .filter((entry) => entry.isDirectory() && !isTransientCacheEntryName(entry.name))
            .map((entry) => entry.name)
            .sort((left, right) => right.localeCompare(left, undefined, { numeric: true, sensitivity: "base" }))
            .map((version) => join(pluginDir, version));
        if (versionRoots.length > 0) {
            roots.push({ name: pluginEntry.name, versionRoots });
        }
    }
    return roots.sort((left, right) => left.name.localeCompare(right.name));
}
function isTransientCacheEntryName(name) {
    return name.includes(".backup") || name.includes(".seed-lock") || name.includes(".tmp-");
}
//# sourceMappingURL=officialPluginCache.js.map