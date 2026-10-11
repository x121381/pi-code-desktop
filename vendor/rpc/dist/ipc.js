/**
 * Layer 4: 连接管理 —— IPCServer 和 IPCClient
 *
 * ChannelServer/ChannelClient 是单连接的 RPC 实现。
 * IPCServer/IPCClient 在其上构建连接管理能力：
 *
 * - IPCServer (1:N): 一个服务端接受多个客户端连接，
 *   每个连接独立创建 ChannelServer + ChannelClient。
 *   支持通过 Router 选择目标客户端进行调用。
 *
 * - IPCClient (1:1 双向): 既是客户端又是服务端，
 *   可以调远端的 channel，也可以注册自己的 channel 供远端调用。
 *
 * 关键协议：客户端连接后发送的第一条消息是 ctx（上下文/客户端ID），
 * 服务端据此识别客户端身份。
 */
import { Event, Emitter, DisposableStore, EventMultiplexer, } from "./foundation.js";
import { BufferReader, BufferWriter, serialize, deserialize } from "./serialization.js";
import { ChannelServer, ChannelClient, getDelayedChannel, } from "./channels.js";
// ============================================================================
// IPCServer —— 一对多服务端
// ============================================================================
/**
 * IPCServer 是整个通信架构中的"大脑"。
 *
 * 它同时是：
 * - IChannelServer: 注册 channel 供客户端调用
 * - IRoutingChannelClient: 可以反向调用客户端的 channel（通过 Router 选择目标）
 * - IConnectionHub: 暴露所有活跃连接，支持连接增删事件
 *
 * 工作流程：
 * 1. 监听 onDidClientConnect 事件
 * 2. 客户端连接后，等待第一条消息（ctx = 客户端ID）
 * 3. 为每个连接创建独立的 ChannelServer + ChannelClient
 * 4. 把已注册的 channel 推送到新连接的 ChannelServer
 */
