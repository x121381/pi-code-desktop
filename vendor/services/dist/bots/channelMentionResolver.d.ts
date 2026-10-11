import { type ChannelContentPart, type ChannelReplyHostRequest, type ChannelReplyResult } from "@zcode/shared";
type Clarification = Extract<ChannelReplyResult, {
    status: "needs_clarification";
}>;
/** 名字只是查询条件；候选身份只能来自 Provider 目录与已授权原生节点。 */
export declare function resolveChannelMentionNames(parts: ChannelReplyHostRequest["parts"], trusted: ChannelContentPart[], members: Record<string, string> | undefined, scope: string, channel: "feishu" | "lark", nameCandidates?: ChannelContentPart[]): {
    parts: ChannelContentPart[];
} | Clarification;
export {};
//# sourceMappingURL=channelMentionResolver.d.ts.map