let networkTelemetrySink = null;
export function setNetworkTelemetrySink(sink) {
    networkTelemetrySink = sink;
}
export function emitNetworkTelemetryObservation(observation) {
    networkTelemetrySink?.(observation);
}
function classifyErrorKind(error) {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
    if (message.includes("timeout") || message.includes("timed out")) {
        return "timeout";
    }
    if (message.includes("dns") || message.includes("getaddrinfo") || message.includes("enotfound")) {
        return "dns_failure";
    }
    if (message.includes("econnreset") ||
        message.includes("connection reset") ||
        message.includes("econnrefused")) {
        return "connection_reset";
    }
    return "other";
}
function emitRpcObservation(channelName, command, durationMs, ok, error) {
    emitNetworkTelemetryObservation({
        transport: "rpc",
        interface: `${channelName}.${command}`,
        durationMs: Math.max(0, Math.round(durationMs)),
        ok,
        errorKind: ok ? undefined : classifyErrorKind(error),
        attempt: 1,
    });
}
class NetworkTelemetryServerChannel {
    inner;
    channelName;
    constructor(inner, channelName) {
        this.inner = inner;
        this.channelName = channelName;
    }
    async call(ctx, command, arg, cancellationToken) {
        const start = performance.now();
        try {
            const result = await this.inner.call(ctx, command, arg, cancellationToken);
            emitRpcObservation(this.channelName, command, performance.now() - start, true);
            return result;
        }
        catch (error) {
            emitRpcObservation(this.channelName, command, performance.now() - start, false, error);
            throw error;
        }
    }
    listen(ctx, event, arg) {
        return this.inner.listen(ctx, event, arg);
    }
}
class NetworkTelemetryChannel {
    inner;
    channelName;
    constructor(inner, channelName) {
        this.inner = inner;
        this.channelName = channelName;
    }
    async call(command, arg, cancellationToken) {
        const start = performance.now();
        try {
            const result = await this.inner.call(command, arg, cancellationToken);
            emitRpcObservation(this.channelName, command, performance.now() - start, true);
            return result;
        }
        catch (error) {
            emitRpcObservation(this.channelName, command, performance.now() - start, false, error);
            throw error;
        }
    }
    listen(event, arg) {
        return this.inner.listen(event, arg);
    }
}
/** 装饰 ChannelServer，为 RPC call 写入网络遥测 */
export class NetworkTelemetryChannelServer {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    registerChannel(channelName, channel) {
        this.inner.registerChannel(channelName, new NetworkTelemetryServerChannel(channel, channelName));
    }
    ready() {
        this.inner.ready?.();
    }
}
/** 装饰 ChannelClient（renderer 侧可选，与 server 侧二选一即可避免双计） */
export class NetworkTelemetryChannelClient {
    inner;
    constructor(inner) {
        this.inner = inner;
    }
    getChannel(channelName) {
        const channel = this.inner.getChannel(channelName);
        return new NetworkTelemetryChannel(channel, channelName);
    }
}
//# sourceMappingURL=network-telemetry-middleware.js.map