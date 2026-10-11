interface FileChangeFindTarget {
    path: string;
    content: string | null | undefined;
}
interface FileChangeFindMatch {
    path: string;
    globalIndex: number;
    matchIndexInFile: number;
}
interface FileChangeFindState {
    matches: FileChangeFindMatch[];
    activeMatch: FileChangeFindMatch | null;
    currentIndex: number;
    total: number;
}
export declare function getFileChangeFindState(targets: readonly FileChangeFindTarget[], query: string, preferredIndex: number): FileChangeFindState;
export {};
//# sourceMappingURL=fileChangeFindSearch.d.ts.map