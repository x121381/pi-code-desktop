import { type CommandEnvelope, type CommandPayloadMap, type CommandType } from "@zcode/shared/zcode-protocol-v4";
export { uuidv7 } from "@zcode/shared";
/**
 * 本客户端实例的稳定 clientId。优先 localStorage 持久化（刷新后不变，
 * 幂等表跨刷新仍能识别重试）；无 storage 环境退化为进程内稳定。
 */
export declare function getV4ClientId(): string;
export interface CreateCommandEnvelopeInput<T extends CommandType> {
    type: T;
    payload: CommandPayloadMap[T];
    /** createSession 时为 null。 */
    sessionId: string | null;
    baseRevision?: number;
    baseLogEpoch?: string;
}
/** 构造命令信封；CAS 命令缺 baseRevision 直接抛（客户端编程错误就地暴露）。 */
export declare function createCommandEnvelope<T extends CommandType>(input: CreateCommandEnvelopeInput<T>): CommandEnvelope;
//# sourceMappingURL=commandFactory.d.ts.map