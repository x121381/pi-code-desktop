/**
 * 清理执行器：枚举候选（递归 / 非递归两种范围）与有界并发删除。
 * 删除后自底向上移除变空的目录，但保留 keepDirectories（类别顶层目录），写入方不必重新 mkdir。
 */
import { lstat, readdir, rm, rmdir } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";
import { normalizeStorageRelativePath } from "../domain/storageCatalog.js";
import { walkStorageRoot } from "./fsWalker.js";
const DELETE_CONCURRENCY = 8;
function errorCode(error) {
    return error && typeof error === "object" && "code" in error && typeof error.code === "string"
        ? error.code
        : "UNKNOWN";
}
async function listShallow(rootPath, prefix) {
    const directoryPath = join(rootPath, prefix);
    let names;
    try {
        names = await readdir(directoryPath);
    }
    catch {
        return [];
    }
    const candidates = [];
    for (const name of names) {
        try {
            const stats = await lstat(join(directoryPath, name));
            if (!stats.isFile())
                continue;
            candidates.push({
                relativePath: `${prefix}/${name}`,
                bytes: stats.size,
                mtimeMs: stats.mtimeMs,
            });
        }
        catch {
            // 枚举期间被删除的文件跳过即可
        }
    }
    return candidates;
}
async function listRecursive(rootPath, prefix) {
    const candidates = [];
    await walkStorageRoot({
        rootPath: join(rootPath, prefix),
        onEntry: (entry) => candidates.push({ ...entry, relativePath: `${prefix}/${entry.relativePath}` }),
    });
    return candidates;
}
async function pruneEmptyParents(rootPath, deletedRelativePaths, keepDirectories) {
    // 先处理最深的目录，父目录才有机会变空。
    const directories = new Set();
    for (const path of deletedRelativePaths) {
        let current = dirname(path);
        while (current && current !== "." && !keepDirectories.has(current)) {
            directories.add(current);
            current = dirname(current);
        }
    }
    const ordered = [...directories].sort((a, b) => b.split("/").length - a.split("/").length);
    for (const directory of ordered) {
        await rmdir(join(rootPath, directory)).catch(() => { });
    }
}
export function createFsStorageCleaner() {
    return {
        async listCandidates(rootPath, scopes) {
            const lists = await Promise.all(scopes.map((scope) => scope.recursive
                ? listRecursive(rootPath, scope.prefix)
                : listShallow(rootPath, scope.prefix)));
            // 递归范围与非递归范围可能重叠（cli/db/backup 与 cli/db），按路径去重。
            const byPath = new Map();
            for (const candidate of lists.flat()) {
                byPath.set(normalizeStorageRelativePath(candidate.relativePath), candidate);
            }
            return [...byPath.values()];
        },
        async deleteFiles(rootPath, targets, options) {
            const result = { deletedCount: 0, freedBytes: 0, failures: [] };
            const deleted = [];
            const queue = [...targets];
            const worker = async () => {
                for (let target = queue.shift(); target; target = queue.shift()) {
                    const relativePath = normalizeStorageRelativePath(target.relativePath);
                    const absolutePath = join(rootPath, relativePath);
                    const back = relative(rootPath, absolutePath);
                    if (back.startsWith("..") || back.split(sep).includes("..")) {
                        result.failures.push({ path: relativePath, code: "EOUTSIDE" });
                        continue;
                    }
                    try {
                        await rm(absolutePath, { force: false });
                        result.deletedCount += 1;
                        result.freedBytes += target.bytes;
                        deleted.push(relativePath);
                    }
                    catch (error) {
                        result.failures.push({ path: relativePath, code: errorCode(error) });
                    }
                }
            };
            await Promise.all(Array.from({ length: DELETE_CONCURRENCY }, worker));
            await pruneEmptyParents(rootPath, deleted, new Set(options.keepDirectories));
            return result;
        },
    };
}
//# sourceMappingURL=fsCleaner.js.map