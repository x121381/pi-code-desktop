import { type CloudContentBundle, type MarketingAsset } from "@zcode/shared";
export interface ICloudContentService {
    readPublishedMedia(input: {
        asset: MarketingAsset;
        kind: "image" | "video";
    }): Promise<string>;
    prepare(input: {
        bundle: CloudContentBundle;
    }): Promise<{
        leaseId: string;
        url: string;
        cacheHit: boolean;
    }>;
    release(input: {
        leaseId: string;
    }): Promise<void>;
}
export declare const ICloudContentService: import("#src/descriptors.js").ServiceDescriptor<ICloudContentService>;
//# sourceMappingURL=cloudContent.d.ts.map