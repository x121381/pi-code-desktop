import { type MarketingAsset, type MarketingTouchSnapshot } from "@zcode/shared";
/** 下载授权只来自宿主已验证的投放响应；Renderer 不能自行授权地址。 */
export declare function createMarketingAssetRegistry(options?: {
    fetch?: typeof fetch;
    allowLoopback?: boolean;
}): {
    allow: (asset: MarketingAsset) => void;
    allows: (asset: MarketingAsset) => boolean;
    allowsUrl: (url: URL) => boolean;
    accept(snapshot: MarketingTouchSnapshot): void;
    readMedia(input: MarketingAsset, kind: "image" | "video"): Promise<string>;
};
//# sourceMappingURL=marketingAssetRegistry.d.ts.map