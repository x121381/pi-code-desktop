import type { CodingPlanSubscriptionProviderId } from "@zcode/shared";
import { BigModelCodingPlanSubscriptionProvider } from "./bigmodelCodingPlanSubscriptionProvider.js";
/**
 * ZaiCodingPlanSubscriptionProvider
 *
 * 历史上 Team Plan 企业定价只在 bigmodel family 上落地，service 层把所有
 * enterprise 读请求直接打到 BigModelCodingPlanSubscriptionProvider，硬编码 bigmodel
 * 域名 + bigmodelCodingPlan providerId + bigmodel OAuth token。zai family 即使生成
 * 了 team plan 连接键，也无独立的定价数据来源（死代码）。
 *
 * zai 与 bigmodel Team Plan 全链路对称化：
 * 本类继承 BigModelCodingPlanSubscriptionProvider，仅覆盖 enterprise 读路径的 family 维度：
 *   - providerId  → zaiCodingPlan
 *   - 业务域名   → resolveZaiCodingPlanHost()（测试 配置的 ZAI Business origin / 线上 api.z.ai）
 *   - OAuth token → loadZaiAuthorization()（oauth:zai:access_token，复用父类）
 *   - 鉴权头     → createZaiLoginAuthHeaders()
 *
 * 覆盖范围：仅 getEnterprisePricing + enrichEnterprisePricingTeamProjects 相关的
 * family 维度（通过 protected 虚方法）。企业购买闭环（balance/order/pending/cancel/
 * continue/status）仍由父类走 bigmodel 域，符合 zai Team Plan "仅读定价+团队上下文" 的产品边界。
 *
 * 其余方法（batchPreview/preview/productInfo/checkPayment/checkPendingOrders/
 * Stripe/PayPal/createSign/updateSign/staticConfigs）全部复用父类：
 *   - 购买类已通过 request.providerId 在父类 resolveEndpointConfig 内动态路由
 *     （zai 走 /api/pay + zai host + zai token，bigmodel 走 /api/biz + bigmodel host + bigmodel token）。
 *   - staticConfigs 是平台级 client/configs，与 family 无关。
 */
export declare class ZaiCodingPlanSubscriptionProvider extends BigModelCodingPlanSubscriptionProvider {
    protected codingPlanProviderId(): CodingPlanSubscriptionProviderId;
    protected resolveFamilyEnterpriseHost(): string;
    protected loadFamilyEnterpriseToken(): Promise<string>;
    protected createFamilyEnterpriseAuthHeaders(token: string): Record<string, string>;
}
//# sourceMappingURL=zaiCodingPlanSubscriptionProvider.d.ts.map