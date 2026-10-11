export declare const ZCODE_ATTACHMENT_FAULT_CODES: {
    /** host 未实现 stat 能力。 */
    readonly statUnsupported: "fault.attachment.statUnsupported";
    /** host 未实现读取能力。 */
    readonly readUnsupported: "fault.attachment.readUnsupported";
    /** ref 指向的路径存在但不是普通文件。 */
    readonly statNotFile: "fault.attachment.statNotFile";
    /** share stat 的目标行/ref 不在当前会话投影里，拒绝授权。 */
    readonly shareStatNotAuthorized: "fault.attachment.shareStatNotAuthorized";
    /** share read 的目标行/ref 不在当前会话投影里，拒绝授权。 */
    readonly shareReadNotAuthorized: "fault.attachment.shareReadNotAuthorized";
    /** share stat 所在连接不受信。 */
    readonly shareStatConnectionUntrusted: "fault.attachment.shareStatConnectionUntrusted";
    /** share read 所在连接不受信。 */
    readonly shareReadConnectionUntrusted: "fault.attachment.shareReadConnectionUntrusted";
    /** 附件已从磁盘消失（ENOENT 等确定性缺失）。 */
    readonly shareStatNotFound: "fault.attachment.shareStatNotFound";
    /** 附件真实大小超出 stat 协议能表达的上界。 */
    readonly shareStatTooLarge: "fault.attachment.shareStatTooLarge";
    /** 附件字节数超出预览/读取通道上限，无法搬运。 */
    readonly previewTooLarge: "fault.attachment.previewTooLarge";
    /** 读取结果不是可预览媒体类型。 */
    readonly previewNotMedia: "fault.attachment.previewNotMedia";
};
export type ZCodeAttachmentFaultCode = (typeof ZCODE_ATTACHMENT_FAULT_CODES)[keyof typeof ZCODE_ATTACHMENT_FAULT_CODES];
export declare function isZCodeAttachmentFaultCode(value: unknown): value is ZCodeAttachmentFaultCode;
/**
 * 带稳定错误码的附件错误。`code` 是 string，`toProtocolError` 会把它放进
 * JSON-RPC `error.data.code`，因此同进程与跨进程都能按码分类。
 */
export declare class ZCodeAttachmentFaultError extends Error {
    readonly code: ZCodeAttachmentFaultCode;
    constructor(code: ZCodeAttachmentFaultCode, options?: {
        cause?: unknown;
        message?: string;
    });
}
/**
 * 从任意错误中读出附件 fault 码：
 * - 同进程抛出的 ZCodeAttachmentFaultError / 带 code 的 Error；
 * - 跨 JSON-RPC 回传的 `error.data.code`；
 * - 旧版本 CLI 只有消息文本时的兼容兜底（见下方注释）。
 */
export declare function readZCodeAttachmentFaultCode(error: unknown): ZCodeAttachmentFaultCode | undefined;
//# sourceMappingURL=attachment-faults.d.ts.map