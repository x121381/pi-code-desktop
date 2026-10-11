export declare const WORKSPACE_FILE_DRAG_MIME = "application/x-zcode-workspace-file";
export declare const WORKSPACE_FILE_ADD_TO_CHAT_EVENT = "zcode:add-workspace-file-to-chat";
export declare const WORKSPACE_FILE_DRAG_STATE_EVENT = "zcode:workspace-file-drag-state";
export interface WorkspaceFileDragPayload {
    type: "file" | "directory";
    workspacePath: string;
    workspaceIdentity?: string;
    path: string;
    relativePath: string;
    name: string;
}
interface WorkspaceFileComposerMention {
    markdown: string;
    value: string;
    data: {
        kind: WorkspaceFileDragPayload["type"];
        path: string;
        relativePath: string;
    };
}
interface WorkspaceFileDragStateDetail {
    dragging: boolean;
}
export declare function serializeWorkspaceFileDragPayload(payload: WorkspaceFileDragPayload): string;
export declare function parseWorkspaceFileDragPayload(rawPayload: string | null | undefined): WorkspaceFileDragPayload | null;
export declare function readWorkspaceFileDragPayload(dataTransfer: DataTransfer): WorkspaceFileDragPayload | null;
export declare function hasWorkspaceFileDragPayload(dataTransfer: DataTransfer): boolean;
export declare function isWorkspaceFileDragStateEvent(event: Event): event is CustomEvent<WorkspaceFileDragStateDetail>;
export declare function dispatchWorkspaceFileDragState(dragging: boolean): void;
export declare function isWorkspaceFileAddToChatEvent(event: Event): event is CustomEvent<WorkspaceFileDragPayload>;
export declare function dispatchWorkspaceFileAddToChat(payload: WorkspaceFileDragPayload): boolean;
export declare function createWorkspaceFileComposerMention(payload: WorkspaceFileDragPayload, workspacePath: string, workspaceIdentity?: string): WorkspaceFileComposerMention;
export {};
//# sourceMappingURL=workspaceFileDrag.d.ts.map