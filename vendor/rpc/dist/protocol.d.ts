/**
 * Layer 2: 传输协议抽象
 *
 * IMessagePassingProtocol 是整个 IPC 框架的"腰部"——
 * 它上面是 Channel RPC 层（完全传输无关），
 * 它下面是各种具体传输实现（Electron/MessagePort/Socket/ChildProcess）。
 *
 * 只要实现 send() 和 onMessage，就能接入整个 RPC 框架。
 */
import { VSBuffer } from "./buffer.js";
import { Event, IDisposable } from "./foundation.js";
/**
 * IMessagePassingProtocol —— 整个框架的核心抽象
 *
 * 这就是 VS Code 通信能力的秘密：上层代码只看到 send/onMessage，
 * 不管底层是 Electron IPC、MessagePort、WebSocket 还是 TCP Socket。
 */
export interface IMessagePassingProtocol {
    send(buffer: VSBuffer): void;
    readonly onMessage: Event<VSBuffer>;
    drain?(): Promise<void>;
}
/**
 * 连接级只读流控观察面。
 *
 * transport 负责维护未确认字节与状态边沿；业务层只能订阅，不能伪造 ACK 或直接改水位。
 */
export interface ConnectionFlowControl {
    readonly unacknowledgedBytes: number;
    readonly onSaturated: Event<void>;
    readonly onDrained: Event<void>;
}
export type MessagePortFlowState = "saturated" | "drained";
export interface MessagePortFlowControl {
    __zcodeRpcControl: "connection-flow-v1";
    state: MessagePortFlowState;
}
export type MessagePortPayload = Uint8Array | MessagePortFlowControl;
/**
 * ISocket 抽象了底层的网络 socket。
 * 在 Node.js 环境是 net.Socket，在浏览器环境是 WebSocket。
 */
export interface ISocket extends IDisposable {
    onData: Event<VSBuffer>;
    onClose: Event<void>;
    onEnd: Event<void>;
    write(buffer: VSBuffer): void;
    end(): void;
    drain(): Promise<void>;
}
/**
 * TCP 是流式协议，一次 write 不代表对面一次 read 就能完整收到。
 * ChunkStream 把收到的碎片攒起来，按需读取指定字节数。
 */
export declare class ChunkStream {
    private chunks;
    private totalLength;
    get byteLength(): number;
    acceptChunk(chunk: VSBuffer): void;
    /**
     * 预览前 byteCount 字节，但不消费底层缓冲。
     *
     * Socket/stdio 传输天然可能分片。
     * 之前协议层在 body 还没收全时就先把 header read 掉，后续再来的 body
     * 会失去对应的帧头，导致消息永远卡住。这里提供 peek，让调用方先判断
     * “整帧是否已经到齐”，确认足够后再真正消费。
     */
    peek(byteCount: number): VSBuffer | null;
    /** 丢弃前 byteCount 字节 */
    skip(byteCount: number): void;
    /** 读取 byteCount 字节，不够就返回 null */
    read(byteCount: number): VSBuffer | null;
}
/**
 * 消息帧格式 (13 bytes header):
 *
 * ┌─────────┬──────────┬──────────┬──────────────┐
 * │ type(1) │  id(4)   │  ack(4)  │  length(4)   │
 * └─────────┴──────────┴──────────┴──────────────┘
 *
 * type:   消息类型（Regular, Ack, KeepAlive 等）
 * id:     消息序号
 * ack:    确认号（告诉对方"我已收到你的消息到第 ack 号"）
 * length: payload 长度
 */
export declare enum ProtocolMessageType {
    None = 0,
    Regular = 1,
    Control = 2,
    Ack = 3,
    Disconnect = 5,
    ReplayRequest = 6,
    Pause = 7,
    Resume = 8,
    KeepAlive = 9
}
export declare const HEADER_SIZE = 13;
export declare class ProtocolMessage {
    readonly type: ProtocolMessageType;
    readonly id: number;
    readonly ack: number;
    readonly data: VSBuffer;
    constructor(type: ProtocolMessageType, id: number, ack: number, data: VSBuffer);
    get byteLength(): number;
}
export declare function writeProtocolMessage(msg: ProtocolMessage): VSBuffer;
/**
 * 基础 Protocol: 在 ISocket 上加消息帧，实现 IMessagePassingProtocol。
 * 只做消息分帧，不做 ACK/重连（那是 PersistentProtocol 的事）。
 */
export declare class SocketProtocol implements IMessagePassingProtocol {
    private socket;
    private readonly _onMessage;
    readonly onMessage: Event<VSBuffer>;
    private readonly chunkStream;
    private readonly disposables;
    constructor(socket: ISocket);
    send(buffer: VSBuffer): void;
    private writeMessage;
    private readMessages;
    drain(): Promise<void>;
    dispose(): void;
}
/**
 * 创建一对通过内存队列连接的 protocol，
 * 一端 send 的消息会出现在另一端的 onMessage。
 * 非常适合单元测试，不需要真正的网络连接。
 */
export declare function createQueuePair(): [IMessagePassingProtocol, IMessagePassingProtocol];
/**
 * MessagePort 接口的最小声明，
 * 使得这个 Protocol 可以同时在浏览器和 Electron 中使用。
 */
export interface MessagePortLike {
    addEventListener(type: "message", listener: (e: {
        data: MessagePortPayload;
    }) => void): void;
    removeEventListener(type: "message", listener: (e: {
        data: MessagePortPayload;
    }) => void): void;
    postMessage(message: MessagePortPayload): void;
    start(): void;
    close(): void;
}
/**
 * 在 MessagePort 上实现 IMessagePassingProtocol。
 * 这是最简单的传输实现——不需要分帧，因为 MessagePort 本身就是消息边界的。
 */
export declare class MessagePortProtocol implements IMessagePassingProtocol {
    private port;
    private readonly _onMessage;
    readonly onMessage: Event<VSBuffer>;
    private readonly _onFlowState;
    readonly onFlowState: Event<MessagePortFlowState>;
    private readonly handler;
    constructor(port: MessagePortLike);
    send(buffer: VSBuffer): void;
    sendFlowState(state: MessagePortFlowState): void;
    disconnect(): void;
}
//# sourceMappingURL=protocol.d.ts.map