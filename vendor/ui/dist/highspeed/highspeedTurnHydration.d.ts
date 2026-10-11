import type { HighspeedTranscriptRow, HighspeedTurnRecord } from "@/highspeed/highspeedTurnStore.js";
/** 水合一批 transcript row 的结果；store 按序应用后只发一次通知。 */
export interface HighspeedHydrationPlan {
    /** 需要落库的记录，按 transcript 顺序；`existed` 区分替换已有记录与新登记。 */
    records: Array<{
        record: HighspeedTurnRecord;
        existed: boolean;
    }>;
    /** 需要写入的卡级 TPS。 */
    cardTps: Array<[cardId: string, highspeedTps: number]>;
    /** 产生变化的 row 数；0 表示整批无变化，调用方不必通知订阅者。 */
    changedRows: number;
}
export interface HighspeedHydrationContext {
    sessionId: string;
    now: number;
    findRecord(sourceCommandId: string): HighspeedTurnRecord | null;
    getCardTps(cardId: string): number | undefined;
}
/**
 * 冷启动恢复与跨端追平：到期时 renderer 可能不在场，内存 store 没有机会登记/收口这张卡；
 * 远控 Renderer 也可能先登记运行中 row、桌面端随后才把完成态持久化进 transcript。
 * transcript 中的 userInput.highspeed 是持久事实，按 sourceCommandId 幂等合并（spec §8）。
 * Bug 根因：旧实现对已存在的 sourceCommandId 直接 continue，迟到的 outputTokens/durationMs/
 * highspeedTps/savedDurationMs 永远吸收不进来，远端的卡级 TPS、节省时间与自动分享候选无法收口。
 */
export declare function planHighspeedTranscriptHydration(rows: readonly HighspeedTranscriptRow[], context: HighspeedHydrationContext): HighspeedHydrationPlan;
//# sourceMappingURL=highspeedTurnHydration.d.ts.map