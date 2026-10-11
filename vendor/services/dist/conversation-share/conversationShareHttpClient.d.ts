import { type ApiClient, type ConversationShareApiErrorCode, type ConversationShareArtifactDescriptor, type ConversationShareArtifactUpload, type ConversationShareCapabilities, type ConversationShareConfirmRequest, type ConversationShareContinuation, type ConversationShareContinuationRequest, type ConversationSharePreparation, type ConversationSharePreparationRequest, type ConversationSharePreview, type ConversationShareRecord } from "@zcode/shared";
export type ConversationShareClientErrorKind = "authentication_required" | "feature_disabled" | "invalid_contract" | "invalid_conversation" | "disclosure_required" | "unsafe_structure" | "artifact_not_allowed" | "limit_exceeded" | "upload_incomplete" | "not_found" | "expired" | "import_not_allowed" | "rate_limited" | "network" | "safety_check_pending" | "unsupported_schema_version" | "unknown";
export declare class ConversationShareClientError extends Error {
    readonly kind: ConversationShareClientErrorKind;
    readonly status?: number;
    readonly code?: ConversationShareApiErrorCode;
    /** 服务端响应的请求 ID，用于和后端日志对账。 */
    readonly requestId?: string;
    /** 复用现有 RPC details 字段，把安全诊断信息传到 Renderer。 */
    readonly details?: {
        requestId?: string;
        clientRequestId?: string;
        status?: number;
        code?: number;
    };
    readonly retryAfterMs?: number;
    constructor(options: {
        kind: ConversationShareClientErrorKind;
        message: string;
        status?: number;
        code?: ConversationShareApiErrorCode;
        retryAfterMs?: number;
        requestId?: string;
        clientRequestId?: string;
        cause?: unknown;
    });
}
export interface ConversationShareHttpClientOptions {
    apiClient: ApiClient;
    baseUrl: string;
    tokenProvider: () => Promise<string | null>;
    timeoutMs?: number;
    /** confirm 单次请求超时；缺省 2min。 */
    confirmTimeoutMs?: number;
}
export declare class ConversationShareHttpClient {
    private readonly apiClient;
    private readonly baseUrl;
    private readonly tokenProvider;
    private readonly timeoutMs;
    private readonly confirmTimeoutMs;
    constructor(options: ConversationShareHttpClientOptions);
    getCapabilities(): Promise<ConversationShareCapabilities>;
    createPreparation(input: ConversationSharePreparationRequest): Promise<ConversationSharePreparation>;
    uploadArtifact(preparationId: string, descriptor: ConversationShareArtifactDescriptor, file: Blob): Promise<ConversationShareArtifactUpload>;
    confirm(preparationId: string, input: ConversationShareConfirmRequest): Promise<ConversationShareRecord>;
    getPreview(shareCode: string): Promise<ConversationSharePreview>;
    getContinuation(shareCode: string, input: ConversationShareContinuationRequest): Promise<ConversationShareContinuation>;
    /**
     * 版本高于本端认知时不猜语义，也不混进 invalid_contract：用户该看到「请升级 ZCode」，
     * 不是「分享格式无效」。低于或等于本端版本一律继续——新增 kind/enum 由逐行降级消化。
     */
    private assertSupportedSchemaVersion;
    private decodeRows;
    private jsonRequest;
    private requestData;
}
//# sourceMappingURL=conversationShareHttpClient.d.ts.map