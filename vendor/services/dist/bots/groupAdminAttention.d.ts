import type { BotActor, BotOutboundMessage } from "@zcode/shared";
/** 仅由服务明确识别的配置/连接错误升级，不能扫描模型输出猜测管理员待办。 */
export declare class BotAdminRequiredError extends Error {
    readonly reason: string;
    constructor(reason: string, message: string);
}
/** 保留准备阶段的结构化提示，避免话题续接把收件人丢成纯文本。 */
export declare class BotReplyError extends Error {
    readonly replies: BotOutboundMessage[];
    constructor(replies: BotOutboundMessage[]);
}
/** 通知去重不参与任务接收、授权或执行；重启后允许重新提醒。 */
export declare function createGroupAdminAttention(): {
    mention(actor: BotActor, owner: string | undefined, reason: string): string[] | undefined;
    clear(actor?: BotActor, owner?: string, reason?: string): void;
};
//# sourceMappingURL=groupAdminAttention.d.ts.map