import { type IDisposable } from "./foundation.js";
import type { IMessagePassingProtocol } from "./protocol.js";
import { type IChannelServer, type IServerChannel } from "./channels.shared.js";
export declare class ChannelServer<TContext = string> implements IChannelServer<TContext>, IDisposable {
    private protocol;
    private ctx;
    private timeoutDelay;
    private deferInit;
    private channels;
    private activeRequests;
    private pendingRequests;
    private protocolListener;
    constructor(protocol: IMessagePassingProtocol, ctx: TContext, timeoutDelay?: number, deferInit?: boolean);
    ready(): void;
    registerChannel(channelName: string, channel: IServerChannel<TContext>): void;
    private sendResponse;
    private send;
    private onRawMessage;
    private onPromise;
    private onEventListen;
    private disposeActiveRequest;
    private collectPendingRequest;
    private flushPendingRequests;
    dispose(): void;
}
//# sourceMappingURL=channelServer.d.ts.map