import type { ZCodeProvider, ZCodeTaskMeta } from "@zcode/shared";
interface UseWorkspaceActiveTaskStateParams {
    workspaceAbsPath: string;
    activeTaskId: string | null;
    workspaceRemoteSessionId?: string | null;
    workspaceIdentity?: string;
    selectedProvider: ZCodeProvider;
    intl: {
        formatMessage(descriptor: {
            id: string;
        }): string;
    };
}
export declare function useStableResolvedActiveTaskMeta(taskMeta: ZCodeTaskMeta | null): ZCodeTaskMeta | null;
export declare function useWorkspaceActiveTaskState({ workspaceAbsPath, activeTaskId, workspaceRemoteSessionId, workspaceIdentity, selectedProvider, intl, }: UseWorkspaceActiveTaskStateParams): {
    activeTaskMeta: ZCodeTaskMeta | null;
    resolvedActiveTaskMeta: ZCodeTaskMeta | null;
    activeTraceId: string | null;
    activeSessionId: string | null;
    activeTaskProvider: "glm" | null;
    workspaceHeaderProvider: "glm";
    activeTaskChangeSummary: null;
    activeTaskTitle: string;
    taskNativeSessionLogFile: import("@/hooks/useTaskNativeSessionLogFile.js").TaskNativeSessionLogFileState;
    taskSessionFile: import("@/hooks/useTaskSessionFilePath.js").TaskSessionFilePathState;
};
export {};
//# sourceMappingURL=useWorkspaceActiveTaskState.d.ts.map