export class IPCServer {
    channels = new Map();
    _connections = new Set();
    _onDidAddConnection = new Emitter();
    onDidAddConnection = this._onDidAddConnection.event;
    _onDidRemoveConnection = new Emitter();
    onDidRemoveConnection = this._onDidRemoveConnection.event;
    disposables = new DisposableStore();
    get connections() {
        return [...this._connections];
    }
    constructor(onDidClientConnect) {
        this.disposables.add(onDidClientConnect(({ protocol, onDidClientDisconnect }) => {
            // 等待客户端发来的第一条消息：ctx（客户端身份标识）
            const onFirstMessage = Event.once(protocol.onMessage);
            this.disposables.add(onFirstMessage((msg) => {
                const reader = new BufferReader(msg);
                const ctx = deserialize(reader);
                // 为这个连接创建独立的 ChannelServer 和 ChannelClient
                const channelServer = new ChannelServer(protocol, ctx);
                const channelClient = new ChannelClient(protocol);
                // 把已注册的 channel 推送给新连接
                this.channels.forEach((channel, name) => channelServer.registerChannel(name, channel));
                const connection = { channelServer, channelClient, ctx };
                this._connections.add(connection);
                this._onDidAddConnection.fire(connection);
                // 客户端断开时清理
                this.disposables.add(onDidClientDisconnect(() => {
                    channelServer.dispose();
                    channelClient.dispose();
                    this._connections.delete(connection);
                    this._onDidRemoveConnection.fire(connection);
                }));
            }));
        }));
    }
    /**
     * 获取客户端的 channel（反向调用）。
     *
     * 当有多个客户端时，需要 router 或 filter 来选择目标：
     * - router: 实现 IClientRouter 接口，自定义路由逻辑
     * - filter: 简单的过滤函数，随机选一个匹配的客户端
     */
    getChannel(channelName, routerOrFilter) {
        const that = this;
        const isFilter = typeof routerOrFilter === "function";
        return {
            call(command, arg, cancellationToken) {
                let connectionPromise;
                if (isFilter) {
                    const match = that.connections.find(routerOrFilter);
                    connectionPromise = match
                        ? Promise.resolve(match)
                        : Event.toPromise(Event.filter(that.onDidAddConnection, routerOrFilter));
                }
                else {
                    connectionPromise = routerOrFilter.routeCall(that, command, arg, cancellationToken);
                }
                const channelPromise = connectionPromise.then((c) => c.channelClient.getChannel(channelName));
                return getDelayedChannel(channelPromise).call(command, arg, cancellationToken);
            },
            listen(event, arg) {
                if (isFilter) {
                    return that.getMulticastEvent(channelName, routerOrFilter, event, arg);
                }
                const channelPromise = routerOrFilter
                    .routeEvent(that, event, arg)
                    .then((c) => c.channelClient.getChannel(channelName));
                return getDelayedChannel(channelPromise).listen(event, arg);
            },
        };
    }
    /** 聚合所有匹配客户端的同名事件为一个事件 */
    getMulticastEvent(channelName, filter, eventName, arg) {
        const that = this;
        let disposables;
        const emitter = new Emitter({
            onWillAddFirstListener: () => {
                disposables = new DisposableStore();
                const multiplexer = new EventMultiplexer();
                const onAdd = (connection) => {
                    const channel = connection.channelClient.getChannel(channelName);
                    const event = channel.listen(eventName, arg);
                    multiplexer.add(event);
                };
                that.connections.filter(filter).forEach(onAdd);
                disposables.add(Event.filter(that.onDidAddConnection, filter)(onAdd));
                disposables.add(multiplexer.event((e) => emitter.fire(e)));
                disposables.add(multiplexer);
            },
            onDidRemoveLastListener: () => {
                disposables?.dispose();
                disposables = undefined;
            },
        });
        return emitter.event;
    }
    registerChannel(channelName, channel) {
        this.channels.set(channelName, channel);
        // 推送到所有已连接的客户端
        for (const connection of this._connections) {
            connection.channelServer.registerChannel(channelName, channel);
        }
    }
    dispose() {
        this.disposables.dispose();
        for (const connection of this._connections) {
            connection.channelClient.dispose();
            connection.channelServer.dispose();
        }
        this._connections.clear();
        this.channels.clear();
        this._onDidAddConnection.dispose();
        this._onDidRemoveConnection.dispose();
    }
}
// ============================================================================
// IPCClient —— 一对一双向
// ============================================================================
/**
 * IPCClient 是双向的：
 * - 可以调远端的 channel (IChannelClient)
 * - 也可以注册自己的 channel 供远端调用 (IChannelServer)
 *
 * 第一条消息发送 ctx（自己的身份标识），这样服务端能识别你是谁。
 */
export class IPCClient {
    channelClient;
    channelServer;
    constructor(protocol, ctx) {
        // 第一条消息：发送自己的身份标识
        const writer = new BufferWriter();
        serialize(writer, ctx);
        protocol.send(writer.buffer);
        this.channelClient = new ChannelClient(protocol);
        this.channelServer = new ChannelServer(protocol, ctx);
    }
    getChannel(channelName) {
        return this.channelClient.getChannel(channelName);
    }
    registerChannel(channelName, channel) {
        this.channelServer.registerChannel(channelName, channel);
    }
    dispose() {
        this.channelClient.dispose();
        this.channelServer.dispose();
    }
}
// ============================================================================
// StaticRouter —— 简单路由器
// ============================================================================
/**
 * 根据静态条件选择客户端的路由器。
 * 例: new StaticRouter(ctx => ctx === 'main-window')
 */
export class StaticRouter {
    fn;
    constructor(fn) {
        this.fn = fn;
    }
    async routeCall(hub) {
        return this.route(hub);
    }
    async routeEvent(hub) {
        return this.route(hub);
    }
    async route(hub) {
        for (const connection of hub.connections) {
            if (await Promise.resolve(this.fn(connection.ctx))) {
                return connection;
            }
        }
        // 等待新连接到来
        await Event.toPromise(hub.onDidAddConnection);
        return this.route(hub);
    }
}
//# sourceMappingURL=ipc.js.map