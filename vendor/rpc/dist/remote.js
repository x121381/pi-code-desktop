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
import { Emitter, toDisposable } from "./foundation.js";
import { PersistentProtocol } from "./persistent-protocol.js";
import { IPCClient } from "./ipc.js";
// ============================================================================
// Remote Authority
// ============================================================================
/**
 * 远程连接类型
 */
export var RemoteConnectionType;
(function (RemoteConnectionType) {
    RemoteConnectionType[RemoteConnectionType["WebSocket"] = 0] = "WebSocket";
    RemoteConnectionType[RemoteConnectionType["Managed"] = 1] = "Managed";
})(RemoteConnectionType || (RemoteConnectionType = {}));
/**
 * WebSocket 连接：直接连到 host:port
 */
export class WebSocketRemoteConnection {
    host;
    port;
    type = RemoteConnectionType.WebSocket;
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    toString() {
        return `WebSocket(${this.host}:${this.port})`;
    }
}
/**
 * 托管连接：通过 ID 引用已建立的连接（如 tunnel）
 */
export class ManagedRemoteConnection {
    id;
    type = RemoteConnectionType.Managed;
    constructor(id) {
        this.id = id;
    }
    toString() {
        return `Managed(${this.id})`;
    }
}
/**
 * RemoteAuthorityResolverService 管理多个 resolver
 */
export class RemoteAuthorityResolverService {
    resolvers = new Map();
    /** 注册一个 authority 类型的 resolver */
    registerResolver(type, resolver) {
        this.resolvers.set(type, resolver);
        return toDisposable(() => this.resolvers.delete(type));
    }
    /**
     * 解析 authority
     * @param authority 如 "ssh+myserver", "wsl+Ubuntu"
     */
    async resolveAuthority(authority) {
        // 从 authority 中提取类型：ssh+myserver → ssh
        const plusIndex = authority.indexOf("+");
        const type = plusIndex >= 0 ? authority.substring(0, plusIndex) : authority;
        const resolver = this.resolvers.get(type);
        if (!resolver) {
            throw new Error(`No resolver registered for remote type: ${type}`);
        }
        return resolver.resolve(authority);
    }
}
/**
 * RemoteSocketFactoryService 管理不同连接类型的 socket 工厂。
 *
 * 设计模式：策略模式
 * - Node.js 环境注册 NodeSocketFactory（TCP socket）
 * - 浏览器环境注册 BrowserSocketFactory（WebSocket）
 * - 每种 RemoteConnectionType 可以有多个工厂，按 supports() 选择
 */
export class RemoteSocketFactoryService {
    factories = new Map();
    register(type, factory) {
        if (!this.factories.has(type)) {
            this.factories.set(type, []);
        }
        this.factories.get(type).push(factory);
        return toDisposable(() => {
            const list = this.factories.get(type);
            if (list) {
                const idx = list.indexOf(factory);
                if (idx >= 0) {
                    list.splice(idx, 1);
                }
            }
        });
    }
    async connect(connectTo, path, query) {
        const factories = this.factories.get(connectTo.type) || [];
        const factory = factories.find((f) => f.supports(connectTo));
        if (!factory) {
            throw new Error(`No socket factory found for ${connectTo}`);
        }
        return factory.connect(connectTo, path, query);
    }
}
/**
 * 创建一个 URI 转换器
 * @param remoteAuthority 远程 authority 字符串，如 "ssh+myserver"
 */
export function createURITransformer(remoteAuthority) {
    return {
        transformIncoming(uri) {
            // vscode-remote://authority/path → file:///path
            if (uri.scheme === "vscode-remote" && uri.authority === remoteAuthority) {
                return { scheme: "file", authority: "", path: uri.path };
            }
            // file:///local → vscode-local:///local
            if (uri.scheme === "file") {
                return { scheme: "vscode-local", authority: "", path: uri.path };
            }
            return uri;
        },
        transformOutgoing(uri) {
            // file:///path → vscode-remote://authority/path
            if (uri.scheme === "file") {
                return { scheme: "vscode-remote", authority: remoteAuthority, path: uri.path };
            }
            // vscode-local:///local → file:///local
            if (uri.scheme === "vscode-local") {
                return { scheme: "file", authority: "", path: uri.path };
            }
            return uri;
        },
    };
}
// ============================================================================
// Remote Agent Connection —— 把所有 Remote 抽象串起来
// ============================================================================
/**
 * 重连策略
 */
const RECONNECT_DELAYS = [0, 5, 5, 10, 10, 10, 10, 10, 30]; // 秒
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
export class RemoteAgentConnection {
    authority;
    resolverService;
    socketFactory;
    protocol = null;
    client = null;
    _onDidStateChange = new Emitter();
    onDidStateChange = this._onDidStateChange.event;
    constructor(authority, resolverService, socketFactory) {
        this.authority = authority;
        this.resolverService = resolverService;
        this.socketFactory = socketFactory;
    }
    /**
     * 建立连接并返回 IPCClient
     */
    async connect() {
        // Step 1: 解析 authority
        const resolved = await this.resolverService.resolveAuthority(this.authority);
        // Step 2: 建立 socket
        const query = resolved.connectionToken ? `token=${resolved.connectionToken}` : "";
        const socket = await this.socketFactory.connect(resolved.connectTo, "/", query);
        // Step 3: 用 PersistentProtocol 包装（加 ACK + 重连能力）
        this.protocol = new PersistentProtocol(socket);
        // Step 4: 包装为 IPCClient
        this.client = new IPCClient(this.protocol, this.authority);
        // Step 5: 监听断线，触发重连
        this.protocol.onSocketClose(() => {
            this._onDidStateChange.fire({ type: "reconnecting" });
            this.reconnect(resolved, 0);
        });
        this._onDidStateChange.fire({ type: "connected" });
        return this.client;
    }
    async reconnect(resolved, attempt) {
        if (attempt >= RECONNECT_DELAYS.length) {
            this._onDidStateChange.fire({ type: "disconnected" });
            return;
        }
        const delay = RECONNECT_DELAYS[attempt] * 1000;
        await new Promise((r) => setTimeout(r, delay));
        try {
            const query = resolved.connectionToken ? `token=${resolved.connectionToken}` : "";
            const newSocket = await this.socketFactory.connect(resolved.connectTo, "/", query);
            // 用新 socket 替换，PersistentProtocol 会自动重放未确认的消息
            this.protocol.replaceSocket(newSocket);
            this._onDidStateChange.fire({ type: "connected" });
        }
        catch {
            this.reconnect(resolved, attempt + 1);
        }
    }
    dispose() {
        this.client?.dispose();
        this.protocol?.dispose();
        this._onDidStateChange.dispose();
    }
}
//# sourceMappingURL=remote.js.map