import { type WhiteboardDocument, type WhiteboardStroke } from "@/lib/whiteboard.js";
interface WhiteboardWorkspaceState {
    boardIds: string[];
    boardsById: Record<string, WhiteboardDocument>;
}
interface WhiteboardStoreState {
    workspaces: Record<string, WhiteboardWorkspaceState>;
    createBoard: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        defaultNamePrefix: string;
    }) => WhiteboardDocument;
    renameBoard: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
        name: string;
    }) => void;
    addStroke: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
        stroke: WhiteboardStroke;
    }) => void;
    undoStroke: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
    }) => void;
    redoStroke: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
    }) => void;
    clearBoard: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
    }) => void;
    getBoard: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        boardId: string;
    }) => WhiteboardDocument | null;
}
export declare const useWhiteboardStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WhiteboardStoreState>>;
type WhiteboardStoreE2EBridge = typeof useWhiteboardStore;
declare global {
    interface Window {
        __whiteboardStoreE2E?: WhiteboardStoreE2EBridge;
    }
}
export {};
//# sourceMappingURL=whiteboardStore.d.ts.map