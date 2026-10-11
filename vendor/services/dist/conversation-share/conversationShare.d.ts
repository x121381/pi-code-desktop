import type { ConversationShareAccessMode, ConversationShareCapabilities, ConversationShareContinuation, ConversationSharePreview, ConversationShareRecord, Locale } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import { type Event } from "@zcode/rpc";
import type { ConversationShareClientErrorKind } from "./conversationShareHttpClient.js";
export type ConversationShareSelection = {
    kind: "all";
} | {
    kind: "productTurns";
    productTurnIds: string[];
} | {
    kind: "rowAnchors";
    rowIds: number[];
};
export interface PublishTextConversationInput {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sessionId: string;
    title: string;
    accessMode: ConversationShareAccessMode;
    selection: ConversationShareSelection;
    clientRequestId: string;
    disclosureAcceptedAt: number;
    /** 界面语言；决定返回的 share_url 落在中文站还是英文站。缺省不改写服务端下发的链接。 */
    locale?: Locale;
}
export interface ConversationSharePreflightInput {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sessionId: string;
    selection: ConversationShareSelection;
}
export interface ConversationShareAllowedArtifact {
    type: string;
    extensions: readonly string[];
    mimeTypes: readonly string[];
    displayName?: string;
}
export interface ConversationShareTurnPreflightResult {
    /** 已转换的公开行数；选择变化时可按轮重新聚合，不缓存整组选中项的容量错误。 */
    rowBudget?: {
        count: number;
        limit: number;
    };
    productTurnId: string;
    turnFingerprint?: string;
    blockingIssues: readonly ConversationShareFailureIssue[];
    skippableWarnings: readonly ConversationShareFailureIssue[];
    deferredIssues: readonly ConversationShareFailureIssue[];
}
export interface ConversationSharePreflightResult {
    revision: number;
    logEpoch: string;
    capabilitiesFingerprint: string;
    blockingIssues: readonly ConversationShareFailureIssue[];
    skippableWarnings: readonly ConversationShareFailureIssue[];
    deferredIssues: readonly ConversationShareFailureIssue[];
    supportedArtifactTypes: readonly ConversationShareAllowedArtifact[];
    turnResults: readonly ConversationShareTurnPreflightResult[];
}
export type ConversationShareServiceErrorKind = ConversationShareClientErrorKind | "artifact_protocol_not_ready" | "connection_unavailable" | "invalid_selection" | "safety_check_timeout";
export type ConversationShareFailureReasonCode = "running_turn" | "streaming_row" | "active_tool_call" | "active_subagent" | "input_attachment" | "input_attachment_unavailable" | "inline_tool_image" | "unsupported_timeline" | "unsafe_url" | "missing_product_turn" | "invalid_selection" | "artifact_type_not_allowed" | "artifact_extension_missing" | "artifact_outside_workspace" | "artifact_changed" | "artifact_read_failed" | "artifact_size_limit" | "artifact_manifest" | "payload_limit" | "no_shareable_content" | "stale_conversation" | "artifact_protocol_not_ready" | "invalid_conversation";
export type ConversationShareFailureIssueCode = ConversationShareFailureReasonCode | "rows_limit" | "artifact_count_limit" | "artifact_total_size_limit" | "payload_size_limit" | "upload_incomplete" | "unknown";
export interface ConversationShareFailureIssue {
    code: ConversationShareFailureIssueCode;
    scope: "conversation" | "turn" | "artifact" | "transport";
    rowId?: number;
    turnOrdinal?: number;
    /**
     * 问题所属的 product turn 身份。
     *
     * UI 的「取消选择该轮」曾用 turnOrdinal 去索引自己的 per-query 列表，
     * 而 turnOrdinal 是 service 按全部 turnHeader 编号的序号，两套编号在含系统上下文轮
     * 或多 steer query 的会话里必然错位，导致取消到别的轮次。轮次定位必须按身份，
     * turnOrdinal 只用于展示文案。
     */
    productTurnId?: string;
    artifactDisplayName?: string;
    artifactType?: string;
    extension?: string;
    mimeType?: string;
    actual?: number;
    limit?: number;
    retryAfterMs?: number;
    phase?: ConversationSharePublishProgress["phase"] | "downloading" | "installing" | "committing";
    allowedFormats?: readonly string[];
    allowedArtifacts?: readonly ConversationShareAllowedArtifact[];
    availability?: "not_found" | "permission_denied" | "connection_unavailable" | "changed" | "unknown";
}
export type ConversationShareFailureDiagnosticValue = string | number | boolean;
export type ConversationShareFailureDiagnostics = Readonly<Record<string, ConversationShareFailureDiagnosticValue>>;
export interface ConversationShareFailureDetails {
    requestId?: string;
    status?: number;
    code?: number;
    reasonCode?: ConversationShareFailureReasonCode;
    diagnostics?: ConversationShareFailureDiagnostics;
    issues?: readonly ConversationShareFailureIssue[];
    issueCount?: number;
    omittedIssueCount?: number;
    /** 仅用于 host 侧诊断的底层错误；绝不进入发给 Renderer 的 details。 */
    cause?: unknown;
}
/**
 * 把 issue 列表裁剪并清洗成可安全跨 RPC 的载荷，返回被省略的条数。
 * 非阻断 warning 与阻断 issue 共用同一套脱敏规则。
 */
