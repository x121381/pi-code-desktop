import { filterWorkspaceFileSearchCandidates, mapWorkspaceFileEntriesToSearchCandidates, } from "./workspaceFileSearch.js";
import { unpackWorkspaceFileEntries } from "@zcode/shared/workspaceFileEntriesCodec";
/**
 * 工作区文件搜索过滤 Worker：持有全量候选，收 query 在后台线程打分+top-K，
 * 回传映射回的 entry 列表（≤limit 条），避免数十万候选的打分与数据搬运阻塞主线程。
 * 逻辑完全复用主线程纯函数（workspaceFileSearch.ts），行为与降级路径一致；
 * entries 以列式打包字符串传输（见 backend 内注释）。
 */
let entries = [];
let candidates = [];
let byId = new Map();
self.onmessage = (event) => {
    const data = event.data;
    if (data.type === "entries" && typeof data.packed === "string") {
        entries = unpackWorkspaceFileEntries(data.packed, typeof data.rootPath === "string" ? data.rootPath : "");
        candidates = mapWorkspaceFileEntriesToSearchCandidates(entries);
        byId = new Map(entries.map((entry) => [entry.relativePath, entry]));
        return;
    }
    if (data.type === "filter" && typeof data.seq === "number" && typeof data.query === "string") {
        const result = filterWorkspaceFileSearchCandidates(candidates, data.query, data.options ?? {})
            .map((candidate) => byId.get(candidate.id) ?? null)
            .filter((entry) => entry !== null);
        self.postMessage({ type: "result", seq: data.seq, entries: result });
    }
};
//# sourceMappingURL=workspaceFileSearchFilter.worker.js.map