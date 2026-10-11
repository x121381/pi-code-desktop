import type { GitCheckpointMeta } from "@zcode/shared";
export declare class GitCheckpointStore {
    private readonly options?;
    constructor(options?: {
        rootDir?: string;
    } | undefined);
    private readonly writeChains;
    private get checkpointsDir();
    private checkpointDir;
    private checkpointFilePath;
    private waitForPendingWrite;
    private enqueueWrite;
    private writeManifestAtomic;
    save(meta: GitCheckpointMeta): Promise<void>;
    load(workspacePath: string, checkpointId: string): Promise<GitCheckpointMeta | null>;
    delete(workspacePath: string, checkpointId: string): Promise<void>;
}
//# sourceMappingURL=gitCheckpointStore.d.ts.map