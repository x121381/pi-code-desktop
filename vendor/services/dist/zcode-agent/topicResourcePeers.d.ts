import type { IChannel } from "@zcode/rpc";
import type { IZCodeAgentService } from "./zcodeAgent.js";
/** 共用 Server 只维护已鉴权连接的资源返回路由，不保存任务或队列状态。 */
export declare function createTopicResourcePeers(): {
    getChannel(value: unknown): IChannel;
    attach(channel: IChannel): {
        wrapAgent(base: IZCodeAgentService): IZCodeAgentService;
        dispose(): void;
    };
};
export type TopicResourcePeers = ReturnType<typeof createTopicResourcePeers>;
//# sourceMappingURL=topicResourcePeers.d.ts.map