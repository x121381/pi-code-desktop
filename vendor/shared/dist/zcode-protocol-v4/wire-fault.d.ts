/**
 * 帧内容通过了 checksum/JSON，却没过 zod schema 的 reason code。
 *
 * 常量化而不是各处写字面量：判定这一侧与产出这一侧（wire-assembler、wire-reassembly）必须永远
 * 是同一个词——两处分叉的症状正是本模块要修的那类静默失配。
 */
export declare const WIRE_FAULT_INVALID_PAYLOAD = "proto.frameAssemblyInvalidPayload";
/**
 * 这个 fault 是不是「同一份内容再投一次必然再被拒」的确定性失败。
 *
 * 目前只有 schema 拒收一个。刻意**不**把 `proto.frameAssemblyInvalidJson` 也算进来：JSON 不合法
 * 也可能来自组装路径本身（分片拼接、编码边界），重投确实可能不同；把瞬态误判成确定性会让本该
 * 自愈的 gap 停在原地，那是比多一次无用重试更坏的失败。按证据逐个加，不按猜测扩大。
 */
export declare function isDeterministicContentFault(reasonCode: string | undefined): boolean;
/**
 * 内容确定性失败走到底的客户端终态 code（`fault.subscription.*` 是 04-sync 的词表）。
 *
 * 与 `fault.subscription.recoveryFailed` 分开是有用的区分，不是命名洁癖：后者是「链路没恢复
 * 过来」，重连有意义；本 code 是「本端读不懂对端发来的内容」，重连必然得到同样结果。遥测按
 * code 聚合，两者混在一起会把一次版本失配读成一片网络抖动。
 */
export declare const SUBSCRIPTION_CONTENT_REJECTED = "fault.subscription.contentRejected";
//# sourceMappingURL=wire-fault.d.ts.map