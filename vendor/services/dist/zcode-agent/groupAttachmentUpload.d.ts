import type { ZCodePromptAttachment } from "@zcode/shared";
import { type AttachmentRef } from "@zcode/shared/zcode-protocol-v4";
import type { IZCodeAgentService, ZCodeAgentSessionTarget } from "#src/zcode-agent/zcodeAgent.js";
type UploadAgent = Pick<IZCodeAgentService, "attachmentBeginV4" | "attachmentChunkV4" | "attachmentCommitV4" | "attachmentAbortV4">;
/** 内容寄存在目标 CLI，群队列只保存引用；远端不能直接使用桌面临时路径。 */
export declare function uploadBotGroupAttachments(agent: UploadAgent, target: ZCodeAgentSessionTarget, attachments: readonly ZCodePromptAttachment[], signal?: AbortSignal): Promise<AttachmentRef[]>;
export {};
//# sourceMappingURL=groupAttachmentUpload.d.ts.map