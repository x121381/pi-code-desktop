import type { MutableRefObject } from "react";
import type { LexicalChatInputHandle } from "@/LexicalChatInput.js";
import { type WorkspaceFileDragPayload } from "@/lib/workspaceFileDrag.js";
export declare function appendWorkspaceFileMentionToComposer(params: {
    inputApiRef: MutableRefObject<LexicalChatInputHandle | null>;
    currentMarkdown: string;
    payload: WorkspaceFileDragPayload;
    workspacePath: string;
    workspaceIdentity?: string;
    onTextChange: (text: string) => void;
}): string;
//# sourceMappingURL=workspaceFileComposer.d.ts.map