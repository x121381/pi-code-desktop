import type { ICloudContentService } from "#src/cloud-content/cloudContent.js";
import type { createMarketingAssetRegistry } from "#src/marketing-touch/marketingAssetRegistry.js";
export declare function createCloudContentService(options: {
    cacheRoot: string;
    publishedAssets?: ReturnType<typeof createMarketingAssetRegistry>;
}): ICloudContentService & {
    disposeAllAndWait(): Promise<void>;
};
//# sourceMappingURL=cloudContentService.d.ts.map