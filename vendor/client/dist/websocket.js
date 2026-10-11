import { Emitter, VSBuffer, SocketProtocol, ChannelClient, } from "@zcode/rpc";
import { RemoteServiceAccess } from "./remoteServiceAccess.js";
function wrapBrowserWebSocket(ws) {
    const onData = new Emitter();
    const onClose = new Emitter();
    const onEnd = new Emitter();
    ws.binaryType = "arraybuffer";
    ws.addEventListener("message", (e) => {
        onData.fire(VSBuffer.wrap(new Uint8Array(e.data)));
    });
    ws.addEventListener("close", () => {
        onClose.fire();
        onEnd.fire();
    });
    ws.addEventListener("error", () => {
        onClose.fire();
        onEnd.fire();
    });
    return {
        onData: onData.event,
        onClose: onClose.event,
        onEnd: onEnd.event,
        write(buffer) {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(buffer.buffer);
            }
        },
        end() {
            ws.close();
        },
        drain() {
            return Promise.resolve();
        },
        dispose() {
            ws.close();
        },
    };
}
export function connectViaWebSocket(wsUrl, options) {
    return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        let settled = false;
        ws.addEventListener("error", () => {
            if (!settled) {
                reject(new Error(`WebSocket connection failed: ${wsUrl}`));
            }
        });
        ws.addEventListener("close", (event) => {
            options?.onClose?.({
                code: event.code,
                reason: event.reason,
                wasClean: event.wasClean,
            });
            if (!settled) {
                reject(new Error(event.reason
                    ? `WebSocket closed before ready: ${event.reason}`
                    : `WebSocket closed before ready (${event.code})`));
            }
        });
        ws.addEventListener("open", () => {
            settled = true;
            options?.onOpenSocket?.(ws);
            const socket = wrapBrowserWebSocket(ws);
            resolve(connectViaProtocol(new SocketProtocol(socket)));
        });
    });
}
export function connectViaProtocol(protocol) {
    const client = new ChannelClient(protocol);
    return new RemoteServiceAccess(client);
}
//# sourceMappingURL=websocket.js.map