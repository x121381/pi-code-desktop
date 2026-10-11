import type { ZCodePersistedFileChange, ZCodeTaskChangeSummary } from "@zcode/shared";
/**
 * 按轮次分组构建文件变更摘要。
 * 每个轮次独立计算 diff，用于在每条 assistant 消息下方显示该轮的文件改动。
 */
export declare function buildPerTurnChangeSummaries(fileChanges: readonly ZCodePersistedFileChange[] | undefined): Map<number, ZCodeTaskChangeSummary>;
export declare function buildTaskChangeSummary(fileChanges: readonly ZCodePersistedFileChange[] | undefined): ZCodeTaskChangeSummary | undefined;
//# sourceMappingURL=taskChangeSummary.d.ts.map