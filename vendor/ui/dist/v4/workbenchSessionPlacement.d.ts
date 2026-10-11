import { type PaneSplitSide, type PaneWorkspaceScope } from "@/v4/paneLayoutStore.js";
import { type WorkbenchSessionBinding } from "@/v4/workbenchGroupStore.js";
export interface WorkbenchSessionTarget extends PaneWorkspaceScope {
    readonly sessionId: string;
}
export interface WorkbenchSplitPlacementOptions {
    readonly mode: "context-menu" | "drag";
    readonly side: PaneSplitSide;
    readonly anchorPaneId?: string;
}
export declare function canPlaceWorkbenchSessionInSplit(shellBinding: WorkbenchSessionBinding | null, target: WorkbenchSessionTarget, options: WorkbenchSplitPlacementOptions): boolean;
export declare function placeWorkbenchSessionInSplit(shellBinding: WorkbenchSessionBinding | null, target: WorkbenchSessionTarget, options: WorkbenchSplitPlacementOptions): boolean;
export declare function selectWorkbenchSession(shellBinding: WorkbenchSessionBinding | null, target: WorkbenchSessionTarget): void;
//# sourceMappingURL=workbenchSessionPlacement.d.ts.map