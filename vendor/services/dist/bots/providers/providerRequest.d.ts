export interface BotProviderJsonResponse<T> {
    ok: boolean;
    status: number;
    payload: T | undefined;
    responseLogId?: string;
}
export interface BotProviderResponse {
    ok: boolean;
    status: number;
}
/**
 * 第三方 Bot API 不一定会自行结束悬挂请求。所有回调 ACK 和出站消息都必须有界，
 * 否则单个请求会占住 actor 串行队列，后续权限、问答和计划审批都无法继续。
 */
export declare function fetchBotProvider(input: string | URL | Request, init?: RequestInit, timeoutMs?: number): Promise<BotProviderResponse>;
export declare function fetchBotProviderJson<T>(input: string | URL | Request, init?: RequestInit, timeoutMs?: number): Promise<BotProviderJsonResponse<T>>;
//# sourceMappingURL=providerRequest.d.ts.map