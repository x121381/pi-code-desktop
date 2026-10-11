import type { IZCodeAgentService } from "@zcode/services";
import type { ConversationTransport } from "@/v4/transport.js";
export interface AgentConversationTransportTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    /** Desktop 本地媒体协议 URL；Web/remote 不注入，因此保持分片读取。 */
    createLocalMediaPreviewUrl?: (path: string) => string;
}
type ConversationV4AgentService = Pick<IZCodeAgentService, "subscribeConversationV4" | "resyncConversationV4" | "helloConversationV4" | "initializeConversationV4" | "unsubscribeConversationV4" | "sendConversationCommandV4" | "queryConversationCommandsV4" | "conversationRowsRangeV4" | "conversationPlansV4" | "conversationWorkflowRunEventsV4" | "conversationWorkflowRunsV4" | "conversationWorkflowRunArtifactsV4" | "conversationWorkflowRunArtifactDataV4" | "conversationWorkflowRunArtifactReadV4" | "conversationWorkflowRunWorkspaceV4" | "conversationWorkflowRunNodeResultV4" | "conversationFileChangesV4" | "conversationFileRewindPreviewV4" | "attachmentBeginV4" | "attachmentChunkV4" | "attachmentCommitV4" | "attachmentAbortV4" | "attachmentPreviewSourceV4" | "attachmentReadV4" | "onDynamicConversationFrame" | "onDynamicLocalTtftFacts" | "onAgentRuntimeRestarted"> & Partial<Pick<IZCodeAgentService, "onAgentRuntimeLifecycle">>;
/**
 * 一条 host 连接（= 一个 workspace）上的 v4 conversation 传输面。
 * connectionId 由 host 侧补齐；这里只负责 workspace 定位与帧监听生命周期。
 */
export declare function createAgentConversationTransport(agentService: ConversationV4AgentService, target: AgentConversationTransportTarget): ConversationTransport;
export {};
//# sourceMappingURL=agentConversationTransport.d.ts.map