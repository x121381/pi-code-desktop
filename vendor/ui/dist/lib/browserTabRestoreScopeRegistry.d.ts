export type BrowserTabRestoreAttempt = symbol;
/**
 * Browser shell 冷恢复按 workspace scope 去重，同时用 attempt token 隔离迟到 promise。
 * cleanup 只能撤销自己创建的 in-flight；旧 attempt 不得覆盖新 attempt 的完成状态。
 */
export declare class BrowserTabRestoreScopeRegistry {
    private readonly scopes;
    begin(scopeKey: string): BrowserTabRestoreAttempt | null;
    complete(scopeKey: string, attempt: BrowserTabRestoreAttempt): boolean;
    cancel(scopeKey: string, attempt: BrowserTabRestoreAttempt): void;
    fail(scopeKey: string, attempt: BrowserTabRestoreAttempt): void;
    private releaseInFlight;
}
//# sourceMappingURL=browserTabRestoreScopeRegistry.d.ts.map