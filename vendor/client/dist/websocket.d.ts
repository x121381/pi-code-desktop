import { type IMessagePassingProtocol } from "@zcode/rpc";
import type { IServiceAccessor } from "@zcode/services";
export interface WebSocketConnectionCloseEvent {
    code: number;
    reason: string;
    wasClean: boolean;
}
interface WebSocketConnectionOptions {
    onClose?: (event: WebSocketConnectionCloseEvent) => void;
    onOpenSocket?: (socket: WebSocket) => void;
}
export declare function connectViaWebSocket(wsUrl: string, options?: WebSocketConnectionOptions): Promise<IServiceAccessor>;
export declare function connectViaProtocol(protocol: IMessagePassingProtocol): IServiceAccessor;
export {};
//# sourceMappingURL=websocket.d.ts.map