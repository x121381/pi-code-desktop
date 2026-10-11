/**
 * Layer 6: Remote 远程连接抽象
 *
 * 这一层让 VS Code 能连接到 SSH、Docker、WSL 里的文件系统。
 *
 * 核心思路：
 * 1. RemoteAuthority: "ssh+myserver" 这样的字符串标识远程环境
 * 2. RemoteAuthorityResolver: 由扩展注册，把 authority 解析为实际连接地址
 * 3. RemoteSocketFactory: 根据连接类型创建不同的 socket
 * 4. URITransformer: 在客户端和服务端之间转换文件路径
 *
 * 连接建立流程：
 *   authority "ssh+myserver"
 *       ↓ (RemoteAuthorityResolver)
 *   { host: "1.2.3.4", port: 8080, token: "xxx" }
 *       ↓ (RemoteSocketFactory)
 *   ISocket (TCP/WebSocket)
 *       ↓ (PersistentProtocol)
 *   IMessagePassingProtocol (带 ACK + 重连)
 *       ↓ (IPCClient)
 *   可以调用远端的 channel 了！
 */
import { IDisposable } from "./foundation.js";
import { ISocket } from "./protocol.js";
import { IPCClient } from "./ipc.js";
/**
 * 远程连接类型
 */
export declare enum RemoteConnectionType {
    WebSocket = 0,
    Managed = 1
}
/**
 * WebSocket 连接：直接连到 host:port
 */
export declare class WebSocketRemoteConnection {
    readonly host: string;
    readonly port: number;
    readonly type = RemoteConnectionType.WebSocket;
    constructor(host: string, port: number);
    toString(): string;
}
/**
 * 托管连接：通过 ID 引用已建立的连接（如 tunnel）
 */
export declare class ManagedRemoteConnection {
    readonly id: number;
    readonly type = RemoteConnectionType.Managed;
    constructor(id: number);
    toString(): string;
}
export type RemoteConnection = WebSocketRemoteConnection | ManagedRemoteConnection;
/** 解析后的远程地址 */
export interface ResolvedAuthority {
    readonly authority: string;
    readonly connectTo: RemoteConnection;
    readonly connectionToken: string | undefined;
}
/**
 * IRemoteAuthorityResolver 负责把 authority 字符串解析为实际连接地址。
 *
 * 在 VS Code 中，这个接口由远程扩展实现：
 * - Remote-SSH 扩展注册 "ssh" 类型的 resolver
 * - Remote-WSL 扩展注册 "wsl" 类型的 resolver
 * - Dev Containers 扩展注册 "dev-container" 类型的 resolver
 *
 * 每种远程类型都知道如何解析自己的 authority 并返回可连接的地址。
 */
export interface IRemoteAuthorityResolver {
    resolve(authority: string): Promise<ResolvedAuthority>;
}
/**
 * RemoteAuthorityResolverService 管理多个 resolver
 */
export declare class RemoteAuthorityResolverService {
    private resolvers;
    /** 注册一个 authority 类型的 resolver */
    registerResolver(type: string, resolver: IRemoteAuthorityResolver): IDisposable;
    /**
     * 解析 authority
     * @param authority 如 "ssh+myserver", "wsl+Ubuntu"
     */
    resolveAuthority(authority: string): Promise<ResolvedAuthority>;
}
/**
 * ISocketFactory 创建特定类型的 socket 连接
 */
export interface ISocketFactory<T extends RemoteConnectionType = RemoteConnectionType> {
    supports(connectTo: RemoteConnection & {
        type: T;
    }): boolean;
    connect(connectTo: RemoteConnection & {
        type: T;
    }, path: string, query: string): Promise<ISocket>;
}
/**
 * RemoteSocketFactoryService 管理不同连接类型的 socket 工厂。
 *
 * 设计模式：策略模式
 * - Node.js 环境注册 NodeSocketFactory（TCP socket）
 * - 浏览器环境注册 BrowserSocketFactory（WebSocket）
 * - 每种 RemoteConnectionType 可以有多个工厂，按 supports() 选择
 */
export declare class RemoteSocketFactoryService {
    private readonly factories;
    register<T extends RemoteConnectionType>(type: T, factory: ISocketFactory<T>): IDisposable;
    connect(connectTo: RemoteConnection, path: string, query: string): Promise<ISocket>;
}
/**
 * URI 转换器——在客户端和服务端之间转换文件路径。
 *
 * 问题：
 * - 客户端用 vscode-remote://ssh+myserver/home/user/file.txt 标识远程文件
 * - 服务端（远端机器上）用 file:///home/user/file.txt 操作真实文件
 *
 * 转换规则：
 *   客户端 → 服务端:
 *     vscode-remote://authority/path → file:///path
 *     file:///local/path → vscode-local:///local/path
 *
 *   服务端 → 客户端:
 *     file:///path → vscode-remote://authority/path
 *     vscode-local:///local/path → file:///local/path
 */
export interface IURITransformer {
    /** 客户端 URI → 服务端 URI */
    transformIncoming(uri: SimpleURI): SimpleURI;
    /** 服务端 URI → 客户端 URI */
    transformOutgoing(uri: SimpleURI): SimpleURI;
}
/** 简化的 URI 表示 */
export interface SimpleURI {
    scheme: string;
    authority: string;
    path: string;
}
/**
 * 创建一个 URI 转换器
 * @param remoteAuthority 远程 authority 字符串，如 "ssh+myserver"
 */
export declare function createURITransformer(remoteAuthority: string): IURITransformer;
export interface RemoteConnectionState {
    type: "connected" | "reconnecting" | "disconnected";
}
/**
 * RemoteAgentConnection 是远程连接的完整生命周期管理器。
 *
 * 它串联了所有 Remote 层的抽象：
 * 1. 用 RemoteAuthorityResolver 解析地址
 * 2. 用 RemoteSocketFactory 建立 socket
 * 3. 用 PersistentProtocol 添加可靠性
 * 4. 包装为 IPCClient 供上层使用
 * 5. 断线后自动重连
 */
export declare class RemoteAgentConnection implements IDisposable {
    private readonly authority;
    private readonly resolverService;
    private readonly socketFactory;
    private protocol;
    private client;
    private readonly _onDidStateChange;
    readonly onDidStateChange: import("./foundation.js").Event<RemoteConnectionState>;
    constructor(authority: string, resolverService: RemoteAuthorityResolverService, socketFactory: RemoteSocketFactoryService);
    /**
     * 建立连接并返回 IPCClient
     */
    connect(): Promise<IPCClient<string>>;
    private reconnect;
    dispose(): void;
}
//# sourceMappingURL=remote.d.ts.map