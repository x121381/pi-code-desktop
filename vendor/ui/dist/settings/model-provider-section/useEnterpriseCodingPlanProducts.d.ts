import { type CodingPlanStaticTeamProduct, type EnterpriseCodingPlanPricingResponse, type ProviderFamilyDomain } from "@zcode/shared";
import { type EnterpriseCodingPlanProductDisplay } from "@/settings/model-provider-section/enterpriseCodingPlanProducts.js";
export interface EnterpriseCodingPlanProductsSnapshot {
    productList: EnterpriseCodingPlanProductDisplay[];
    raw: EnterpriseCodingPlanPricingResponse;
    authenticated: boolean;
    /** 静态目录控制购买横幅，不能用实时 pricing 补造目录中缺失的商品。 */
    staticProductIds?: string[];
}
export declare function shouldRetainEnterprisePricingSnapshotForRefresh(snapshot: EnterpriseCodingPlanProductsSnapshot | null, authenticated: boolean): boolean;
export declare function resolveEnterprisePricingFailureSnapshot({ currentSnapshot, authenticated, staticProducts, family, }: {
    currentSnapshot: EnterpriseCodingPlanProductsSnapshot | null;
    authenticated: boolean;
    staticProducts: CodingPlanStaticTeamProduct[] | undefined;
    family?: ProviderFamilyDomain;
}): EnterpriseCodingPlanProductsSnapshot | null;
/**
 * 原 hook 只服务 bigmodel family，getStaticTeamProducts 硬编码
 * 读 bigmodelCodingPlan bucket、getEnterprisePricing 不传 family。
 * zai family 对称化后，hook 接受 family 参数：
 *   - 按 family 读 static bucket（zaiCodingPlan / bigmodelCodingPlan）
 *   - 传 family 给 service.getEnterprisePricing，service 据此路由到对应 provider
 * 缺省 family 时保持 bigmodel，向后兼容既有调用点。
 */
export declare function useEnterpriseCodingPlanProducts({ enabled, authenticated, family, staticOnly, }: {
    enabled: boolean;
    /** 未登录购买横幅只读取公开静态目录，不请求实时 pricing。 */
    staticOnly?: boolean;
    authenticated: boolean;
    family?: ProviderFamilyDomain;
}): {
    refresh: (_options?: {
        force?: boolean;
    }) => Promise<void>;
    snapshot: EnterpriseCodingPlanProductsSnapshot | null;
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useEnterpriseCodingPlanProducts.d.ts.map