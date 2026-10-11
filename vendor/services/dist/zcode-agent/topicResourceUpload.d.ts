import { type ZCodePromptAttachment, type ZCodeProtocolTrace } from "@zcode/shared";
import type { ZCodeProtocolClient } from "./zcodeProtocolClient.js";
import type { ZCodeAgentSessionTarget } from "./zcodeAgent.js";
/** 反向请求绑定实际 CLI 连接；上传不能再次按路径选择运行时。 */
export declare function uploadTopicResourceToClient(client: Pick<ZCodeProtocolClient, "request">, connectionId: string, target: ZCodeAgentSessionTarget, attachment: ZCodePromptAttachment, signal: AbortSignal, trace?: ZCodeProtocolTrace): Promise<{
    ref: string;
    fileName: string;
    mime: string;
    bytes: number;
}>;
//# sourceMappingURL=topicResourceUpload.d.ts.map