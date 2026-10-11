import type { CommandPayloadMap, CommandType, WorkspaceHookReviewRequestPayload } from "@zcode/shared/zcode-protocol-v4";
import type { Hook } from "@zcode/shared";
import { type WorkspaceHookCommandBinding } from "@/store/workspaceHookReviewStore.js";
export declare function sendWorkspaceHookCommand<T extends CommandType>(binding: Pick<WorkspaceHookCommandBinding, "sendCommand" | "onCommandSettled">, sessionId: string, type: T, payload: CommandPayloadMap[T]): Promise<{
    accepted: boolean;
    reasonCode?: string;
}>;
export declare function toWorkspaceHookReviewCommandTarget(request: WorkspaceHookReviewRequestPayload): {
    workspaceIdentity: string;
    bundleDigest: string;
    reviewFlowId: string;
    generation: number;
    interactionId: string;
    remoteSessionId?: string | undefined;
    sessionId: string;
    taskId: string;
    runId: string;
};
/**
 * Settings 行内 Trust 的单次用户动作：已有精确 flow 时直接 respond；否则先通过当前
 * session command binding 请求 flow，再等待 Runtime 投影出的 immutable request。
 * 当前 session 的 immutable snapshot 无法审核 Settings bundle 时，转由 workspace
 * Agent authority 重新发现 canonical snapshot；UI 静态 snapshot 始终只提供 exact target。
 */
export declare function trustWorkspaceHookWithReview(input: {
    hook: Hook;
    workspacePath?: string | null;
    workspaceIdentity?: string;
    reviewWaitTimeoutMs?: number;
    grantWithoutSession?: (target: {
        workspacePath: string;
        workspaceIdentity?: string;
        bundleDigest: string;
        hookDeclarationDigest: string;
    }) => Promise<{
        accepted: boolean;
        reasonCode?: string;
    }>;
}): Promise<{
    accepted: boolean;
    reasonCode?: string;
}>;
//# sourceMappingURL=workspaceHookReviewCommands.d.ts.map