import { createHash } from "node:crypto";
import { chmod, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { acquireFileLock } from "./atomicFileLock.js";
const DEFAULT_LOCK_RETRY_DELAYS_MS = [25, 50, 100, 200, 400];
const DEFAULT_LOCK_OWNERLESS_GRACE_MS = 100;
const DEFAULT_LOCK_MAX_WAIT_MS = 8_000;
const DEFAULT_RENAME_RETRY_DELAYS_MS = [50, 100, 200, 400, 800];
const processFileLockTails = new Map();
function getErrorCode(error) {
    if (typeof error !== "object" || error === null || !("code" in error)) {
        return undefined;
    }
    const code = error.code;
    return typeof code === "string" ? code : undefined;
}
function isRetryableRenameError(error) {
    const code = getErrorCode(error);
    return code === "EPERM" || code === "EBUSY" || code === "EACCES";
}
async function renameWithRetry(tempFile, filePath, retryDelaysMs) {
    for (let attempt = 0;; attempt += 1) {
        try {
            await rename(tempFile, filePath);
            return;
        }
        catch (error) {
            const delayMs = retryDelaysMs[attempt];
            if (delayMs === undefined || !isRetryableRenameError(error)) {
                throw error;
            }
            await sleep(delayMs);
        }
    }
}
export async function withFileLock(filePath, operation, options = {}) {
    // 同一进程几十个 caller 同时轮询目录锁会形成惊群，后排请求可能在
    // 很短的实际写入之后仍撞上 8 秒超时。先做进程内 FIFO，每个进程只让队首竞争 OS 锁。
    const previousTail = processFileLockTails.get(filePath) ?? Promise.resolve();
    let releaseProcessQueue;
    const currentTail = new Promise((resolve) => {
        releaseProcessQueue = resolve;
    });
    processFileLockTails.set(filePath, currentTail);
    await previousTail;
    let releaseLock;
    try {
        await mkdir(dirname(filePath), { recursive: true });
        releaseLock = await acquireFileLock(filePath, options.lockRetryDelaysMs ?? DEFAULT_LOCK_RETRY_DELAYS_MS, options.lockOwnerlessGraceMs ?? DEFAULT_LOCK_OWNERLESS_GRACE_MS, options.lockMaxWaitMs ?? DEFAULT_LOCK_MAX_WAIT_MS);
        return await operation();
    }
    finally {
        try {
            await releaseLock?.();
        }
        finally {
            releaseProcessQueue();
            if (processFileLockTails.get(filePath) === currentTail) {
                processFileLockTails.delete(filePath);
            }
        }
    }
}
export async function atomicWritePrivateTextFile(filePath, content, renameRetryDelaysMs = DEFAULT_RENAME_RETRY_DELAYS_MS) {
    const directory = dirname(filePath);
    const tempPath = join(directory, `.${basename(filePath)}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`);
    await mkdir(directory, { recursive: true });
    try {
        await writeFile(tempPath, content, { encoding: "utf-8", mode: 0o600 });
        await renameWithRetry(tempPath, filePath, renameRetryDelaysMs);
    }
    catch (error) {
        await rm(tempPath, { force: true }).catch(() => undefined);
        throw error;
    }
}
export async function backupCorruptFile(filePath) {
    const content = await readFile(filePath);
    const contentId = createHash("sha256").update(content).digest("hex").slice(0, 24);
    const backupPath = `${filePath}.corrupt-${contentId}.bak`;
    try {
        // 同一损坏凭据会被 Desktop、CLI 和重试循环反复读取。按内容确定备份名并
        // 排他创建，让失败路径稳定收敛到一份证据，同时避免 copyFile 继承历史宽松权限。
        await writeFile(backupPath, content, { flag: "wx", mode: 0o600 });
    }
    catch (error) {
        if (getErrorCode(error) !== "EEXIST")
            throw error;
    }
    await chmod(backupPath, 0o600);
    return backupPath;
}
//# sourceMappingURL=privateFilePersistence.js.map