import { setImmediate } from "node:timers/promises";
import { unpackWorkspaceFileEntries } from "@zcode/shared/workspaceFileEntriesCodec";
import { filterWorkspaceFileSearchCandidates, mapWorkspaceFileEntriesToSearchCandidates, } from "@zcode/shared/workspaceFileSearch";
/** 分批解码已有 packed 索引，防止把 Renderer 的长任务简单搬到共享 Host。 */
export async function buildHostFileSearchCandidates(packed, rootPath) {
    const candidates = [];
    for (let offset = 0; offset < packed.length;) {
        const newline = packed.indexOf("\n", offset + 128_000);
        const end = newline < 0 ? packed.length : newline + 1;
        const entries = unpackWorkspaceFileEntries(packed.slice(offset, end), rootPath);
        for (const candidate of mapWorkspaceFileEntriesToSearchCandidates(entries))
            candidates.push(candidate);
        offset = end;
        await setImmediate();
    }
    return candidates;
}
export async function searchHostFileCandidates(candidates, query, limit) {
    let best = [];
    // top-K 的输入按原索引顺序分批；同分时原序稳定，分批合并与整表排序一致。
    for (let offset = 0; offset < candidates.length; offset += 2048) {
        best = filterWorkspaceFileSearchCandidates([...best, ...candidates.slice(offset, offset + 2048)], query, { limit });
        await setImmediate();
    }
    return best.map(({ name, path, relativePath, type }) => ({ name, path, relativePath, type }));
}
//# sourceMappingURL=workspaceFileSearch.js.map