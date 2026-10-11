import type { GitChangeSourceId } from "@zcode/shared";
export declare function useGitActions(options: {
    workspacePath: string;
}): {
    refreshVersion: number;
    refresh: (sourceId: GitChangeSourceId) => Promise<void>;
    stagePaths: (paths: string[]) => Promise<void>;
    unstagePaths: (paths: string[]) => Promise<void>;
    discardPaths: (paths: string[]) => Promise<void>;
    commit: (message: string) => Promise<void>;
};
//# sourceMappingURL=useGitActions.d.ts.map