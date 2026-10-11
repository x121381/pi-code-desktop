/**
 * PersistentProtocol —— 可靠性层（从 protocol.ts 拆出，避免单文件超限）。
 *
 * 在 SocketProtocol 之上添加：
 * - 消息 ACK 确认机制
 * - 心跳保活 (keepAlive)
 * - 断线重连时重放未确认的消息（有界：字节上限 + 时间宽限窗）
 * - 拥塞信号：unacknowledgedBytes 水位 + onSaturated/onDrained
 *   （帧级对事件级的唯一新增接口——事件级据此暂停
 *   drain，丢弃/降级永远发生在通道层、进 rpc 之前；接了 send() 的帧绝不丢）
 *
 * 关键：Channel RPC 层完全不知道 PersistentProtocol 的存在，
 * 它只看到 IMessagePassingProtocol 接口。这就是分层抽象的威力。
 */
import { VSBuffer } from "./buffer.js";
import { type ConnectionFlowControl, type IMessagePassingProtocol, type ISocket } from "./protocol.js";
/** PersistentProtocol 可调参数（v4 通道层补丁）。 */
export interface PersistentProtocolOptions {
    /** 未 ACK 字节高水位：越过即 onSaturated（上层暂停 drain，让 coalesce 吸收）。 */
    saturationHighWaterMarkBytes?: number;
    /** 未 ACK 字节低水位：饱和后回落至此即 onDrained（上层恢复 drain）。 */
    saturationLowWaterMarkBytes?: number;
    /** 重放缓冲字节上限：越界 = 放弃协议会话（onClose），客户端走 subscribe(base)。 */
    replayBufferMaxBytes?: number;
    /** 重放缓冲时间宽限窗（ms）：最老未 ACK 消息超龄同样放弃会话。 */
    replayBufferGraceMs?: number;
}
export declare class PersistentProtocol implements IMessagePassingProtocol, ConnectionFlowControl {
    private readonly _onMessage;
    readonly onMessage: import("./foundation.js").Event<VSBuffer>;
    private readonly _onClose;
    readonly onClose: import("./foundation.js").Event<void>;
    private readonly _onSocketClose;
    readonly onSocketClose: import("./foundation.js").Event<void>;
    private readonly _onSaturated;
    readonly onSaturated: import("./foundation.js").Event<void>;
    private readonly _onDrained;
    readonly onDrained: import("./foundation.js").Event<void>;
    private socket;
    private chunkStream;
    private disposables;
    private outgoingMsgId;
    private outgoingUnackMsg;
    private incomingAckId;
    private unackBytes;
    private saturated;
    private overflowed;
    private keepAliveTimer;
    private readonly KEEP_ALIVE_INTERVAL;
    private ackCheckTimer;
    private readonly ACK_TIMEOUT;
    private lastAckTime;
    private readonly saturationHighWaterMarkBytes;
    private readonly saturationLowWaterMarkBytes;
    private readonly replayBufferMaxBytes;
    private readonly replayBufferGraceMs;
    constructor(socket: ISocket, options?: PersistentProtocolOptions);
    /** 当前未被对端 ACK 的 payload 字节数（只读拥塞观测点）。 */
    get unacknowledgedBytes(): number;
    private bindSocket;
    send(buffer: VSBuffer): void;
    /**
     * 重连时替换底层 socket，并重放所有未被确认的消息。
     * 这就是为什么 Remote 模式断线恢复后不丢消息的原因。
     */
    replaceSocket(newSocket: ISocket): void;
    private writeMessage;
    private readMessages;
    /** 根据对方的 ACK 号清除已确认的消息 */
    private processAck;
    /**
     * 重放缓冲越界（字节/宽限窗）：这条协议会话已不可能无损续传，
     * 主动断开走 onClose，客户端用 subscribe(base) 语义层恢复。
     */
    private abandonSession;
    private startKeepAlive;
    private startAckCheck;
    drain(): Promise<void>;
    dispose(): void;
}
//# sourceMappingURL=persistent-protocol.d.ts.map