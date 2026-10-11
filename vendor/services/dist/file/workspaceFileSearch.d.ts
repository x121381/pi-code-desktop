import type { WorkspaceFileEntry } from "@zcode/shared";
import { type WorkspaceFileSearchCandidate } from "@zcode/shared/workspaceFileSearch";
/** 分批解码已有 packed 索引，防止把 Renderer 的长任务简单搬到共享 Host。 */
export declare function buildHostFileSearchCandidates(packed: string, rootPath: string): Promise<WorkspaceFileSearchCandidate[]>;
export declare function searchHostFileCandidates(candidates: WorkspaceFileSearchCandidate[], query: string, limit: number): Promise<WorkspaceFileEntry[]>;
//# sourceMappingURL=workspaceFileSearch.d.ts.map