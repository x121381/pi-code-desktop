/**
 * 数据根遍历器：异步、有界并发、可取消、不跟随符号链接。
 * 产出 (relativePath, bytes, mtimeMs)，分类与聚合由 domain 在调用方完成。
 * 每处理 yieldEvery 个条目让出一次事件循环，避免在 Worker/host 内长时间独占。
 */
import { lstat, opendir } from "node:fs/promises";
import { join, relative, sep } from "node:path";
export function createStorageAbortError() {
    return new DOMException("storage scan aborted", "AbortError");
}
function errorCode(error) {
    return error && typeof error === "object" && "code" in error && typeof error.code === "string"
        ? error.code
        : "UNKNOWN";
}
function toRelative(rootPath, absolutePath) {
    return relative(rootPath, absolutePath).split(sep).join("/");
}
export async function walkStorageRoot(options) {
    const { rootPath, onEntry, onError, signal } = options;
    const concurrency = Math.max(1, options.concurrency ?? 4);
    const yieldEvery = Math.max(1, options.yieldEvery ?? 256);
    const pending = [rootPath];
    const result = {
        directoriesScanned: 0,
        filesScanned: 0,
        missingRoot: false,
    };
    let processedSinceYield = 0;
    let active = 0;
    const throwIfAborted = () => {
        if (signal?.aborted)
            throw createStorageAbortError();
    };
    const maybeYield = async () => {
        processedSinceYield += 1;
        if (processedSinceYield >= yieldEvery) {
            processedSinceYield = 0;
            await new Promise((resolve) => setImmediate(resolve));
            throwIfAborted();
        }
    };
    const scanDirectory = async (directoryPath) => {
        throwIfAborted();
        let directory;
        try {
            directory = await opendir(directoryPath);
        }
        catch (error) {
            if (directoryPath === rootPath && errorCode(error) === "ENOENT") {
                result.missingRoot = true;
                return;
            }
            onError?.({ path: toRelative(rootPath, directoryPath), code: errorCode(error) });
            return;
        }
        result.directoriesScanned += 1;
        try {
            for await (const dirent of directory) {
                throwIfAborted();
                const entryPath = join(directoryPath, dirent.name);
                if (dirent.isSymbolicLink())
                    continue;
                if (dirent.isDirectory()) {
                    pending.push(entryPath);
                    continue;
                }
                if (!dirent.isFile())
                    continue;
                try {
                    const stats = await lstat(entryPath);
                    if (!stats.isFile())
                        continue;
                    result.filesScanned += 1;
                    onEntry({
                        relativePath: toRelative(rootPath, entryPath),
                        bytes: stats.size,
                        mtimeMs: stats.mtimeMs,
                    });
                }
                catch (error) {
                    // 扫描期间文件可能被日志轮转或 Agent 删除；ENOENT 属于正常竞态，不计为错误。
                    if (errorCode(error) !== "ENOENT") {
                        onError?.({ path: toRelative(rootPath, entryPath), code: errorCode(error) });
                    }
                }
                await maybeYield();
            }
        }
        finally {
            await directory.close().catch(() => { });
        }
    };
    // 有界并发：最多 concurrency 个目录同时打开；队列为空且无活动任务时结束。
    await new Promise((resolve, reject) => {
        let failed = false;
        const pump = () => {
            if (failed)
                return;
            if (pending.length === 0 && active === 0) {
                resolve();
                return;
            }
            while (active < concurrency && pending.length > 0) {
                const next = pending.pop();
                active += 1;
                scanDirectory(next)
                    .then(() => {
                    active -= 1;
                    pump();
                })
                    .catch((error) => {
                    failed = true;
                    reject(error);
                });
            }
        };
        pump();
    });
    return result;
}
//# sourceMappingURL=fsWalker.js.map