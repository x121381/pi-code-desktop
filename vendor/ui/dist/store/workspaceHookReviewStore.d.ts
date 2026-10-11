import type { CommandAck, CommandEnvelope, WorkspaceHookReviewRequestPayload } from "@zcode/shared/zcode-protocol-v4";
export interface WorkspaceHookCommandBinding {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sendCommand(envelope: CommandEnvelope): Promise<CommandAck>;
    onCommandSettled?: (commandId: string) => void;
}
export interface WorkspaceHookReviewBinding {
    request: WorkspaceHookReviewRequestPayload;
    workspacePath: string;
    sendCommand(envelope: CommandEnvelope): Promise<CommandAck>;
    onCommandSettled?: (commandId: string) => void;
}
interface WorkspaceHookReviewState {
    bindings: Record<string, WorkspaceHookReviewBinding>;
    commandBindings: Record<string, WorkspaceHookCommandBinding>;
    connect(sessionId: string, binding: WorkspaceHookCommandBinding): void;
    disconnect(sessionId: string, sendCommand: WorkspaceHookCommandBinding["sendCommand"]): void;
    upsert(sessionId: string, binding: WorkspaceHookReviewBinding): void;
    clear(sessionId: string, interactionId?: string): void;
}
export declare const useWorkspaceHookReviewStore: import("zustand").UseBoundStore<import("zustand").StoreApi<WorkspaceHookReviewState>>;
export declare function findWorkspaceHookReviewBinding(bindings: Record<string, WorkspaceHookReviewBinding>, workspacePath?: string | null, workspaceIdentity?: string): WorkspaceHookReviewBinding | undefined;
/**
 * 查找能授权指定静态 Settings 行的精确 immutable review binding。
 *
 * Settings 的 trustState 只负责展示，绝不能直接成为 mutation authority；真正提交前必须
 * 同时匹配 workspace、bundle 和 opaque reviewItemId，避免等待期间跨 generation/bundle
 * 误用另一条 request。
 */
export declare function findWorkspaceHookReviewBindingForItem(bindings: Record<string, WorkspaceHookReviewBinding>, input: {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    bundleDigest: string;
    reviewItemId: string;
}): WorkspaceHookReviewBinding | undefined;
export declare function waitForWorkspaceHookReviewBindingForItem(input: {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    bundleDigest: string;
    reviewItemId: string;
}, timeoutMs: number): Promise<WorkspaceHookReviewBinding | undefined>;
export declare function findWorkspaceHookCommandBinding(bindings: Record<string, WorkspaceHookCommandBinding>, workspacePath?: string | null, workspaceIdentity?: string): WorkspaceHookCommandBinding | undefined;
export {};
//# sourceMappingURL=workspaceHookReviewStore.d.ts.map