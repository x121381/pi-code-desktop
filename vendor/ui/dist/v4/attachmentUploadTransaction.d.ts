import { type V4AttachmentBeginResult, type V4AttachmentChunkResult, type V4AttachmentPutParams, type V4AttachmentPutResult } from "@zcode/shared/zcode-protocol-v4";
import type { ZCodeAgentAttachmentBeginParams, ZCodeAgentAttachmentChunkParams, ZCodeAgentAttachmentTerminalParams } from "@zcode/services";
/** 384KiB 可被 3 整除，除末片外 base64 不含 padding；同时为两层 envelope 留足空间。 */
export declare const ATTACHMENT_UPLOAD_CHUNK_BYTES: number;
export interface AttachmentUploadAgent {
    attachmentBeginV4(params: ZCodeAgentAttachmentBeginParams): Promise<V4AttachmentBeginResult>;
    attachmentChunkV4(params: ZCodeAgentAttachmentChunkParams): Promise<V4AttachmentChunkResult>;
    attachmentCommitV4(params: ZCodeAgentAttachmentTerminalParams): Promise<V4AttachmentPutResult>;
    attachmentAbortV4(params: ZCodeAgentAttachmentTerminalParams): Promise<void>;
}
export interface AttachmentUploadWorkspace {
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface AttachmentUploadProgress {
    phase: "uploading" | "committing";
    uploadedBytes: number;
    totalBytes: number;
}
export interface AttachmentUploadOptions {
    signal?: AbortSignal;
    onProgress?: (progress: AttachmentUploadProgress) => void;
}
/** 用 production ChannelClient 相同的 serializer 计量完整 method+args physical request。 */
export declare function measureAttachmentChannelRequestBytes(method: string, params: unknown): number;
export declare function uploadAttachmentTransaction(agent: AttachmentUploadAgent, workspace: AttachmentUploadWorkspace, input: V4AttachmentPutParams, options?: AttachmentUploadOptions): Promise<V4AttachmentPutResult>;
//# sourceMappingURL=attachmentUploadTransaction.d.ts.map