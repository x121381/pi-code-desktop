import type { ZCodeProvider } from "@zcode/shared";
interface TaskPathState {
    loading: boolean;
    path: string | null;
    exists: boolean;
}
interface TaskListItemContextActionsResult {
    taskSessionFile: TaskPathState;
    taskNativeSessionLogFile: TaskPathState;
    providerConfigFile: TaskPathState;
    fileManagerLabel: string;
    handleCopyText: (label: string, value: string | null) => Promise<void>;
    handleOpenTaskPathInFileManager: () => Promise<void>;
    handleOpenProviderConfig: () => Promise<void>;
}
export declare function resolveProviderConfigOpenTargetPath(path: string, exists: boolean): string;
export declare function useTaskListItemContextActions({ workspacePath, remoteSessionId, workspaceIdentity, taskId, provider, intl, loadTaskPaths, loadProviderConfig, }: {
    workspacePath: string;
    remoteSessionId?: string;
    workspaceIdentity?: string;
    taskId: string;
    provider?: ZCodeProvider;
    intl: {
        formatMessage: (desc: {
            id: string;
        }, values?: Record<string, string>) => string;
    };
    loadTaskPaths?: boolean;
    loadProviderConfig?: boolean;
}): TaskListItemContextActionsResult;
export {};
//# sourceMappingURL=useTaskListItemContextActions.d.ts.map