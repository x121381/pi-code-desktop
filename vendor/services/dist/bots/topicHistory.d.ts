import type { BotTopicHistoryBatch, BotTopicHistoryRequest, BotTopicMessage } from "@zcode/shared";
/** 区分权限拒绝和临时网络错误，避免错误引导用户授权。 */
export declare class TopicHistoryPermissionError extends Error {
}
interface TopicHistoryReader {
    /** 原生 thread 容器按创建时间倒序分页；接口不支持时间过滤。 */
    list(page?: string): Promise<{
        messages: BotTopicMessage[];
        next?: string;
    }>;
    get(messageId: string): Promise<BotTopicMessage>;
    hydrate?(message: BotTopicMessage): Promise<BotTopicMessage>;
}
/** 只准备不可变背景，不推进检查点；推进必须等到 CLI admission 确认。 */
export declare function readTopicHistory(request: BotTopicHistoryRequest, reader: TopicHistoryReader): Promise<BotTopicHistoryBatch>;
export {};
//# sourceMappingURL=topicHistory.d.ts.map