export declare function sanitizeConversationShareIssues(issues: readonly ConversationShareFailureIssue[]): {
    issues: readonly ConversationShareFailureIssue[];
    issueCount: number;
    omittedIssueCount: number;
};
export declare class ConversationShareServiceError extends Error {
    readonly kind: ConversationShareServiceErrorKind;
    readonly requestId?: string;
    readonly status?: number;
    readonly code?: number;
    readonly reasonCode: ConversationShareFailureReasonCode;
    readonly diagnostics?: ConversationShareFailureDiagnostics;
    readonly issues?: readonly ConversationShareFailureIssue[];
    readonly issueCount: number;
    readonly omittedIssueCount: number;
    /** 通过现有 RPC details 字段传给 Renderer 的安全错误载荷。 */
    readonly details?: ConversationShareFailureDetails;
    constructor(kind: ConversationShareServiceErrorKind, message: string, details?: ConversationShareFailureDetails);
}
export interface ConversationSharePublishProgress {
    operationId: string;
    phase: "collecting" | "uploading" | "checking" | "complete";
    completedArtifacts: number;
    totalArtifacts: number;
    /**
     * 非阻断提示：发布照常继续，但这些结果物被跳过（例如正文引用的文件已不存在）。
     * 已过 sanitizeConversationShareIssues 脱敏，可安全跨 RPC。
     */
    warnings?: readonly ConversationShareFailureIssue[];
    omittedWarningCount?: number;
}
export interface ConversationShareImportProgress {
    operationId: string;
    phase: "downloading" | "installing" | "committing" | "complete";
    completedArtifacts: number;
    totalArtifacts: number;
}
export interface ImportConversationShareInput {
    shareCode: string;
    clientRequestId: string;
    /** 当前 renderer 捕获的目标；Deep Link 本身不得携带路径或 identity。 */
    targetWorkspacePath?: string;
    targetWorkspaceIdentity?: string;
    targetWorkspaceKind?: "local" | "remote";
    /** 界面语言；决定导入会话的标题前缀。回链本身固定存规范路径。 */
    locale?: Locale;
}
/** 导入时落盘的公开 rows 副本；会话里的只读块靠它渲染，不回源。 */
export interface ImportedConversationShare {
    shareId: string;
    contextId: string;
    title: string;
    rows: ConversationRow[];
    /**
     * 本端渲染不了、已跳过的行数（副本里有新 row kind，或 formatVersion 比本端新）。
     * >0 时只读块顶部必须出软提示，否则用户会以为内容丢了。
     */
    unsupportedRowCount: number;
    artifacts: Array<{
        artifactId: string;
        displayName: string;
        mimeType?: string;
        workspaceRelativePath?: string;
    }>;
}
export interface ImportConversationShareResult {
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    contextId: string;
    shareUrl: string;
    title: string;
    reused: boolean;
    fallbackReason?: "remote_workspace" | "default_workspace";
}
export interface IConversationShareService {
    getCapabilities(): Promise<ConversationShareCapabilities>;
    preflight(input: ConversationSharePreflightInput): Promise<ConversationSharePreflightResult>;
    publish(input: PublishTextConversationInput, operationId: string): Promise<ConversationShareRecord>;
    onDynamicPublishProgress(operationId: string): Event<ConversationSharePublishProgress>;
    importShare(input: ImportConversationShareInput, operationId: string): Promise<ImportConversationShareResult>;
    onDynamicImportProgress(operationId: string): Event<ConversationShareImportProgress>;
    /** 读取导入时落盘的公开 rows；找不到返回 null（会话里就不渲染只读块）。 */
    getImportedConversation(input: {
        workspacePath: string;
        contextId: string;
    }): Promise<ImportedConversationShare | null>;
    getPreview(shareCode: string): Promise<ConversationSharePreview>;
    getContinuation(input: {
        shareCode: string;
        clientRequestId: string;
    }): Promise<ConversationShareContinuation>;
}
export declare const IConversationShareService: import("../descriptors.js").ServiceDescriptor<IConversationShareService>;
/**
 * 分享能力不可用时的统一门禁实现。
 *
 * 每个不支持分享的宿主（desktop-attached remote、server remote 等）都要拒绝全部
 * 写操作并返回空事件流。手写会让 IConversationShareService 新增方法时漏改某个宿主，
 * 所以由这里集中生成。
 */
export declare function createUnsupportedConversationShareService(options: {
    message: string;
    /** 可选审计钩子：宿主想记录被拒绝的动作名时传入。 */
    onRejected?: (action: string) => void;
}): IConversationShareService;
//# sourceMappingURL=conversationShare.d.ts.map