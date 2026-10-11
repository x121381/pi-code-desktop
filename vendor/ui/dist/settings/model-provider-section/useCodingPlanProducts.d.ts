import { type CodingPlanBatchPreviewResponse, type CodingPlanStaticProduct } from "@zcode/shared";
import { useOptionalServices } from "@/hooks/useServices.js";
import { type CodingPlanProductDisplay } from "@/settings/model-provider-section/codingPlanProductPresentation.js";
import type { CodingPlanProviderId } from "@/settings/model-provider-section/constants.js";
type CodingPlanProductsSnapshot = Omit<CodingPlanBatchPreviewResponse, "productList"> & {
    productList: CodingPlanProductDisplay[];
};
export declare const ZAI_START_FREE_PRODUCT_ID = "zai-start-free";
export declare function useCodingPlanProducts(providerId: CodingPlanProviderId, options?: {
    remotePreviewEnabled?: boolean;
}): {
    refresh: (options?: {
        force?: boolean;
    }) => Promise<void>;
    snapshot: CodingPlanProductsSnapshot | null;
    loading: boolean;
    error: string | null;
};
export declare function loadCodingPlanProductsForTest(providerId: CodingPlanProviderId, service: NonNullable<ReturnType<typeof useOptionalServices>>["codingPlanSubscriptionService"], force: boolean, staticProducts?: CodingPlanStaticProduct[]): Promise<CodingPlanProductsSnapshot>;
export declare function loadCodingPlanStaticProductsSnapshotForTest(providerId: CodingPlanProviderId, service: NonNullable<ReturnType<typeof useOptionalServices>>["codingPlanSubscriptionService"]): Promise<CodingPlanProductsSnapshot>;
export declare function resolveCodingPlanProductsFailureSnapshot(currentSnapshot: CodingPlanProductsSnapshot | null, fallbackSnapshot: CodingPlanProductsSnapshot): CodingPlanProductsSnapshot;
export declare function clearCodingPlanProductsCacheForTest(): void;
export declare function isZaiStartFreeProductId(productId: string | null | undefined): boolean;
export declare function loadCodingPlanStaticProductListForTest(providerId: CodingPlanProviderId, service: NonNullable<ReturnType<typeof useOptionalServices>>["codingPlanSubscriptionService"]): Promise<CodingPlanStaticProduct[]>;
export declare function normalizeErrorMessage(error: unknown): string;
export declare function isCodingPlanOAuthRequiredError(error: string): boolean;
export declare function isCodingPlanSystemBusyError(error: string): boolean;
export {};
//# sourceMappingURL=useCodingPlanProducts.d.ts.map