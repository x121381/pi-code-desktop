import { type ReactNode } from "react";
import type { CommandAck, CommandEnvelope, V4AttachmentPutParams, V4AttachmentPutResult, V4ConversationFileChangesParams, V4ConversationFileChangesResult, V4ConversationFileRewindPreviewParams, V4ConversationFileRewindPreviewResult, V4ConversationWorkflowRunArtifactDataParams, V4ConversationWorkflowRunArtifactDataResult, V4ConversationWorkflowRunArtifactReadParams, V4ConversationWorkflowRunArtifactReadResult, V4ConversationWorkflowRunArtifactsParams, V4ConversationWorkflowRunArtifactsResult, V4ConversationWorkflowRunNodeResultParams, V4ConversationWorkflowRunNodeResultResult, V4ConversationWorkflowRunWorkspaceParams, V4ConversationWorkflowRunWorkspaceResult, V4ConversationWorkflowRunEventsParams, V4ConversationWorkflowRunsParams, V4ConversationWorkflowRunEventsResult, V4ConversationWorkflowRunsResult } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationAttachmentReadParams, ConversationTransport } from "@/v4/transport.js";
import type { PaneWorkspaceScope } from "@/v4/paneLayoutStore.js";
import { SessionDataLayer } from "@/v4/sessionDataLayer.js";
import type { AttachmentUploadOptions } from "@/v4/attachmentUploadTransaction.js";
export interface V4ConversationContextValue {
    layer: SessionDataLayer;
    sendCommand(envelope: CommandEnvelope): Promise<CommandAck>;
    fileChanges(params: V4ConversationFileChangesParams): Promise<V4ConversationFileChangesResult>;
    fileRewindPreview(params: V4ConversationFileRewindPreviewParams): Promise<V4ConversationFileRewindPreviewResult>;
    /** workflow run 事件日志分页（详情页审计面）；只读、无状态、超时重发安全。 */
    workflowRunEvents(params: V4ConversationWorkflowRunEventsParams): Promise<V4ConversationWorkflowRunEventsResult>;
    /** workflow run 枚举（journal-backed 的重启后发现面）。 */
    workflowRuns(params: V4ConversationWorkflowRunsParams): Promise<V4ConversationWorkflowRunsResult>;
    /**
     * workflow run 的**用户面产物**清单（冷恢复的 durable 读法）。⚠ 术语：artifact = 脚本经
     * `artifact.*` 发布给用户看的产出，不是 run 的顶层返回值。
     */
    workflowRunArtifacts(params: V4ConversationWorkflowRunArtifactsParams): Promise<V4ConversationWorkflowRunArtifactsResult>;
    /** 预置看板的条目分页（cursor = journal sequence）。 */
    workflowRunArtifactData(params: V4ConversationWorkflowRunArtifactDataParams): Promise<V4ConversationWorkflowRunArtifactDataResult>;
    /** 内容产物的字节，一次一块（≤ 512 KiB）；拼接归调用方的 hook。 */
    workflowRunArtifactRead(params: V4ConversationWorkflowRunArtifactReadParams): Promise<V4ConversationWorkflowRunArtifactReadResult>;
    /** dwf 脚本 transcript 的清单（files.* / git.* / world.run 行，不带正文）。 */
    workflowRunWorkspace(params: V4ConversationWorkflowRunWorkspaceParams): Promise<V4ConversationWorkflowRunWorkspaceResult>;
    /** 一个工作区节点的有界正文（展开时才取）。 */
    workflowRunNodeResult(params: V4ConversationWorkflowRunNodeResultParams): Promise<V4ConversationWorkflowRunNodeResultResult>;
    /** UI 高层 put 语义；transport 内部只走 begin/chunk/commit/abort。 */
    attachmentPut(params: V4AttachmentPutParams, options?: AttachmentUploadOptions): Promise<V4AttachmentPutResult>;
    attachmentRead(params: ConversationAttachmentReadParams): ReturnType<ConversationTransport["attachmentRead"]>;
    attachmentReadRange(params: Parameters<ConversationTransport["attachmentReadRange"]>[0]): ReturnType<ConversationTransport["attachmentReadRange"]>;
    onRuntimeRestart(listener: () => void): () => void;
    /**
     * 承载 transport 暴露 runtime 存活态时才存在（见 ConversationTransport.onRuntimeLifecycle）。
     * unavailable 在 workspace-dispose 当场到达，是草稿预热重建唯一可依赖的换代信号。
     */
    onRuntimeLifecycle?(listener: (state: "available" | "unavailable") => void): () => void;
}
export declare const V4ConversationContext: import("react").Context<V4ConversationContextValue | null>;
export interface V4ConversationProviderProps {
    workspacePath: string;
    workspaceIdentity?: string;
    children: ReactNode;
}
/** 每个 workspace 一条 host 连接 + 一个 SessionDataLayer。 */
export declare function V4ConversationProvider({ workspacePath, workspaceIdentity, children, }: V4ConversationProviderProps): import("react/jsx-runtime").JSX.Element | null;
export declare function useV4Conversation(): V4ConversationContextValue;
/**
 * 有没有会话上下文可用。给那些**可以**在没有会话的宿主里渲染的组件（静态渲染、回放、
 * 转录里的完成卡）决定要不要挂上取数的那一层——挂了就得有上下文，没有就画冷态。
 */
export declare function useHasV4Conversation(): boolean;
export interface V4PaneConversationProviderProps {
    /** pane 绑定的 primary workspace（连接路由键，docs/v4-split-pane-workbench.md）。 */
    scope: PaneWorkspaceScope;
    children: ReactNode;
}
/**
 * per-pane 数据面：连接从 workspaceConnectionRegistry 租用
 * （同 endpoint+workspaceKey 的 pane 共享一条 transport + SessionDataLayer，
 * refCount + 30s keep-warm），并把 pane 自己的 services 注入子树——附件上传、
 * sessions-index 守卫等 hook 用 pane 的 accessor，不误用 shell 当前 workspace 的。
 *
 * 远程目标在 session store 尚未注册真实 services 时保持 remote-waiting，不挂载子数据层，
 * 因而不会拿断连代理创建连接或发起订阅；同时绝不回落 base services，也不为 pane
 * 另起独立 runtime（远控保护约束）。重连 ready 后 services 换新引用 → 注册表保持
 * 原 layer/transport 身份，并在 commit 阶段单向激活最新 proxy。
 */
export declare function V4PaneConversationProvider({ scope, children }: V4PaneConversationProviderProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=V4ConversationContext.d.ts.map