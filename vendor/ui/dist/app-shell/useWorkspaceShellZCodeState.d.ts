import { getWorkspaceDisplayedTaskState, type WorkspaceZCodeUIState } from "@/store/zcodeSessionStore.js";
type WorkspaceShellZCodeState = Pick<WorkspaceZCodeUIState, "activeTaskId" | "draftFocusVersion" | "modelSwitchPending" | "modelSwitchStage" | "selectedProvider" | "selectedSupplierKey" | "configOptions" | "optimisticTaskListByTaskId" | "workspaceInit"> & ReturnType<typeof getWorkspaceDisplayedTaskState>;
export declare function useWorkspaceShellZCodeState(workspaceAbsPath: string, workspaceIdentity?: string): {
    workspaceShellZCodeState: WorkspaceShellZCodeState;
    reloadSessionDisabled: boolean;
};
export {};
//# sourceMappingURL=useWorkspaceShellZCodeState.d.ts.map