import type { PaneSplitSide } from "@/v4/paneLayoutTree.js";
export declare const WORKBENCH_SESSION_DRAG_MIME = "application/x-zcode-session";
export interface WorkbenchSessionDragPayload {
    readonly kind: "zcode/session";
    readonly workspacePath: string;
    readonly workspaceIdentity?: string;
    readonly remoteSessionId?: string;
    readonly sessionId: string;
}
interface DataTransferLike {
    readonly types?: Iterable<string> | ArrayLike<string>;
    getData(type: string): string;
}
interface RectLike {
    readonly left: number;
    readonly top: number;
    readonly width: number;
    readonly height: number;
}
export declare function serializeWorkbenchSessionDragPayload(payload: WorkbenchSessionDragPayload): string;
export declare function setActiveWorkbenchSessionDragPayload(payload: WorkbenchSessionDragPayload): void;
export declare function clearActiveWorkbenchSessionDragPayload(): void;
export declare function parseWorkbenchSessionDragPayload(dataTransfer: DataTransferLike): WorkbenchSessionDragPayload | null;
export declare function resolveWorkbenchDropSide(rect: RectLike, clientX: number, clientY: number): PaneSplitSide | null;
export {};
//# sourceMappingURL=workbenchDragDrop.d.ts.map