/**
 * IPC Framework —— 统一导出
 *
 * 架构总览（从底到顶）：
 *
 * ┌──────────────────────────────────────────────────────────────┐
 * │  Layer 6: Remote 远程连接                                     │
 * │  RemoteAuthorityResolver → SocketFactory → PersistentProtocol │
 * │  → IPCClient → channel.call()                                │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 5: ProxyChannel 服务自动代理                            │
 * │  fromService(service) ↔ toService(channel)                   │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 4: IPCServer(1:N) / IPCClient(1:1 双向)               │
 * │  连接管理、路由、多播                                          │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 3: ChannelServer / ChannelClient                      │
 * │  基于 Channel 的 RPC (call/listen)                            │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 2: IMessagePassingProtocol                            │
 * │  send(buffer) / onMessage: Event<buffer>                     │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 1: 序列化 (VQL + 类型标签)                             │
 * │  serialize() / deserialize()                                  │
 * ├──────────────────────────────────────────────────────────────┤
 * │  Layer 0: 基础设施                                            │
 * │  Event / Emitter / Disposable / VSBuffer / CancellationToken │
 * └──────────────────────────────────────────────────────────────┘
 */
export { type IDisposable, toDisposable, DisposableStore, Event, Emitter, Relay, EventMultiplexer, type CancellationToken, CancellationTokenSource, } from "./foundation.js";
export { VSBuffer } from "./buffer.js";
export { type IReader, type IWriter, BufferReader, BufferWriter, serialize, deserialize, } from "./serialization.js";
export { type IMessagePassingProtocol, type ConnectionFlowControl, type MessagePortFlowControl, type MessagePortFlowState, type MessagePortPayload, type ISocket, ChunkStream, SocketProtocol, ProtocolMessageType, ProtocolMessage, MessagePortProtocol, type MessagePortLike, createQueuePair, } from "./protocol.js";
export { PersistentProtocol, type PersistentProtocolOptions } from "./persistent-protocol.js";
export { type IChannel, type IServerChannel, type IChannelServer, type IChannelClient, ChannelServer, ChannelClient, getDelayedChannel, } from "./channels.js";
export { type ClientConnectionEvent, type Client, type IConnectionHub, type IClientRouter, IPCServer, IPCClient, StaticRouter, } from "./ipc.js";
export { ProxyChannel } from "./proxy-channel.js";
export { type RPCLogger, LoggingChannelServer, LoggingChannelClient, } from "./logging-middleware.js";
export { type NetworkTransportKind, type NetworkObservation, type NetworkTelemetrySink, setNetworkTelemetrySink, emitNetworkTelemetryObservation, NetworkTelemetryChannelServer, NetworkTelemetryChannelClient, } from "./network-telemetry-middleware.js";
export { RemoteConnectionType, WebSocketRemoteConnection, ManagedRemoteConnection, type RemoteConnection, type ResolvedAuthority, type IRemoteAuthorityResolver, RemoteAuthorityResolverService, type ISocketFactory, RemoteSocketFactoryService, type IURITransformer, type SimpleURI, createURITransformer, RemoteAgentConnection, type RemoteConnectionState, } from "./remote.js";
//# sourceMappingURL=index.d.ts.map