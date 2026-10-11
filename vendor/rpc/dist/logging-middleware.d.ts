/**
 * RPC 日志拦截中间件
 *
 * 装饰 ChannelServer / ChannelClient，在不侵入核心逻辑的前提下
 * 统一记录所有 RPC 调用和事件订阅。
 *
 * 用法：
 *   const server = new ChannelServer(protocol, ctx);
 *   const logged = new LoggingChannelServer(server, logger.info);
 *   services.exposeOnChannelServer(logged);
 */
import type { IChannelServer, IChannelClient, IChannel, IServerChannel } from "./channels.js";
export type RPCLogger = (message: string, ...args: unknown[]) => void;
/**
 * 包装 ChannelServer，为每个注册的频道自动加上日志。
 *
 * 在 host process 或 server 中使用：
 * ```ts
 * const server = new ChannelServer(protocol, ctx);
 * const logged = new LoggingChannelServer(server, console.error);
 * services.exposeOnChannelServer(logged);
 * ```
 */
export declare class LoggingChannelServer<TContext = string> implements IChannelServer<TContext> {
    private inner;
    private logger;
    constructor(inner: IChannelServer<TContext>, logger: RPCLogger);
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    ready(): void;
}
/**
 * 包装 ChannelClient，为每个获取的频道自动加上日志。
 *
 * 在 renderer 或 client 中使用：
 * ```ts
 * const client = new ChannelClient(protocol);
 * const logged = new LoggingChannelClient(client, console.info);
 * const services = new RemoteServiceAccess(logged);
 * ```
 */
export declare class LoggingChannelClient implements IChannelClient {
    private inner;
    private logger;
    constructor(inner: IChannelClient, logger: RPCLogger);
    getChannel<T extends IChannel>(channelName: string): T;
}
//# sourceMappingURL=logging-middleware.d.ts.map