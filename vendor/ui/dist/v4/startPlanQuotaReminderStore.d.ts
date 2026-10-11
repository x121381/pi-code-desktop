/** 10% 提醒记录唯一 owner；已展示事实持久化，当前展示实例只留在内存。 */
export declare function createStartPlanQuotaReminderStore(options?: {
    storage?: () => Storage | null;
}): {
    isHidden(key: string, owner: object, referenceTime: number): boolean;
    markShown(key: string, expiresAt: number, owner: object, referenceTime: number): void;
    dismiss(key: string): void;
    subscribe(listener: () => void): () => void;
    getSnapshot: () => number;
};
export declare const startPlanQuotaReminderStore: {
    isHidden(key: string, owner: object, referenceTime: number): boolean;
    markShown(key: string, expiresAt: number, owner: object, referenceTime: number): void;
    dismiss(key: string): void;
    subscribe(listener: () => void): () => void;
    getSnapshot: () => number;
};
//# sourceMappingURL=startPlanQuotaReminderStore.d.ts.map