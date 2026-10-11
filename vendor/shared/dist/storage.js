export const STORAGE_CATEGORY_IDS = [
    "sessionStore",
    "subagentTranscripts",
    "toolOutputs",
    "modelTrajectory",
    "devTraces",
    "logs",
    "backups",
    "exports",
    "runtimes",
    "config",
    "other",
];
/** entries 超出上限后折叠项的占位路径；UI 显示为「其余 N 项」。 */
export const STORAGE_MORE_ENTRIES_PATH = "…";
/**
 * 按物理卷把根目录分组：同 deviceId 的根进同一组；探测失败的根各自成组。
 * 纯函数，组内根顺序与输入一致，组按 bytes 降序。
 */
export function groupStorageRootsByVolume(roots) {
    const groups = new Map();
    for (const root of roots) {
        const key = root.volume ? `dev:${root.volume.deviceId}` : `path:${root.path}`;
        const group = groups.get(key);
        if (group) {
            group.roots.push(root);
            group.bytes += root.bytes;
            continue;
        }
        groups.set(key, { key, volume: root.volume, roots: [root], bytes: root.bytes });
    }
    return [...groups.values()].sort((a, b) => b.bytes - a.bytes);
}
//# sourceMappingURL=storage.js.map