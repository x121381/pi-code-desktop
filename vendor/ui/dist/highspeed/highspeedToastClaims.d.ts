/**
 * 降级事件可能因 snapshot 重放或 SessionPane 重挂载被观察多次；模块级 claim 保证 Toast 只提示一次。
 */
export declare function claimHighspeedFallbackToast(sourceCommandId: string): boolean;
//# sourceMappingURL=highspeedToastClaims.d.ts.map