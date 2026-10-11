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
// ============================================================================
// LoggingServerChannel —— 装饰单个 IServerChannel，记录 call/listen
// ============================================================================
class LoggingServerChannel {
    inner;
    channelName;
    logger;
    constructor(inner, channelName, logger) {
        this.inner = inner;
        this.channelName = channelName;
        this.logger = logger;
    }
    async call(ctx, command, arg, cancellationToken) {
        const start = performance.now();
        try {
            const result = await this.inner.call(ctx, command, arg, cancellationToken);
            const elapsed = (performance.now() - start).toFixed(1);
            this.logger(`[rpc:call] ${this.channelName}.${command} OK (${elapsed}ms)`);
            return result;
        }
        catch (err) {
            const elapsed = (performance.now() - start).toFixed(1);
            this.logger(`[rpc:call] ${this.channelName}.${command} FAIL (${elapsed}ms)`, err);
            throw err;
        }
    }
    listen(ctx, event, arg) {
        try {
            const result = this.inner.listen(ctx, event, arg);
            this.logger(`[rpc:listen] ${this.channelName}.${event} subscribed`);
            return result;
        }
        catch (err) {
            this.logger(`[rpc:listen] ${this.channelName}.${event} FAIL`, err);
            throw err;
        }
    }
}
// ============================================================================
// LoggingChannelServer —— 装饰 IChannelServer，拦截 registerChannel
// ============================================================================
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
export class LoggingChannelServer {
    inner;
    logger;
    constructor(inner, logger) {
        this.inner = inner;
        this.logger = logger;
    }
    registerChannel(channelName, channel) {
        this.logger(`[rpc:register] channel "${channelName}"`);
        this.inner.registerChannel(channelName, new LoggingServerChannel(channel, channelName, this.logger));
    }
    ready() {
        this.inner.ready?.();
    }
}
// ============================================================================
// LoggingChannel —— 装饰单个 IChannel（客户端侧），记录 call/listen
// ============================================================================
class LoggingChannel {
    inner;
    channelName;
    logger;
    constructor(inner, channelName, logger) {
        this.inner = inner;
        this.channelName = channelName;
        this.logger = logger;
    }
    async call(command, arg, cancellationToken) {
        const start = performance.now();
        try {
            const result = await this.inner.call(command, arg, cancellationToken);
            const elapsed = (performance.now() - start).toFixed(1);
            this.logger(`[rpc:call] ${this.channelName}.${command} → OK (${elapsed}ms)`);
            return result;
        }
        catch (err) {
            const elapsed = (performance.now() - start).toFixed(1);
            this.logger(`[rpc:call] ${this.channelName}.${command} → FAIL (${elapsed}ms)`, err);
            throw err;
        }
    }
    listen(event, arg) {
        this.logger(`[rpc:listen] ${this.channelName}.${event} → subscribed`);
        return this.inner.listen(event, arg);
    }
}
// ============================================================================
// LoggingChannelClient —— 装饰 IChannelClient，拦截 getChannel
// ============================================================================
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
export class LoggingChannelClient {
    inner;
    logger;
    constructor(inner, logger) {
        this.inner = inner;
        this.logger = logger;
    }
    getChannel(channelName) {
        const channel = this.inner.getChannel(channelName);
        return new LoggingChannel(channel, channelName, this.logger);
    }
}
//# sourceMappingURL=logging-middleware.js.map