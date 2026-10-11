import { type CommandAck, type CommandEnvelope, type CommandPayloadMap, type CommandType } from "@zcode/shared/zcode-protocol-v4";
/** uuid v7（RFC 9562）：48-bit Unix ms 时间戳 + 74-bit 随机；与 renderer 工厂同构。 */
export declare function uuidv7(now?: number): string;
export declare function getHostV4ClientId(): string;
export interface CreateHostCommandEnvelopeInput<T extends CommandType> {
    type: T;
    payload: CommandPayloadMap[T];
    /** createSession 时为 null。 */
    sessionId: string | null;
    /**
     * 幂等键。手机 replayable 的 send_prompt 用 inputId（=traceId）作 commandId：
     * CLI 侧 sendText 以 commandId 为 inputId 起 turn，终态事件的 inputId 才能与
     * host command queue 的 traceId 对账收口（inputId→commandId 对齐）。
     * 缺省生成 uuid v7（stop/resolveInteraction 等一次性命令）。
     */
    commandId?: string;
    /** 手机 replayable 保留原提交端 clientId；缺省用 host 进程稳定 id。 */
    clientId?: string;
    baseRevision?: number;
    baseLogEpoch?: string;
}
/** 构造 host 侧命令信封；CAS 命令缺 baseRevision 就地抛出。 */
export declare function createHostCommandEnvelope<T extends CommandType>(input: CreateHostCommandEnvelopeInput<T>): CommandEnvelope;
/** v4 命令被服务端否决（rejected/stale/failed）。code 供调用方结构化分流，不匹配错误文案。 */
export declare class ZCodeV4CommandRejectedError extends Error {
    readonly commandType: CommandType;
    readonly ack: CommandAck;
    readonly code = "ZCODE_V4_COMMAND_REJECTED";
    constructor(commandType: CommandType, ack: CommandAck, contextMessage: string);
}
/**
 * ACK 错误映射（旧 op 抛错语义 → v4 六态）：
 * - accepted：正常收口；duplicate：同 commandId 重试回放，幂等成功；
 * - noop：晚到应答/已收口，幂等成功（resolveInteraction 先到先得语义）；
 * - rejected/stale/failed：抛结构化错误，reasonCode 原样携带给调用方。
 */
export declare function assertV4CommandAckOk(commandType: CommandType, ack: CommandAck, contextMessage: string): CommandAck;
/**
 * CAS 命令的 host 侧提交（配置写下沉）：host services 没有本地 v4 投影，
 * 拿不到当前 conversation revision——「stale ACK 必带 revisionAtDecision」
 * 用服务端回报的最新 revision 收敛重试，与 renderer 的 dispatchConfigCas 同构
 * （packages/ui/src/v4/SessionPane.tsx）。首发 baseRevision=0 作探测，典型路径一次
 * stale 即命中；每次尝试新 commandId（stale 裁决不进幂等表，语义等价且避免歧义）。
 * 旧 facade 从不带 expectedRevision（无 CAS），这里 stale 仅意味着并发推进而非冲突，
 * 重试即为「无 CAS 提交」语义的保真；连续用尽仅在病态并发下出现，按拒绝抛出。
 */
export declare function sendHostCasCommandV4<T extends CommandType>(input: {
    send: (envelope: CommandEnvelope) => Promise<CommandAck>;
    type: T;
    payload: CommandPayloadMap[T];
    sessionId: string;
    contextMessage: string;
    maxAttempts?: number;
}): Promise<CommandAck>;
//# sourceMappingURL=zcodeV4HostCommand.d.ts.map