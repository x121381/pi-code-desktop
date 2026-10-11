export interface SessionQuotaBannerDismissalStore {
    dismiss(sessionId: string, dismissKey: string): void;
    getSnapshot(): number;
    isDismissed(sessionId: string, dismissKey: string): boolean;
    subscribe(listener: () => void): () => void;
}
/** Renderer 生命周期内的 session-scoped dismissal；不持久化、不跨客户端同步。 */
export declare function createSessionQuotaBannerDismissalStore(maxEntries?: number): SessionQuotaBannerDismissalStore;
export declare const sessionQuotaBannerDismissalStore: SessionQuotaBannerDismissalStore;
//# sourceMappingURL=sessionQuotaBannerDismissalStore.d.ts.map