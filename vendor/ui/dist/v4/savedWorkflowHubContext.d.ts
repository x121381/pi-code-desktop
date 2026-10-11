import { type ReactNode } from "react";
import type { ZCodeSavedWorkflowScope } from "@zcode/shared";
import type { SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
export interface SavedWorkflowHubTarget {
    name: string;
    scope: ZCodeSavedWorkflowScope;
    /** 项目档所属的项目；全局档忽略它（中枢的全局组不按项目分）。 */
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface SavedWorkflowHubHandlers {
    openWorkflow: (target: SavedWorkflowHubTarget) => void;
    navigateToRun: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
}
export declare function SavedWorkflowHubProvider({ children, navigateToRun, openWorkflow, }: SavedWorkflowHubHandlers & {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useSavedWorkflowHub(): SavedWorkflowHubHandlers | null;
//# sourceMappingURL=savedWorkflowHubContext.d.ts.map