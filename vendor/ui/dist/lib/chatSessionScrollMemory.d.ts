export interface ChatSessionScrollMemoryState {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    wasPinnedToBottom?: boolean;
    updatedAt: number;
}
export declare const CHAT_SESSION_SCROLL_MEMORY_MAX_ENTRIES = 200;
export declare function buildChatSessionScrollMemoryKey({ workspacePath, workspaceIdentity, paneId, sessionId, taskId, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    paneId?: string;
    sessionId?: string | null;
    taskId?: string | null;
}): string | null;
export declare function migrateTaskScrollMemoryToSession({ workspacePath, workspaceIdentity, paneId, sessionId, taskId, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    paneId?: string;
    sessionId?: string | null;
    taskId?: string | null;
}): string | null;
export declare function readChatSessionScrollMemoryState(key: string | null): ChatSessionScrollMemoryState | null;
export declare function saveChatSessionScrollMemoryState(key: string | null, state: ChatSessionScrollMemoryState): void;
export declare function resolveChatSessionScrollRestoreTop(state: Pick<ChatSessionScrollMemoryState, "scrollTop">, metrics: Pick<HTMLElement, "clientHeight" | "scrollHeight">): number;
export declare function clearChatSessionScrollMemoryForTest(): void;
//# sourceMappingURL=chatSessionScrollMemory.d.ts.map