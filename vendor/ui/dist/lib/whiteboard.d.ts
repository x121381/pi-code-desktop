export type WhiteboardTool = "pen" | "eraser";
export interface WhiteboardPoint {
    x: number;
    y: number;
}
export interface WhiteboardStroke {
    id: string;
    tool: WhiteboardTool;
    color: string;
    width: number;
    points: WhiteboardPoint[];
}
export interface WhiteboardDocument {
    id: string;
    name: string;
    width: number;
    height: number;
    strokes: WhiteboardStroke[];
    undoneStrokes: WhiteboardStroke[];
    createdAt: number;
    updatedAt: number;
}
export interface WhiteboardAddToChatPayload {
    workspacePath: string;
    workspaceIdentity?: string;
    boardId: string;
}
export declare const WHITEBOARD_DEFAULT_COLOR = "#111827";
export declare const WHITEBOARD_ADD_TO_CHAT_EVENT = "zcode:add-whiteboard-to-chat";
export declare function buildWhiteboardWorkspaceKey({ workspacePath, workspaceIdentity, }: {
    workspacePath: string;
    workspaceIdentity?: string;
}): string;
export declare function createWhiteboardDocument(params: {
    existingNames: readonly string[];
    defaultNamePrefix: string;
}): WhiteboardDocument;
export declare function createWhiteboardStroke(params: {
    tool: WhiteboardTool;
    color: string;
    width: number;
    points: WhiteboardPoint[];
}): WhiteboardStroke;
export declare function drawWhiteboardDocument(context: CanvasRenderingContext2D, board: Pick<WhiteboardDocument, "height" | "strokes" | "width">, options?: {
    backgroundColor?: string;
    draftStroke?: WhiteboardStroke | null;
    scale?: number;
}): void;
export declare function createWhiteboardPngFile(board: WhiteboardDocument): File;
export declare function isWhiteboardAddToChatEvent(event: Event): event is CustomEvent<WhiteboardAddToChatPayload>;
export declare function dispatchWhiteboardAddToChat(payload: WhiteboardAddToChatPayload): boolean;
//# sourceMappingURL=whiteboard.d.ts.map