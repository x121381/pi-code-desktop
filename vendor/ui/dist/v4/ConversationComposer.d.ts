/**
 * v4 会话 composer（composer parity）。
 *
 * 壳：ChatPromptEditor（Lexical 编辑器 + 动作菜单 + 拖拽反馈 + sticky 底座视觉），
 * 附件预览网格/大图预览/错误提示区一并提供。
 *
 * 芯：全新 v4 wiring——
 * - 路由/状态一律读 v4 投影 snapshot.inputRouting / control / config / usage；
 * - 发送键状态机对齐旧 UI：canSend（有文本或附件+路由允许）/ pending spinner /
 *   running+空草稿 → Stop（v4 stop 命令）/ 暂停队列（choice）→ 发送后弹清空/保留确认框；
 * - 附件全链路见 useComposerAttachments（发送经 v4 sendText attachments）；
 * - mention（@ 文件/画板、# 会话、$ 技能）与 slash 目录全集在 LexicalChatInput 内接线；
 * - 草稿 per-session 持久化（composerDraftStore）+ prompt history（promptHistoryStorage）；
 * - 工具条（模型/思考深度/模式/context usage）见 V4ComposerToolbar。
 */
import { type ReactNode } from "react";
import { type HighspeedCardSnapshot, type PlanIdentitySnapshot, type ZCodeProvider } from "@zcode/shared";
import type { AttachmentRef, ConversationSnapshot, SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
import type { LexicalChatInputHandle } from "@/LexicalChatInput.js";
import type { AppSlashCommand } from "@/slashCommandHelpers.js";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
import type { ModelSelectionView } from "@zcode/services";
import type { ModelSelectionState } from "@/hooks/useModelSelectionView.js";
import type { ZCodeUiError } from "@/lib/zcodeUiError.js";
import { type V4ComposerDraft } from "@/v4/composer/composerDraftStore.js";
import type { ConversationDropTargetController } from "@/v4/composer/conversationDropTarget.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import { type ModelSelectionSource } from "@/v4/composer/V4ComposerToolbar.js";
import type { AttachmentPutFn } from "@/v4/composer/attachmentUpload.js";
import type { ConversationPromptTelemetrySeed } from "@/v4/telemetry/conversationTelemetrySupervisor.js";
import type { ComposerSubmissionConfig } from "@/v4/composer/composerSubmissionConfig.js";
export interface ConversationComposerSendOptions {
    /** 点击发送时复制的配置；null 表示未完成选择，Host 不得从 Session 补齐。 */
    submission?: ComposerSubmissionConfig | null;
    heldQueueDisposition?: "clearQueueAndSend" | "keepQueueAndSend";
    /** 发送确认框打开时看到的暂停队列 ID；CLI 用它拦截跨端增删竞态。 */
    expectedHeldQueueItemIds?: readonly string[];
    /** 附件命令面：已序列化附件（宿主转 AttachmentRef 后随 v4 sendText/createSession 发送）。 */
    attachments?: AttachmentRef[];
    /** Prompt 文本内携带的上下文附件数量；用于阻止 /goal 等本地命令误消费。 */
    contextAttachmentCount?: number;
    conversationQuotes?: import("@zcode/shared").ConversationSelectionText[];
    /** renderer-only：ACK accepted 后由 SessionPane 绑定真实 commandId/sessionId。 */
    telemetrySeed?: ConversationPromptTelemetrySeed;
    /** 本次 busy input 的一次性投递覆盖，不改 session 偏好。 */
    requestedDelivery?: "startNow" | "queue" | "guide";
    sharedContextRefs?: Array<{
        kind: "shared_context_import";
        context_id: string;
    }>;
    /** 插件 UI 代发：随 sendText 持久化，用户消息卡片显示"来自插件 X"。 */
    source?: import("@zcode/shared/zcode-protocol-v4").ConversationInputSource;
}
export type ConversationComposerSendResult = "sent" | "blocked" | "confirmationRequired";
export interface ExternalTextInsertRequest {
    requestId: number;
    text: string;
    mention?: ComposerMentionPrefill;
    mode?: "replace" | "prepend-if-missing";
}
export declare function restorePersistedComposerDraftIntoInput({ draft, inputApi, onEditorStateError, }: {
    draft: Pick<V4ComposerDraft, "editorStateJson" | "mention" | "text">;
    inputApi: Pick<LexicalChatInputHandle, "getMarkdown" | "setEditorStateJson" | "setMention" | "setText">;
    onEditorStateError?: (error: unknown) => void;
}): string;
export declare function applyExternalTextInsertRequestToComposer({ appliedRequestId, inputApi, request, requestFocus, scheduleDraftPersist, updateText, }: {
    appliedRequestId: number | null;
    inputApi: Pick<LexicalChatInputHandle, "getMarkdown" | "prependMentionIfMissing" | "setMention" | "setText" | "setTextWithPluginMentions"> | null;
    request: ExternalTextInsertRequest | null | undefined;
    requestFocus: () => void;
    scheduleDraftPersist: () => void;
    updateText: (text: string) => void;
}): number | null;
export interface ComposerRestoreRequest {
    requestId: number;
    sessionId: string;
    workspaceKey: string;
    inputKind: "sendText" | "sendGoalCommand";
    text: string;
    attachments: readonly AttachmentRef[];
    config?: Pick<V4ComposerDraft, "mode" | "planEnabled" | "modelSelection">;
}
export declare function applyComposerRestoreRequestToComposer({ appliedRequestId, currentSessionId, currentWorkspaceKey, hasDraftContent, inputApi, request, requestFocus, restoreSessionOwnedAttachments, restoreDraftConfig, scheduleDraftPersist, updateText, }: {
    appliedRequestId: number | null;
    currentSessionId: string | null;
    currentWorkspaceKey: string;
    hasDraftContent: boolean;
    inputApi: Pick<LexicalChatInputHandle, "setText"> | null;
    request: ComposerRestoreRequest | null | undefined;
    requestFocus: () => void;
    restoreSessionOwnedAttachments: (attachments: readonly AttachmentRef[]) => boolean;
    restoreDraftConfig?: (config: NonNullable<ComposerRestoreRequest["config"]>) => void;
    scheduleDraftPersist: () => void;
    updateText: (text: string) => void;
}): number | null;
export interface ConversationComposerProps {
    snapshot: ConversationSnapshot | null;
    /** 草稿 scope（sessionId；draft 态 null → "__draft__" scope）。 */
    sessionId?: string | null;
    /** Skill catalog authority；草稿预热完成后为 prewarmSessionId，不改变 task/draft 身份。 */
    skillCatalogSessionId?: string | null;
    /** draft 态无 snapshot，但仍可 createSession 首发。 */
    draftMode?: boolean;
    /** renderer 当前草稿配置意图；只在 draftMode 下覆盖迟到的 prewarm projection。 */
    draftConfig?: Partial<SessionConfigState>;
    /** SessionPane 注入的完整 Draft owner；生产路径不再由编辑器直接覆盖持久记录。 */
    composerDraft: V4ComposerDraft;
    updateComposerContent: (content: Pick<V4ComposerDraft, "text" | "editorStateJson" | "mention">) => void;
    replaceComposerDraft: (draft: Omit<V4ComposerDraft, "updatedAt">) => void;
    /** 当前 Composer 是否能构造完整 Submission；空模型或空 Reasoning 时为 false。 */
    submissionReady?: boolean;
    createSubmissionFromComposer?: () => ComposerSubmissionConfig | null;
    /** 仅供发送埋点冻结模型维度；包含草稿初始化 config 与显式 intent 的合并值。 */
    telemetryDraftConfig?: Partial<SessionConfigState>;
    /**
     * 空态 contextHeader（m5-composer-parity）：workspace 切换菜单 + Git 分支
     * 切换器，渲染在编辑器上方（旧 ChatViewComposer contextHeaderContent 同位）。
     * 仅草稿态由宿主下发；会话建立后为空。
     */
    contextHeader?: ReactNode;
    /** 居中草稿布局（旧 shouldUseCenteredDraftChatLayout）：收窄 max-w-2xl、去 sticky。 */
    centered?: boolean;
    /**
     * v4 bottom dock 阻塞交互 id。存在时 composer 只隐藏不卸载，保留草稿、附件与编辑器实例。
     */
    blockingRequestId?: string | null;
    disabled?: boolean;
    /** 当前 Task 可用的 Highspeed 卡；只影响静态标识和模型锁定。 */
    highspeedCard?: HighspeedCardSnapshot | null;
    /**
     * 发送路径 draw 新命中登记的一次性激活请求（值为 cardId）。
     * 命中当前卡时才播放激活动效，composer 锁定入场方式后经回调消费；切回、恢复与重挂载不重播。
     */
    highspeedActivationCardId?: string | null;
    onHighspeedActivationApplied?: (cardId: string) => void;
    /**
     * 是否在新建任务 / 切换会话 / 挂载后自动把光标聚焦到输入框（默认开）。
     * 竖切多 pane 时由宿主传入 SessionPane.focused，仅焦点 pane 聚焦、后台 pane 不抢焦点。
     */
    autoFocusEnabled?: boolean;
    /** 当前 composer 是否运行在手机 Web 远控壳中。 */
    isWebRemoteControl?: boolean;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    /** SessionPane 从目标 Host 原子读取的选择事实；Composer 不自行解析 Host。 */
    modelSelectionView?: ModelSelectionView | null;
    modelSelectionState?: ModelSelectionState;
    /** Model Selection 首次读取失败后的显式重试入口。 */
    modelSelectionReload?: () => void;
    /** 草稿态使用预热 session 作附件 transaction 载体。 */
    attachmentSessionId?: string | null;
    attachmentPut: AttachmentPutFn;
    onRuntimeRestart?: (listener: () => void) => () => void;
    /** 承载 transport 暴露 runtime 存活态时优先用它，替代 onRuntimeRestart。 */
    onRuntimeLifecycle?: (listener: (state: "available" | "unavailable") => void) => () => void;
    provider?: ZCodeProvider;
    /** 宿主 pane 与 workspace 遮罩共同裁决的真实可见性，仅用于 visible-only telemetry。 */
    telemetryVisible?: boolean;
    /** 点击发送时读取套餐身份；二次确认会继续复用同一份冻结 seed。 */
    readPlanIdentitySnapshot?: () => PlanIdentitySnapshot;
    onSendText: (text: string, options?: ConversationComposerSendOptions) => Promise<ConversationComposerSendResult | void>;
    /** 把当前输入文本上抛给父组件（editUserQuery 用 composer 文本作 newText）。 */
    onTextChange?: (text: string) => void;
    /** queue 撤回 admission 读取的完整 composer 占用态；附件包含上传中状态。 */
    onDraftStateChange?: (state: {
        hasContent: boolean;
        busy: boolean;
    }) => void;
    onStop: () => void;
    /** 目录选中模型（providerId/modelId）；thought/revision 由宿主从最新投影补齐。 */
    onSelectModel: (provider: string, model: string, sourceModel: ModelSelectionSource | null) => void;
    /** 选中思考深度；同时带上用户操作时看到的模型，避免异步回流后把 thought 归到另一模型。 */
    onSelectThought: (thought: string, modelContext: {
        provider: string;
        model: string;
    }) => void;
    onSwitchMode: (mode: string) => void;
    /** 打开当前 session 的 Status panel，并直达 Running 明细。 */
    onOpenRunningBackgroundWorks?: () => void;
    /**
     * 后台任务入口点击的落点：`"workflow-run"` = 唯一在跑的工作流直达详情页（宿主判定），
     * 缺省 `"panel"` = 展开状态胶囊。入口据此换 tooltip；行为本身在 onOpenRunningBackgroundWorks 里。
     */
    backgroundWorkOpenTarget?: "panel" | "workflow-run";
    runningSubagentCount?: number;
    /** prepare/configOptions 失败时，custom provider 选择走 workspace recovery 链。 */
    onRecoverCustomModelSelection?: (value: string, sourceModel: ModelSelectionSource | null) => Promise<void> | void;
    /** context usage 面板的 /compact 入口（宿主走 v4 compact 命令）。 */
    onSendCompressionCommand?: (command: string) => void;
    /** v4 会话级错误（snapshot.control.lastError），展示在输入框上方。 */
    error?: ZCodeUiError | null;
    onDismissError?: () => void;
    /** 无可用模型横幅的恢复动作；由 SessionPane 注入壳层导航，组件不直接操作 tab。 */
    onOpenModelSettings?: () => void;
    onOpenModelUpgrade?: () => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    /**
     * 是否监听全局「加入对话」事件（workspace file tree / 画板按钮）。
     * 分屏时仅 primary pane 监听，避免一次点击插入两份。
     */
    listenAddToChatEvents?: boolean;
    /**
     * 外部一次性文本预填请求（Example Prompt 等）。
     * requestId 保证同一文本可连续取回两次时仍能触发回填。
     */
    externalTextInsertRequest?: ExternalTextInsertRequest | null;
    onExternalTextInsertApplied?: (requestId: number) => void;
    /**
     * 队列“编辑”在 delete ACK 后把完整未来意图取回输入框。
     * requestId + session/workspace binding 保证幂等且不会串写其他 task。
     */
    composerRestoreRequest?: ComposerRestoreRequest | null;
    onComposerRestoreApplied?: (requestId: number) => void;
    /** 副屏会话不提供 goal 能力；协议层仍会拒绝直接调用。 */
    suppressGoalCommands?: boolean;
    /** App 层本地斜杠命令（如 `/side`），由 SessionPane 按门禁组装后透传。 */
    appSlashCommands?: readonly AppSlashCommand[];
    /** 把 composer 的 drop 路由暴露给整个对话 pane / 桌面草稿标题栏。 */
    onDropTargetControllerChange?: (controller: ConversationDropTargetController | null) => void;
}
declare function ConversationComposerImpl({ snapshot, sessionId, skillCatalogSessionId, draftMode, draftConfig, composerDraft, updateComposerContent, replaceComposerDraft, submissionReady, createSubmissionFromComposer, telemetryDraftConfig, contextHeader, centered, blockingRequestId, disabled, highspeedCard, highspeedActivationCardId, onHighspeedActivationApplied, autoFocusEnabled, isWebRemoteControl, workspacePath, workspaceIdentity, remoteSessionId, modelSelectionView, modelSelectionState, modelSelectionReload, attachmentSessionId, attachmentPut, onRuntimeRestart, onRuntimeLifecycle, provider, telemetryVisible, readPlanIdentitySnapshot, onSendText, onTextChange, onDraftStateChange, onStop, onSelectModel, onSelectThought, onSwitchMode, onOpenRunningBackgroundWorks, backgroundWorkOpenTarget, runningSubagentCount, onRecoverCustomModelSelection, onSendCompressionCommand, error, onDismissError, onOpenModelSettings, onOpenModelUpgrade, onOpenCodeViewer, listenAddToChatEvents, externalTextInsertRequest, onExternalTextInsertApplied, composerRestoreRequest, onComposerRestoreApplied, suppressGoalCommands, appSlashCommands, onDropTargetControllerChange, }: ConversationComposerProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationComposer: import("react").MemoExoticComponent<typeof ConversationComposerImpl>;
export {};
//# sourceMappingURL=ConversationComposer.d.ts.map