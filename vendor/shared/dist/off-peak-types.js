/** 终态集合：不可逆出（状态机不变量）。 */
export const OFF_PEAK_TERMINAL_STATUSES = ["completed", "failed", "cancelled"];
export function isOffPeakTerminalStatus(status) {
    return OFF_PEAK_TERMINAL_STATUSES.includes(status);
}
/**
 * 票据不可用（服务端 400/3102：active 3h 到期 / ready 5min 废票 / settled / 非本人）的
 * 稳定错误标记。zcode-cli 适配层把该业务码分类为不可重试失败并在错误消息里嵌入本标记；
 * host 终态回写据此改走"同 task_id 重新取号 → resume 续跑"而非落 failed。
 * 跨进程只能靠错误文本传递，标记必须全链路唯一且稳定，勿改；与
 * apps/zcode-cli/packages/adapters/src/model/offpeak-retry.ts 的同名常量跨包同值。
 */
export const OFF_PEAK_TICKET_EXPIRED_MARKER = "off-peak-ticket-expired";
/** Off-Peak Provider 与当前账号 Family 同身份；任务保存精确选择，不跨 Family 静默迁移。 */
export const OFF_PEAK_PROVIDER_IDS = {
    zai: "account:zai-offpeak-idle-plan",
    bigmodel: "account:bigmodel-offpeak-idle-plan",
};
export function resolveOffPeakProviderId(family) {
    return OFF_PEAK_PROVIDER_IDS[family];
}
export function isOffPeakTicketExpiredError(message) {
    return Boolean(message?.includes(OFF_PEAK_TICKET_EXPIRED_MARKER));
}
//# sourceMappingURL=off-peak-types.js.map