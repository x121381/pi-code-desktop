import { CancellationTokenSource, toDisposable } from "./foundation.js";
import { BufferReader, BufferWriter, deserialize, serialize } from "./serialization.js";
export class ChannelServer {
    protocol;
    ctx;
    timeoutDelay;
    deferInit;
    channels = new Map();
    activeRequests = new Map();
    pendingRequests = new Map();
    protocolListener;
    constructor(protocol, ctx, timeoutDelay = 1000, deferInit = false) {
        this.protocol = protocol;
        this.ctx = ctx;
        this.timeoutDelay = timeoutDelay;
        this.deferInit = deferInit;
        this.protocolListener = this.protocol.onMessage((msg) => this.onRawMessage(msg));
        if (!this.deferInit) {
            this.sendResponse({ type: 200 /* ResponseType.Initialize */ });
        }
    }
    ready() {
        this.sendResponse({ type: 200 /* ResponseType.Initialize */ });
    }
    registerChannel(channelName, channel) {
        this.channels.set(channelName, channel);
        setTimeout(() => this.flushPendingRequests(channelName), 0);
    }
    sendResponse(response) {
        switch (response.type) {
            case 200 /* ResponseType.Initialize */:
                this.send([response.type]);
                return;
            case 201 /* ResponseType.PromiseSuccess */:
            case 202 /* ResponseType.PromiseError */:
            case 204 /* ResponseType.EventFire */:
            case 203 /* ResponseType.PromiseErrorObj */:
                this.send([response.type, response.id], response.data);
                return;
        }
    }
    send(header, body = undefined) {
        const writer = new BufferWriter();
        serialize(writer, header);
        serialize(writer, body);
        try {
            this.protocol.send(writer.buffer);
        }
        catch {
            /* noop */
        }
    }
    onRawMessage(message) {
        const reader = new BufferReader(message);
        const header = deserialize(reader);
        const body = deserialize(reader);
        const type = header[0];
        switch (type) {
            case 100 /* RequestType.Promise */:
                this.onPromise({
                    type,
                    id: header[1],
                    channelName: header[2],
                    name: header[3],
                    arg: body,
                });
                return;
            case 102 /* RequestType.EventListen */:
                this.onEventListen({
                    type,
                    id: header[1],
                    channelName: header[2],
                    name: header[3],
                    arg: body,
                });
                return;
            case 101 /* RequestType.PromiseCancel */:
            case 103 /* RequestType.EventDispose */:
                this.disposeActiveRequest(header[1]);
                return;
        }
    }
    onPromise(request) {
        const channel = this.channels.get(request.channelName);
        if (!channel) {
            this.collectPendingRequest(request);
            return;
        }
        const cts = new CancellationTokenSource();
        let promise;
        try {
            promise = channel.call(this.ctx, request.name, request.arg, cts.token);
        }
        catch (error) {
            promise = Promise.reject(error);
        }
        const disposable = toDisposable(() => cts.cancel());
        this.activeRequests.set(request.id, disposable);
        promise
            .then((data) => {
            this.sendResponse({
                id: request.id,
                data,
                type: 201 /* ResponseType.PromiseSuccess */,
            });
        }, (error) => {
            if (error instanceof Error) {
                const rpcErrorPayload = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack ? error.stack.split("\n") : undefined,
                };
                const errorRecord = error;
                const passthroughKeys = [
                    "code",
                    "kind",
                    "status",
                    "retryAfterMs",
                    "data",
                    "detail",
                    "details",
                    "taskId",
                    "traceId",
                ];
                for (const key of passthroughKeys) {
                    const value = errorRecord[key];
                    if (value !== undefined) {
                        rpcErrorPayload[key] = value;
                    }
                }
                this.sendResponse({
                    id: request.id,
                    data: rpcErrorPayload,
                    type: 202 /* ResponseType.PromiseError */,
                });
                return;
            }
            this.sendResponse({
                id: request.id,
                data: error,
                type: 203 /* ResponseType.PromiseErrorObj */,
            });
        })
            .finally(() => {
            disposable.dispose();
            this.activeRequests.delete(request.id);
        });
    }
    onEventListen(request) {
        const channel = this.channels.get(request.channelName);
        if (!channel) {
            this.collectPendingRequest(request);
            return;
        }
        const disposable = channel.listen(this.ctx, request.name, request.arg)((data) => {
            this.sendResponse({
                id: request.id,
                data,
                type: 204 /* ResponseType.EventFire */,
            });
        });
        this.activeRequests.set(request.id, disposable);
    }
    disposeActiveRequest(id) {
        const disposable = this.activeRequests.get(id);
        if (!disposable) {
            return;
        }
        disposable.dispose();
        this.activeRequests.delete(id);
    }
    collectPendingRequest(request) {
        const pendingRequests = this.pendingRequests.get(request.channelName) ?? [];
        if (pendingRequests.length === 0) {
            this.pendingRequests.set(request.channelName, pendingRequests);
        }
        const timer = setTimeout(() => {
            console.error(`Unknown channel: ${request.channelName}`);
            if (request.type !== 100 /* RequestType.Promise */) {
                return;
            }
            this.sendResponse({
                id: request.id,
                data: {
                    name: "Unknown channel",
                    message: `Channel name '${request.channelName}' timed out after ${this.timeoutDelay}ms`,
                    stack: undefined,
                },
                type: 202 /* ResponseType.PromiseError */,
            });
        }, this.timeoutDelay);
        pendingRequests.push({ request, timer });
    }
    flushPendingRequests(channelName) {
        const requests = this.pendingRequests.get(channelName);
        if (!requests) {
            return;
        }
        for (const { request, timer } of requests) {
            clearTimeout(timer);
            switch (request.type) {
                case 100 /* RequestType.Promise */:
                    this.onPromise(request);
                    break;
                case 102 /* RequestType.EventListen */:
                    this.onEventListen(request);
                    break;
            }
        }
        this.pendingRequests.delete(channelName);
    }
    dispose() {
        this.protocolListener?.dispose();
        this.protocolListener = null;
        for (const disposable of this.activeRequests.values()) {
            disposable.dispose();
        }
        this.activeRequests.clear();
    }
}
//# sourceMappingURL=channelServer.js.map