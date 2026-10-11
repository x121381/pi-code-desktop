import type { ConversationShareContinuation } from "@zcode/shared";
import type { IZCodeAgentService } from "../zcode-agent/zcodeAgent.js";
import type { IZCodeSessionService } from "#src/zcode-session/zcodeSession.js";
import { type ServiceLogger } from "#src/logger/serviceLogger.js";
import { type IConversationShareService, type PublishTextConversationInput, type ConversationSharePublishProgress, type ConversationShareImportProgress, type ConversationSharePreflightInput, type ConversationSharePreflightResult, type ImportConversationShareInput, type ImportConversationShareResult, type ImportedConversationShare } from "./conversationShare.js";
import { type ConversationShareHttpClient } from "./conversationShareHttpClient.js";
import type { ConversationShareArtifactSource } from "./conversationShareArtifactSource.js";
export interface ConversationShareServiceOptions {
    zcodeAgentService: ConversationShareAgentService;
    client: ConversationShareHttpClient;
    artifactSource: ConversationShareArtifactSource;
    confirmPollIntervalMs?: number;
    confirmPollTimeoutMs?: number;
    now?: () => number;
    sleep?: (delayMs: number) => Promise<void>;
    zcodeSessionService?: Pick<IZCodeSessionService, "createSession" | "listSessions">;
    download?: (url: string, init?: {
        signal?: AbortSignal;
    }) => Promise<Response>;
    /** 单个 artifact 下载的超时（含读 body）；缺省 120s。 */
    downloadTimeoutMs?: number;
    conversationWorkspaceRoot?: string;
    /** 只由 Desktop Host 注入的 canonical share 页面根地址。 */
    shareWebUrl?: string;
    logger?: ServiceLogger;
}
type ConversationShareAgentService = Pick<IZCodeAgentService, "conversationRowsRangeV4" | "conversationFileChangesV4" | "conversationAttachmentReadV4" | "conversationAttachmentStatV4">;
/** Symbol method 不可由 string-command ProxyChannel 调用，仅供 Desktop Host attachment 装配。 */
export declare const conversationShareConnectionScopeFactory: unique symbol;
export declare class ConversationShareService implements IConversationShareService {
    private readonly zcodeAgentService;
    private readonly client;
    private readonly artifactSource;
    private readonly confirmPollIntervalMs;
    private readonly confirmPollTimeoutMs;
    private readonly now;
    private readonly sleep;
    private readonly progressEmitters;
    private readonly importProgressEmitters;
    private readonly zcodeSessionService?;
    private readonly download;
    private readonly downloadTimeoutMs;
    private readonly conversationWorkspaceRoot;
    private readonly shareWebUrl;
    private readonly importIndexPath;
    private readonly logger;
    private readonly publishPhases;
    private readonly previewPreflightSnapshots;
    private readonly completedImports;
    private readonly completedImportsByWorkspace;
    private readonly inFlightImports;
    private readonly inFlightImportsByWorkspace;
    private completedImportsLoaded;
    private importIndexWriteChain;
    constructor(options: ConversationShareServiceOptions);
    getCapabilities(): Promise<{
        schema_version: number;
        access_modes: ("private" | "public_readonly" | "public_importable")[];
        allowed_artifacts: {
            type: "image" | "text" | "html" | "pdf" | "pptx" | "docx" | "xlsx" | "md";
            extensions: string[];
            mime_types: string[];
        }[];
        ttl_ms: number;
        max_rows: number;
        max_payload_bytes: number;
        max_artifact_count: number;
        max_artifact_bytes: number;
        max_total_artifact_bytes: number;
    }>;
    /** 写入预检快照，并在超过上限时按插入序淘汰最旧条目（Map 保持插入序）。 */
    private setPreviewPreflightSnapshot;
    /** 分享结束后回收该 workspace+session 的全部预检快照。 */
    private clearPreviewPreflightSnapshots;
    preflight(input: ConversationSharePreflightInput): Promise<ConversationSharePreflightResult>;
    private preflightWithAgent;
    getPreview(shareCode: string): Promise<import("@zcode/shared").ConversationSharePreview>;
    getContinuation(input: {
        shareCode: string;
        clientRequestId: string;
    }): Promise<ConversationShareContinuation>;
    /** Host attachment 内部 facade：复用同一业务 service，只替换 V4 Rows/File 查询的可信 Agent scope。 */
    [conversationShareConnectionScopeFactory](agentService: ConversationShareAgentService): IConversationShareService;
    onDynamicPublishProgress(operationId: string): import("@zcode/rpc").Event<ConversationSharePublishProgress>;
    onDynamicImportProgress(operationId: string): import("@zcode/rpc").Event<ConversationShareImportProgress>;
    /**
     * 下载单个 artifact 的字节：带单请求超时（含读 body）与 Content-Length 预检。
     *
     * download 兜底不能是裸 fetch（无 AbortSignal），且 size/SHA-256 校验不能在
     * arrayBuffer() 之后才执行——挂住的连接会让导入无限停在 downloading 阶段（undici 默认
     * ~300s 兜底，体验上等于卡死）；被篡改的存储还能让客户端先把超大 payload 全量读进内存
     * 再发现不符。超时按 network 失败；Content-Length 声明超过 manifest 的 size_bytes 时
     * 在读 body 前直接判 integrity 失败并中断连接——完整性校验放在无界下载之后只保证
     * 正确性，不保护客户端资源。
     */
    private downloadArtifactBytes;
    importShare(input: ImportConversationShareInput, operationId: string): Promise<ImportConversationShareResult>;
    private importShareInternal;
    /**
     * 按 contextId 找回导入时落盘的公开 rows。
     *
     * 目录名用的是 share_id 而不是 contextId（二者不等价），所以扫 .zcode-share/ 下各
     * importRoot 并比对文件内的 contextId —— 不额外维护索引，历史导入也能被读到。
     * 内容来自磁盘，属跨存储边界，必须过 schema 再交给渲染层。
     */
    getImportedConversation(input: {
        workspacePath: string;
        contextId: string;
    }): Promise<ImportedConversationShare | null>;
    private loadCompletedImportIndex;
    private writeCompletedImportIndexOnce;
    private persistCompletedImportIndex;
    publish(input: PublishTextConversationInput, operationId: string): Promise<{
        share_code: string;
        share_url: string;
        access_mode: "private" | "public_readonly" | "public_importable";
        expires_at: number;
    }>;
    private publishWithAgent;
    private publishInternal;
    private getProgressEmitter;
    private getImportProgressEmitter;
    private reportImportProgress;
    private cleanupAbandonedImports;
    private collectArtifactManifestIssues;
    private validateArtifactManifest;
    private confirmUntilReady;
    private loadAllRows;
}
export {};
//# sourceMappingURL=conversationShareService.d.ts.map