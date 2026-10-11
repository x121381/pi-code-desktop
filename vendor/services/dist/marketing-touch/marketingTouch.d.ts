import { type MarketingTouchSnapshot } from "@zcode/shared";
export interface IMarketingTouchService {
    query(input: {
        locale: "zh-CN" | "en-US";
    }): Promise<MarketingTouchSnapshot & {
        scope: string;
    }>;
    report(input: {
        locale: "zh-CN" | "en-US";
        scope: string;
        campaignId: string;
        actionType: "confirm" | "cancel";
    }): Promise<void>;
}
export declare const IMarketingTouchService: import("#src/descriptors.js").ServiceDescriptor<IMarketingTouchService>;
//# sourceMappingURL=marketingTouch.d.ts.map