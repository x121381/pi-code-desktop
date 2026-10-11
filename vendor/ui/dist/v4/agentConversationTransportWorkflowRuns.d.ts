import type { IZCodeAgentService } from "@zcode/services";
import type { V4ConversationWorkflowRunArtifactDataParams, V4ConversationWorkflowRunArtifactDataResult, V4ConversationWorkflowRunArtifactReadParams, V4ConversationWorkflowRunArtifactReadResult, V4ConversationWorkflowRunArtifactsParams, V4ConversationWorkflowRunArtifactsResult, V4ConversationWorkflowRunEventsParams, V4ConversationWorkflowRunNodeResultParams, V4ConversationWorkflowRunNodeResultResult, V4ConversationWorkflowRunWorkspaceParams, V4ConversationWorkflowRunWorkspaceResult, V4ConversationWorkflowRunEventsResult, V4ConversationWorkflowRunsParams, V4ConversationWorkflowRunsResult } from "@zcode/shared/zcode-protocol-v4";
export declare function createWorkflowRunTransportMethods(input: {
    agentService: Pick<IZCodeAgentService, "conversationWorkflowRunEventsV4" | "conversationWorkflowRunsV4" | "conversationWorkflowRunArtifactsV4" | "conversationWorkflowRunArtifactDataV4" | "conversationWorkflowRunArtifactReadV4" | "conversationWorkflowRunWorkspaceV4" | "conversationWorkflowRunNodeResultV4">;
    ensureHandshake: () => Promise<unknown>;
    workspace: {
        workspacePath: string;
        workspaceIdentity?: string;
    };
}): {
    workflowRunEvents(params: V4ConversationWorkflowRunEventsParams): Promise<V4ConversationWorkflowRunEventsResult>;
    workflowRuns(params: V4ConversationWorkflowRunsParams): Promise<V4ConversationWorkflowRunsResult>;
    workflowRunArtifacts(params: V4ConversationWorkflowRunArtifactsParams): Promise<V4ConversationWorkflowRunArtifactsResult>;
    workflowRunArtifactData(params: V4ConversationWorkflowRunArtifactDataParams): Promise<V4ConversationWorkflowRunArtifactDataResult>;
    workflowRunArtifactRead(params: V4ConversationWorkflowRunArtifactReadParams): Promise<V4ConversationWorkflowRunArtifactReadResult>;
    workflowRunWorkspace(params: V4ConversationWorkflowRunWorkspaceParams): Promise<V4ConversationWorkflowRunWorkspaceResult>;
    workflowRunNodeResult(params: V4ConversationWorkflowRunNodeResultParams): Promise<V4ConversationWorkflowRunNodeResultResult>;
};
//# sourceMappingURL=agentConversationTransportWorkflowRuns.d.ts.map