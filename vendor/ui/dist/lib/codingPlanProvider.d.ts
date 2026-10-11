import { type UsageEntitlementSnapshot } from "@zcode/shared";
import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
export declare function pickCodingPlanEntitlementProvider(codingPlanProvider: ProviderSettingsFormProvider | null | undefined): ProviderSettingsFormProvider | null;
export declare function hasActiveUsageEntitlementSnapshot(snapshot: UsageEntitlementSnapshot | null, providerId?: string): boolean;
export type UsageEntitlementOutcome = "active" | "inactive" | "unknown";
/** 只把权威 no_plan 解释为失效；网络、鉴权和不完整快照都保持未知。 */
export declare function resolveUsageEntitlementOutcome(snapshot: UsageEntitlementSnapshot | null, providerId?: string): UsageEntitlementOutcome;
//# sourceMappingURL=codingPlanProvider.d.ts.map