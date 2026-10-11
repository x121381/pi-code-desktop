import type { ZCodeEnv } from "@zcode/shared";
export declare function resolveMarketingTouchPollIntervalMs(isProductionBuild: boolean, env: ZCodeEnv): number;
/** 唯一串行调度器；用户触发在途刷新合并为一次后续查询。 */
export declare function createMarketingTouchPoller(options: {
    query: () => Promise<void>;
    visible: () => boolean;
    intervalMs: number;
}): {
    refresh: () => void;
    visibilityChanged(): void;
    dispose(): void;
};
//# sourceMappingURL=marketingTouchPoller.d.ts.map