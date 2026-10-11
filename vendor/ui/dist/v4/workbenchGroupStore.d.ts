import type { ZCodeTaskClientMode } from "@zcode/shared";
import { type PaneLayoutSnapshot, type PaneLayoutNode, type PaneSplitSide, type PaneWorkspaceScope } from "@/v4/paneLayoutTree.js";
export declare const WORKBENCH_GROUP_STORAGE_KEY = "zcode-v4-session-workbench-groups:v1";
export interface WorkbenchSessionBinding {
    readonly workspaceScope: PaneWorkspaceScope;
    readonly sessionId: string;
    /** subagent 行内侧开的 child session 只读，不渲染 composer/input。 */
    readonly readOnly?: boolean;
    /** 从持久化恢复、尚未经当前 scope sessions-index 验证。只存在于内存态。 */
    readonly restoredUnvalidated?: boolean;
}
export interface WorkbenchGroup {
    readonly id: string;
    readonly primaryBinding: WorkbenchSessionBinding;
    readonly root: PaneLayoutNode;
    readonly panes: Readonly<Record<string, WorkbenchSessionBinding>>;
    readonly focusedPaneId: string;
    readonly updatedAt: number;
}
export interface WorkbenchGroupSnapshot {
    readonly activeGroupId: string | null;
    readonly groups: Readonly<Record<string, WorkbenchGroup>>;
    readonly sessionIndex: Readonly<Record<string, string>>;
}
export interface WorkbenchGroupStore extends WorkbenchGroupSnapshot {
    configureClientMode: (clientMode: ZCodeTaskClientMode) => void;
    openSessionFromSidebar: (binding: WorkbenchSessionBinding) => void;
    splitSessionIntoGroup: (anchorPaneId: string, side: PaneSplitSide, binding: WorkbenchSessionBinding, fallbackPrimaryBinding?: WorkbenchSessionBinding) => void;
    promotePaneLayoutToGroup: (primaryBinding: WorkbenchSessionBinding, layout: PaneLayoutSnapshot) => boolean;
    focusPane: (groupId: string, paneId: string) => void;
    closePane: (groupId: string, paneId: string) => void;
    confirmRestoredPaneSession: (groupId: string, paneId: string) => void;
    bindPaneSession: (groupId: string, paneId: string, sessionId: string) => void;
    setSplitRatio: (groupId: string, splitId: string, ratio: number) => void;
    isSessionGrouped: (scope: PaneWorkspaceScope, sessionId: string | null | undefined) => boolean;
    getActiveContext: () => WorkbenchSessionBinding | null;
    deactivateActiveGroup: () => void;
    resetWorkbenchGroups: () => void;
}
export declare const INITIAL_WORKBENCH_GROUP_STATE: WorkbenchGroupSnapshot;
export declare function buildWorkbenchSessionKey(scope: PaneWorkspaceScope, sessionId: string): string;
export declare function selectWorkbenchGroupPaneBinding(group: WorkbenchGroup, paneId: string): WorkbenchSessionBinding | null;
export declare function selectWorkbenchGroupActiveBinding(group: WorkbenchGroup): WorkbenchSessionBinding | null;
export declare function createWorkbenchGroupFromSessions(primary: WorkbenchSessionBinding, added: WorkbenchSessionBinding, side: PaneSplitSide, options?: {
    readonly id?: string;
    readonly updatedAt?: number;
}): WorkbenchGroup;
export declare function focusWorkbenchGroupPane(group: WorkbenchGroup, paneId: string, updatedAt?: number): WorkbenchGroup;
export declare function splitWorkbenchGroupPane(group: WorkbenchGroup, anchorPaneId: string, side: PaneSplitSide, binding: WorkbenchSessionBinding, updatedAt?: number): WorkbenchGroup;
export declare function closeWorkbenchGroupPane(group: WorkbenchGroup, paneId: string, updatedAt?: number): WorkbenchGroup | null;
export declare function confirmRestoredWorkbenchGroupPane(group: WorkbenchGroup, paneId: string): WorkbenchGroup;
export declare function persistWorkbenchGroups(snapshot: WorkbenchGroupSnapshot): void;
export declare function readPersistedWorkbenchGroups(): WorkbenchGroupSnapshot | null;
export declare const useWorkbenchGroupStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorkbenchGroupStore>>;
//# sourceMappingURL=workbenchGroupStore.d.ts.map