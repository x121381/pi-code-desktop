import { type ZCodeTopicResourceRelayRequest, type ZCodePromptAttachment } from "@zcode/shared";
export interface TopicResourceRelayDependencies {
    reply?(request: import("@zcode/shared").ChannelReplyHostRequest): Promise<import("@zcode/shared").ChannelReplyResult>;
    validate(request: ZCodeTopicResourceRelayRequest, signal: AbortSignal): Promise<void>;
    read(request: ZCodeTopicResourceRelayRequest, signal: AbortSignal): Promise<ZCodePromptAttachment>;
}
/** 只缓存有界附件字节；过载直接拒绝，不构成第二份执行队列。每条远程连接独立持有。 */
export declare function createTopicResourceRelay(deps: TopicResourceRelayDependencies): {
    begin(value: unknown): Promise<{
        fileName: string;
        mime: string;
        bytes: number;
        totalChunks: number;
        checksum: string;
    }>;
    chunk(value: unknown): Promise<{
        dataBase64: string;
    }>;
    finish(value: unknown): Promise<{
        completed: true;
    }>;
    cancel(value: unknown): boolean;
    dispose(): void;
};
//# sourceMappingURL=topicResourceRelay.d.ts.map