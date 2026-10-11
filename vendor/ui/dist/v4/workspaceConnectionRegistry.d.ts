import type { IZCodeAgentService } from "@zcode/services";
import { SessionDataLayer } from "@/v4/sessionDataLayer.js";
import type { ConversationTransport } from "@/v4/transport.js";
/** 注册表需要的 agentService 窄面（= conversation transport 的依赖面，便于测试注入）。 */
export type WorkspaceConnectionAgentService = Pick<IZCodeAgentService, "helloConversationV4" | "initializeConversationV4" | "subscribeConversationV4" | "resyncConversationV4" | "unsubscribeConversationV4" | "sendConversationCommandV4" | "queryConversationCommandsV4" | "conversationRowsRangeV4" | "conversationPlansV4" | "conversationWorkflowRunEventsV4" | "conversationWorkflowRunsV4" | "conversationWorkflowRunArtifactsV4" | "conversationWorkflowRunArtifactDataV4" | "conversationWorkflowRunArtifactReadV4" | "conversationWorkflowRunWorkspaceV4" | "conversationWorkflowRunNodeResultV4" | "conversationFileChangesV4" | "conversationFileRewindPreviewV4" | "attachmentBeginV4" | "attachmentChunkV4" | "attachmentCommitV4" | "attachmentAbortV4" | "attachmentPreviewSourceV4" | "attachmentReadV4" | "onDynamicConversationFrame" | "onDynamicLocalTtftFacts" | "onAgentRuntimeRestarted">;
export interface WorkspaceConnectionScope {
    /** = pane 绑定的 primary workspace（连接路由键）。 */
    workspacePath: string;
    workspaceIdentity?: string;
    /** endpoint 维度：remote shard 的 remoteSessionId；缺省 = 本机 __base__。 */
    remoteSessionId?: string;
}
/** pane 持有的连接租约；release 幂等。 */
/**
 * useSavedWorkflowLauncher 的推断返回类型包含 lease，声明生成要求保留可命名的导出。
 * @lintignore
 */
export interface WorkspaceConnectionLease {
    readonly layer: SessionDataLayer;
    readonly transport: ConversationTransport;
    /** React commit 后激活本租约携带的远程 service；本地租约为 no-op。 */
    activateRemoteService(): void;
    release(): void;
}
/** 本机 endpoint 的保留键（与 sessionsIndexRegistry / task list shardKey 口径一致）。 */
export declare const LOCAL_WORKSPACE_CONNECTION_ENDPOINT = "__base__";
/** 引用归零后延迟释放窗口（ms）；与 SessionDataLayer keep-warm 同标度。 */
export declare const WORKSPACE_CONNECTION_KEEP_WARM_MS = 30000;
/** 注册表条目键 = endpoint + workspaceKey（同 workspaceKey 不同 endpoint 不共用）。 */
export declare function buildWorkspaceConnectionKey(scope: WorkspaceConnectionScope): string;
/**
 * 取/建某 endpoint+workspace 的共享 conversation 连接，refCount++。
 * agentService 由调用方（V4PaneConversationProvider 经 useWorkspaceServicesResolution）解析；
 * 调用方只在 local-ready / remote-ready 时进入本层。remote-waiting 不会拿断连代理
 * 创建 registry entry，同时仍禁止回落 base services 或为 pane 另起独立 runtime。
 */
export declare function acquireWorkspaceConnection(scope: WorkspaceConnectionScope, agentService: WorkspaceConnectionAgentService, createLocalMediaPreviewUrl?: (path: string) => string): WorkspaceConnectionLease;
/** 仅测试/诊断用：当前注册的连接条目数（不含已换代失效、待存量租约释放的旧条目）。 */
export declare function workspaceConnectionRegistrySize(): number;
//# sourceMappingURL=workspaceConnectionRegistry.d.ts.map