import type { BotInboundMessage } from "@zcode/shared";
export type TopicPreparationStatus = "preparing" | "waitingStop" | "failed";
/** 仅保留未提交材料；对外投影不包含文件二进制，重试仍由入站授权链处理。 */
export declare function createTopicPreparationState(): {
    add(key: string, message: BotInboundMessage): void;
    setWaitingStop(key: string, waiting: boolean): void;
    update(key: string, ids: string[], status: TopicPreparationStatus, error?: string): void;
    snapshot(key: string): {
        error?: string | undefined;
        messageId: string;
        senderName: string;
        text: string;
        contentParts: ({
            type: "text";
            text: string;
        } | {
            type: "channelMention";
            refId: string;
            name: string;
            channel: "feishu" | "lark";
            targetId: string;
            idType: "open_id";
            entityType: "unknown" | "user" | "bot";
        })[] | undefined;
        status: TopicPreparationStatus;
    }[];
    retry(key: string, id: string): BotInboundMessage | undefined;
    remove(key: string, ids: string[]): void;
    clear(key?: string): void;
};
//# sourceMappingURL=topicPreparationState.d.ts.map