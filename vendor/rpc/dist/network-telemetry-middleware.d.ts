/**
 * RPC 调用网络遥测：记录 channel.command 级成功率与耗时，供桌面主进程聚合上报 ARMS。
 */
import type { IChannelServer, IChannelClient, IChannel, IServerChannel } from "./channels.js";
export type NetworkTransportKind = "http" | "websocket" | "rpc";
export interface NetworkObservation {
    transport: NetworkTransportKind;
    interface: string;
    durationMs: number;
    ok: boolean;
    statusCode?: number;
    errorKind?: string;
    attempt?: number;
    dnsMs?: number;
    tcpMs?: number;
    tlsMs?: number;
    ttfbMs?: number;
    downloadMs?: number;
}
export type NetworkTelemetrySink = (observation: NetworkObservation) => void;
export declare function setNetworkTelemetrySink(sink: NetworkTelemetrySink | null): void;
export declare function emitNetworkTelemetryObservation(observation: NetworkObservation): void;
/** 装饰 ChannelServer，为 RPC call 写入网络遥测 */
export declare class NetworkTelemetryChannelServer<TContext = string> implements IChannelServer<TContext> {
    private inner;
    constructor(inner: IChannelServer<TContext>);
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    ready(): void;
}
/** 装饰 ChannelClient（renderer 侧可选，与 server 侧二选一即可避免双计） */
export declare class NetworkTelemetryChannelClient implements IChannelClient {
    private inner;
    constructor(inner: IChannelClient);
    getChannel<T extends IChannel>(channelName: string): T;
}
//# sourceMappingURL=network-telemetry-middleware.d.ts.map