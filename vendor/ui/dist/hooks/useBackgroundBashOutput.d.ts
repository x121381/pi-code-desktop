export interface BackgroundBashOutputTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sessionId: string;
    workId: string;
}
export declare function useBackgroundBashOutput(target: BackgroundBashOutputTarget, visible: boolean): {
    latest: {
        kind: "output";
        workId: string;
        status: "running" | "failed" | "cancelled" | "completed" | "timed_out" | "spawn_error";
        output: string;
        truncated: boolean;
        outputPath: string;
    } | null;
    display: {
        kind: "output";
        workId: string;
        status: "running" | "failed" | "cancelled" | "completed" | "timed_out" | "spawn_error";
        output: string;
        truncated: boolean;
        outputPath: string;
    } | null;
    error: string | null;
    refresh: () => void;
    following: boolean;
    pause: () => void;
    resume: () => void;
};
//# sourceMappingURL=useBackgroundBashOutput.d.ts.map