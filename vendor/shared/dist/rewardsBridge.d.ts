import { type RewardsContext } from "./rewardsEmbedded.js";
/** 此函数经 preload 序列化到网页主世界，不能引用模块外的运行时变量。 */
export declare function installRewardsPageBridge(): void;
export declare function createRewardsInjectionScript(context: RewardsContext, credentials: {
    oauth?: string | null;
    jwt?: string | null;
}, expectedUrl?: string): string;
//# sourceMappingURL=rewardsBridge.d.ts.map