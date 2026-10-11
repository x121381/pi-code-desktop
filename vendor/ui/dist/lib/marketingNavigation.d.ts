import type { MarketingAction } from "@zcode/shared";
export type MarketingNavigationTarget = Extract<MarketingAction, {
    type: "navigate";
}>["args"];
export declare const marketingSettingsSections: {
    readonly general: "general";
    readonly appearance: "appearance";
    readonly models: "modelProvider";
    readonly browser: "browser";
    readonly computer_use: "computerUse";
    readonly memory: "memory";
    readonly subagents: "subagents";
    readonly plugins: "plugin";
    readonly mcp: "mcp";
    readonly skills: "skill";
    readonly commands: "commands";
    readonly hooks: "hooks";
    readonly usage: "usage";
};
type Request = {
    id: number;
    target: MarketingNavigationTarget;
    finish: (error?: Error) => void;
};
export declare const marketingNavigation: import("zustand/vanilla").StoreApi<{
    request: Request | null;
}>;
/** 只关联当前窗口的一次导航，迟到页面不能确认下一次请求。 */
export declare function finishMarketingNavigation(id: number, error?: Error): void;
export declare function requestMarketingNavigation(target: MarketingNavigationTarget, signal: AbortSignal, dispatch: () => void): Promise<void>;
export declare function waitForMarketingCapability<T>(operation: Promise<T>, signal: AbortSignal, timeoutMs: number): Promise<T>;
export {};
//# sourceMappingURL=marketingNavigation.d.ts.map