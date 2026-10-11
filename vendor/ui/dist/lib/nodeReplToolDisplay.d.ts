import type { TaskChatToolCall as ChatToolCall } from "@/lib/taskChatMessageTypes.js";
export type NodeReplOperation = "run" | "reset" | "add-module-dir";
export interface NodeReplDisplayImage {
    base64: string;
    mimeType: string;
}
export interface NodeReplDisplayError {
    summary: string;
    stack?: string;
}
export interface NodeReplPersistedResult {
    artifactPath: string;
    sizeLabel: string;
}
/** 本次 cell 操作的目标应用（Computer Use）；由 CLI 的 node_repl display 携带。 */
export interface NodeReplCuaApp {
    appKey: string;
    displayName?: string;
}
export interface NodeReplDisplayModel {
    operation: NodeReplOperation;
    userTitle?: string;
    code?: string;
    moduleDirectory?: string;
    resultText?: string;
    error?: NodeReplDisplayError;
    images: NodeReplDisplayImage[];
    persistedResult?: NodeReplPersistedResult;
    displaySource?: "browser_turn_end";
    app?: NodeReplCuaApp;
}
export declare function buildNodeReplDisplayModel(toolCall: ChatToolCall): NodeReplDisplayModel;
//# sourceMappingURL=nodeReplToolDisplay.d.ts.map