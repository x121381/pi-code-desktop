import type { WorkspaceSidePaneTab } from "@/lib/workspaceSidePane.js";
export interface SidePaneTabPresentationLabels {
    browserTitle: string;
    reviewTitle: string;
    codeViewerTitle: string;
    treemappingTitle: string;
    whiteboardTitle: string;
    modelTrajectoryTitle: string;
    developerToolsTitle: string;
    browserPermissionsTitle: string;
    terminalTitle: string;
    subagentTypeLabel: string;
    subagentDirectoryTitle: string;
    selectionChatTitle: string;
    planTitle: string;
    workflowRunTitle: string;
    workflowDirectoryTitle: string;
    workflowActorTitle: string;
    workflowScriptTitle: string;
    workflowArtifactTitle: string;
}
export declare function getSidePaneTabSearchHint(tab: WorkspaceSidePaneTab): string;
export declare function getLocalizedSidePaneTabTitle(tab: WorkspaceSidePaneTab, labels: SidePaneTabPresentationLabels): string;
export declare function getSidePaneTabTypeLabel(tab: WorkspaceSidePaneTab, labels: SidePaneTabPresentationLabels): string;
//# sourceMappingURL=sidePaneTabPresentation.d.ts.map