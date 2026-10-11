/** 未测量行的兜底估计高度（与旧 ConversationTimeline 的 ROW_ESTIMATE_PX 一致）。 */
export declare const DEFAULT_ROW_HEIGHT_ESTIMATE_PX = 72;
/** 缓存上限：超长会话防内存膨胀；淘汰最久未写入的行（写入序 ≈ 行序，旧行先淘汰）。 */
export declare const MAX_ROW_HEIGHT_CACHE_ENTRIES = 4000;
export type TimelineRowHeightCacheKey = string | number;
export declare class TimelineRowHeightCache {
    private readonly maxEntries;
    private readonly sizes;
    constructor(maxEntries?: number);
    get size(): number;
    /** 记录一次真实测量。重复写入会刷新淘汰顺序（活跃行不被淘汰）。 */
    set(key: TimelineRowHeightCacheKey, heightPx: number): void;
    get(key: TimelineRowHeightCacheKey): number | undefined;
    /** estimateSize 入口：有测量用测量，无测量回落估计值。 */
    estimate(key: TimelineRowHeightCacheKey | undefined, fallbackPx?: number): number;
    /** 会话切换时整体重置（turnId 在不同 session 间也不能假设全局唯一）。 */
    clear(): void;
}
//# sourceMappingURL=timelineRowHeightCache.d.ts.map