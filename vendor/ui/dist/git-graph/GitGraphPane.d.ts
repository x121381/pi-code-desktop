import { type GitGraphCommit } from "./layout.js";
export interface GitGraphPaneProps {
    commits: readonly GitGraphCommit[];
    hasMore?: boolean;
    loadingMore?: boolean;
    refreshing?: boolean;
    selectedCommitHash: string | null;
    onSelectCommit: (hash: string) => void;
    onLoadMore?: () => void;
    onRefresh?: () => void;
}
export declare function GitGraphPane({ commits, hasMore, loadingMore, refreshing, selectedCommitHash, onSelectCommit, onLoadMore, onRefresh, }: GitGraphPaneProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GitGraphPane.d.ts.map