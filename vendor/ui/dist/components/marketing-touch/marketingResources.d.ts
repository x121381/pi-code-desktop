import type { ICloudContentService } from "@zcode/services";
import type { MarketingAsset, MarketingVisual } from "@zcode/shared";
import type { CloudDialogHero } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
export declare function prepareMarketingImage(asset: MarketingAsset, service: ICloudContentService): Promise<string>;
export interface PreparedMarketingHero {
    hero: CloudDialogHero | null;
    release: () => Promise<void>;
}
export declare function prepareMarketingHero(visual: MarketingVisual | null | undefined, service: ICloudContentService | undefined, locale: "zh-CN" | "en-US", desktop: boolean): Promise<PreparedMarketingHero>;
//# sourceMappingURL=marketingResources.d.ts.map