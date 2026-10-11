import { Event, type IDisposable } from "./foundation.js";
import type { IMessagePassingProtocol } from "./protocol.js";
import { type IChannel, type IChannelClient } from "./channels.shared.js";
export declare class ChannelClient implements IChannelClient, IDisposable {
    private protocol;
    private state;
    private isDisposed;
    private activeRequests;
    private handlers;
    private pendingRejections;
    private lastRequestId;
    private protocolListener;
    private readonly _onDidInitialize;
    readonly onDidInitialize: Event<void>;
    constructor(protocol: IMessagePassingProtocol);
    getChannel<T extends IChannel>(channelName: string): T;
    private requestPromise;
    private requestEvent;
    private sendRequest;
    private sendCancelOrDispose;
    private onBuffer;
    private onResponse;
    private whenInitialized;
    dispose(reason?: Error): void;
}
//# sourceMappingURL=channelClient.d.ts.map