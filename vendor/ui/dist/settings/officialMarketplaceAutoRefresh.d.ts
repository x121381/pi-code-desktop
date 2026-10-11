export declare const OFFICIAL_MARKETPLACE_AUTO_REFRESH_INTERVAL_MS: number;
export declare function shouldAutoRefreshMarketplace(params: {
    lastUpdated?: string;
    lastAttemptAt?: number;
    now: number;
}): boolean;
/**
 * 判定是否应自动刷新，通过则立刻占位（记录本次尝试时间）并返回 true。
 * 判定与占位一步完成，避免同一挂载期间 effect 重跑或快速进出商店页时重复发起。
 */
export declare function claimMarketplaceAutoRefresh(marketplaceId: string, lastUpdated: string | undefined, now?: number): boolean;
export declare function resetMarketplaceAutoRefreshForTests(): void;
//# sourceMappingURL=officialMarketplaceAutoRefresh.d.ts.map