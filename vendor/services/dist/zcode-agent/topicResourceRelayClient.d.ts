import { type IChannel } from "@zcode/rpc";
import { type ZCodePromptAttachment } from "@zcode/shared";
export declare function validateTopicResourceFromRelay(channel: Pick<IChannel, "call">, value: unknown, signal: AbortSignal): Promise<void>;
/** 单个 reverse RPC 只传一块，避免把完整 base64 附件塞进有帧上限的现有 stdio 连接。 */
export declare function readTopicResourceFromRelay(channel: Pick<IChannel, "call">, value: unknown, signal: AbortSignal): Promise<ZCodePromptAttachment>;
//# sourceMappingURL=topicResourceRelayClient.d.ts.map