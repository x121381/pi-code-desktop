import { logger } from "@/logger.js";
import { unpackWorkspaceFileEntries } from "@zcode/shared/workspaceFileEntriesCodec";
import { filterWorkspaceFileSearchCandidates, mapWorkspaceFileEntriesToSearchCandidates, } from "./workspaceFileSearch.js";
export function createSyncWorkspaceFileSearchFilterBackend() {
    let candidates = [];
    let byId = new Map();
    return {
        setPacked(packed, rootPath) {
            const entries = unpackWorkspaceFileEntries(packed, rootPath);
            candidates = mapWorkspaceFileEntriesToSearchCandidates(entries);
            byId = new Map(entries.map((entry) => [entry.relativePath, entry]));
        },
        filter(query, options) {
            return Promise.resolve(filterWorkspaceFileSearchCandidates(candidates, query, options)
                .map((candidate) => byId.get(candidate.id) ?? null)
                .filter((entry) => entry !== null));
        },
        dispose() {
            candidates = [];
            byId = new Map();
        },
    };
}
export function createWorkerWorkspaceFileSearchFilterBackend() {
    // Node 测试环境（vitest node project）没有 module worker 运行时，直接走同步路径；
    // jsdom 等有 document 但 Worker 未实现的环境由下方 try/catch 兜底降级。
    if (typeof document === "undefined") {
        return createSyncWorkspaceFileSearchFilterBackend();
    }
    let worker;
    try {
        worker = new Worker(new URL("./workspaceFileSearchFilter.worker.ts", import.meta.url), {
            type: "module",
            name: "zcode-workspace-file-search",
        });
    }
    catch (error) {
        // 降级路径：非常老的事件循环/测试环境不支持 module worker 时回退同步打分。
        logger.warn("[workspace-file-search] Worker 创建失败，回退主线程同步过滤", {
            error: error instanceof Error ? error.message : String(error),
        });
        return createSyncWorkspaceFileSearchFilterBackend();
    }
    let seq = 0;
    const pending = new Map();
    worker.onmessage = (event) => {
        const data = event.data;
        if (data.type !== "result" || typeof data.seq !== "number") {
            return;
        }
        const waiter = pending.get(data.seq);
        if (!waiter) {
            return;
        }
        pending.delete(data.seq);
        waiter.resolve(Array.isArray(data.entries) ? data.entries : null);
    };
    worker.onerror = (event) => {
        // 运行期失败：让所有在途请求过期（null），后续 filter 仍会重试；
        // 持续失败由调用方通过空结果感知，不影响输入。
        logger.warn("[workspace-file-search] Worker 运行失败，本轮过滤结果丢弃", {
            message: event.message,
        });
        for (const [, waiter] of pending) {
            waiter.resolve(null);
        }
        pending.clear();
    };
    return {
        setPacked(packed, rootPath) {
            seq += 1;
            for (const [, waiter] of pending) {
                waiter.resolve(null);
            }
            pending.clear();
            // packed 由 Host 侧 listWorkspaceFiles 直接产出（RPC 返回字符串，memcpy 级传输），
            // renderer 全程不构建 entries 对象——37 万条实测省去 11-14s 结构化克隆。
            worker.postMessage({ type: "entries", packed, rootPath });
        },
        filter(query, options) {
            seq += 1;
            const currentSeq = seq;
            return new Promise((resolve) => {
                pending.set(currentSeq, { resolve });
                worker.postMessage({
                    type: "filter",
                    seq: currentSeq,
                    query,
                    options,
                });
            });
        },
        dispose() {
            seq += 1;
            for (const [, waiter] of pending) {
                waiter.resolve(null);
            }
            pending.clear();
            worker.terminate();
        },
    };
}
//# sourceMappingURL=workspaceFileSearchFilterBackend.js.map