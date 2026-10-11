export type GlobalNoticePriority = "low" | "normal" | "high";
export type GlobalNoticeInterruptPolicy = "passive" | "replace-lower-priority";
export interface GlobalNoticeEnvelope {
    noticeId: string;
    dedupeKey: string;
    type: string;
    schemaVersion: number;
    scope: "user" | "workspace" | "task";
    priority: GlobalNoticePriority;
    interruptPolicy: GlobalNoticeInterruptPolicy;
    createdAt: number;
    expiresAt?: number;
    payload: Record<string, unknown>;
    actions: Array<{
        id: string;
        label: string;
    }>;
    dismissPolicy: {
        kind: "none";
    } | {
        kind: "cooldown";
        cooldownMs: number;
    };
    persistencePolicy: "memory" | "latest-only";
    source: string;
    revision: number;
}
interface PersistedGlobalNoticeState {
    version: 1;
    latest: GlobalNoticeEnvelope | null;
    dismissedUntilByKey: Record<string, number>;
    requiresPublishAfterDismissalByKey: Record<string, boolean>;
}
export interface GlobalNoticeStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}
export interface GlobalNoticeStore {
    publish(notice: GlobalNoticeEnvelope): void;
    dismiss(noticeId: string): void;
    getVisible(): GlobalNoticeEnvelope | null;
    getSnapshot(): PersistedGlobalNoticeState;
    subscribe(listener: () => void): () => void;
}
export declare function createGlobalNoticeStore(options: {
    storage: GlobalNoticeStorage;
    now?: () => number;
    /** 持久化失败（QuotaExceeded、存储被禁用）的受控回调；缺省静默，浏览器入口接 logger.warn。 */
    onPersistError?: (error: unknown) => void;
}): GlobalNoticeStore;
export declare const browserGlobalNoticeStore: GlobalNoticeStore | null;
export {};
//# sourceMappingURL=globalNoticeStore.d.ts.map