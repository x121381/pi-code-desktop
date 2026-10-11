import type { IServerChannel } from "@zcode/rpc";
import { type TopicResourceRelayDependencies } from "./topicResourceRelay.js";
/** 只注册在已鉴权远程连接的反向 server 上，不暴露在 Renderer/手机 service collection。 */
export declare function createTopicResourceRelayChannel(deps: TopicResourceRelayDependencies): {
    channel: IServerChannel<string>;
    dispose(): void;
};
//# sourceMappingURL=topicResourceRelayChannel.d.ts.map