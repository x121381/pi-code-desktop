import { type ChannelReplyHostRequest, type ChannelReplyResult, type BotsStateFile, type BotsConfigFile, type BotConfig, type BotGroupDelivery } from "@zcode/shared";
interface ChannelReplyDependencies {
    readState(): Promise<BotsStateFile>;
    readConfig(): Promise<BotsConfigFile>;
    listMembers?(bot: BotConfig, chatId: string): Promise<Record<string, string>>;
    deliver(bot: BotConfig, chatId: string, threadId: string | undefined, result: BotGroupDelivery): Promise<void>;
}
export declare function replyToBotChannel(value: ChannelReplyHostRequest, deps: ChannelReplyDependencies): Promise<ChannelReplyResult>;
export {};
//# sourceMappingURL=channelReply.d.ts.map