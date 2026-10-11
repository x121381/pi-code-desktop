import type { WorkspaceFileEntry } from "@zcode/shared";
/**
 * Safety-net cap for virtualized display. Large enough to never feel
 * "incomplete" to users, small enough to keep fuzzy-sort and virtualizer
 * memory in check for enormous monorepos.
 */
export declare const WORKSPACE_FILE_SEARCH_DISPLAY_CAP = 1000;
export interface WorkspaceFileSearchCandidate {
    id: string;
    name: string;
    path: string;
    relativePath: string;
    type: WorkspaceFileEntry["type"];
    /**
     * 预计算的小写形式：打分热路径不再对每条候选反复 toLowerCase。
     * 放开 node_modules 后候选基数可达数十万，
     * 每键 3-4 次全串 toLowerCase 是卡顿主因之一；索引构建时一次性归一化。
     */
    lowercaseName: string;
    lowercaseRelativePath: string;
    lowercasePath: string;
}
export interface FilterWorkspaceFileSearchCandidatesOptions {
    limit?: number;
    requireQuery?: boolean;
}
export declare function hasWorkspaceFileSearchQuery(query: string): boolean;
export declare function mapWorkspaceFileEntriesToSearchCandidates(entries: WorkspaceFileEntry[]): WorkspaceFileSearchCandidate[];
export declare function scoreWorkspaceFileFuzzyMatch(text: string, query: string): number | null;
export declare function getWorkspaceFileSearchCandidateScore(candidate: WorkspaceFileSearchCandidate, query: string): number | null;
export declare function filterWorkspaceFileSearchCandidates(candidates: WorkspaceFileSearchCandidate[], query: string, options?: FilterWorkspaceFileSearchCandidatesOptions): WorkspaceFileSearchCandidate[];
//# sourceMappingURL=workspaceFileSearch.d.ts.map