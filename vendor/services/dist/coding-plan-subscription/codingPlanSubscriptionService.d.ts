import { type ApiClient } from "@zcode/shared";
import type { ICredentialService } from "../credential/credential.js";
import type { ICodingPlanSubscriptionService } from "./codingPlanSubscription.js";
import type { ModelSelectionView } from "@zcode/provider";
interface CodingPlanSubscriptionServiceDependencies {
    apiClient: ApiClient;
    credentialService: Pick<ICredentialService, "load">;
    resolveOffPeakModelSelectionView?: () => Promise<ModelSelectionView>;
    /**
     * 用户在设置里选的动态工作流模式（launch.md「The user's choice」）。只有拥有设置权威的装配
     * （desktop 本地 Host、web/standalone server）注入；缺省时快照只含服务端的「提供」。
     */
    resolveDynamicWorkflowUserMode?: () => Promise<unknown>;
}
/**
 * 原 service 把所有调用直接绑定到单一 BigModelCodingPlanSubscriptionProvider，
 * zai family 没有独立的 Team Plan 定价来源（死代码）。
 *
 * zai 与 bigmodel Team Plan 全链路对称化：
 * 同时持有 bigmodel 和 zai 两个 provider 实例；enterprise 读路径（getEnterprisePricing）按
 * request.family 路由到对应实例；缺省 family 时保持 bigmodel，向后兼容既有调用点。
 *
 * 其余方法（购买/staticConfigs/preview 等）语义与 family 无关或已在 provider 内部按
 * request.providerId 动态路由，统一委托给 bigmodel provider 即可：
 *   - 企业购买闭环（balance/order/pending/cancel/continue/status）按产品决策仍只走 bigmodel 域。
 *   - staticConfigs 是平台级 client/configs，与 family 无关。
 *   - 购买类（Stripe/PayPal/preview/createSign 等）已通过 request.providerId 在 provider 内路由。
 */
export declare function createCodingPlanSubscriptionService(dependencies: CodingPlanSubscriptionServiceDependencies): ICodingPlanSubscriptionService;
export {};
//# sourceMappingURL=codingPlanSubscriptionService.d.ts.map