import { readFile } from "node:fs/promises";
import { isAbsolute, join } from "node:path";
const INSTALLED_PLUGINS_FILE = "installed_plugins.json";
export async function readInstalledPluginRoots(pluginStorageRoot) {
    const records = await readInstalledPluginRecords(pluginStorageRoot);
    return records.map((record) => ({
        defaultEnabled: false,
        marketplace: record.marketplace,
        rootPath: record.installPath,
    }));
}
async function readInstalledPluginRecords(pluginStorageRoot) {
    let raw;
    try {
        raw = await readFile(join(pluginStorageRoot, INSTALLED_PLUGINS_FILE), "utf-8");
    }
    catch {
        return [];
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        return [];
    }
    if (!isRecord(parsed) || !Array.isArray(parsed.plugins)) {
        return [];
    }
    const records = [];
    for (const item of parsed.plugins) {
        if (!isRecord(item))
            continue;
        const id = typeof item.id === "string" ? item.id.trim() : "";
        const marketplace = typeof item.marketplace === "string" ? item.marketplace.trim() : "";
        const installPath = typeof item.installPath === "string" ? item.installPath.trim() : "";
        if (!id || !marketplace || !installPath || !isAbsolute(installPath)) {
            continue;
        }
        records.push({ id, installPath, marketplace });
    }
    return records;
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=installedPluginRoots.js.map