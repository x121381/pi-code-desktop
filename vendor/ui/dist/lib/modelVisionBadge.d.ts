import type { ProviderConfigObject } from "@zcode/provider";
/** 产品展示例外：套餐 GLM-5.3 的图片输入是服务端桥接，不能把桥接标为原生视觉。 */
export declare function shouldShowModelVisionBadge(modelId: string, supportsImage: boolean | null | undefined, access?: ProviderConfigObject["access"]): boolean;
//# sourceMappingURL=modelVisionBadge.d.ts.map