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
import { Event, IDisposable, CancellationToken } from "./foundation.js";
import { IMessagePassingProtocol } from "./protocol.js";
import { IChannel, IServerChannel, IChannelServer, IChannelClient, ChannelServer, ChannelClient } from "./channels.js";
/** 客户端连接事件 */
export interface ClientConnectionEvent {
    protocol: IMessagePassingProtocol;
    readonly onDidClientDisconnect: Event<void>;
}
/** 客户端标识 */
export interface Client<TContext> {
    readonly ctx: TContext;
}
/** 连接 = 客户端标识 + 双向 channel */
interface Connection<TContext> extends Client<TContext> {
    readonly channelServer: ChannelServer<TContext>;
    readonly channelClient: ChannelClient;
}
/** 连接中心——暴露所有活跃连接 */
export interface IConnectionHub<TContext> {
    readonly connections: Connection<TContext>[];
    readonly onDidAddConnection: Event<Connection<TContext>>;
    readonly onDidRemoveConnection: Event<Connection<TContext>>;
}
/** 路由器——在多客户端场景中选择目标客户端 */
export interface IClientRouter<TContext = string> {
    routeCall(hub: IConnectionHub<TContext>, command: string, arg?: any, cancellationToken?: CancellationToken): Promise<Client<TContext>>;
    routeEvent(hub: IConnectionHub<TContext>, event: string, arg?: any): Promise<Client<TContext>>;
}
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
export declare class IPCServer<TContext = string> implements IChannelServer<TContext>, IConnectionHub<TContext>, IDisposable {
    private channels;
    private _connections;
    private readonly _onDidAddConnection;
    readonly onDidAddConnection: Event<Connection<TContext>>;
    private readonly _onDidRemoveConnection;
    readonly onDidRemoveConnection: Event<Connection<TContext>>;
    private readonly disposables;
    get connections(): Connection<TContext>[];
    constructor(onDidClientConnect: Event<ClientConnectionEvent>);
    /**
     * 获取客户端的 channel（反向调用）。
     *
     * 当有多个客户端时，需要 router 或 filter 来选择目标：
     * - router: 实现 IClientRouter 接口，自定义路由逻辑
     * - filter: 简单的过滤函数，随机选一个匹配的客户端
     */
    getChannel<T extends IChannel>(channelName: string, routerOrFilter: IClientRouter<TContext> | ((client: Client<TContext>) => boolean)): T;
    /** 聚合所有匹配客户端的同名事件为一个事件 */
    private getMulticastEvent;
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    dispose(): void;
}
/**
 * IPCClient 是双向的：
 * - 可以调远端的 channel (IChannelClient)
 * - 也可以注册自己的 channel 供远端调用 (IChannelServer)
 *
 * 第一条消息发送 ctx（自己的身份标识），这样服务端能识别你是谁。
 */
export declare class IPCClient<TContext = string> implements IChannelClient, IChannelServer<TContext>, IDisposable {
    private channelClient;
    private channelServer;
    constructor(protocol: IMessagePassingProtocol, ctx: TContext);
    getChannel<T extends IChannel>(channelName: string): T;
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    dispose(): void;
}
/**
 * 根据静态条件选择客户端的路由器。
 * 例: new StaticRouter(ctx => ctx === 'main-window')
 */
export declare class StaticRouter<TContext = string> implements IClientRouter<TContext> {
    private fn;
    constructor(fn: (ctx: TContext) => boolean | Promise<boolean>);
    routeCall(hub: IConnectionHub<TContext>): Promise<Client<TContext>>;
    routeEvent(hub: IConnectionHub<TContext>): Promise<Client<TContext>>;
    private route;
}
export {};
//# sourceMappingURL=ipc.d.ts.map