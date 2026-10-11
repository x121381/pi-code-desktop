import { type IPlatformService, type UsageEntitlementSnapshot } from "@zcode/shared";
import type { ProviderSettingsView } from "@zcode/services";
export type CodingPlanUpgradeSource = "profile_menu" | "session_quota_alert" | "session_token_usage" | "session_idle_time" | "setting_plan_card" | "setting_start_plan_card" | "setting_personal_plan_banner" | "setting_team_plan_banner";
export type CodingPlanEntryPlanStatus = "no_plan" | "start_plan" | "coding_plan" | "unknown";
export type CodingPlanPurchaseAudience = "" | "personal" | "team";
export type CodingPlanProviderFamily = "bigmodel" | "zai" | "unknown";
export interface CodingPlanFunnelContext {
    purchaseFunnelId: string;
    upgradeSource: CodingPlanUpgradeSource;
    eventRegion: string;
    eventText: string;
    entryPlanStatus: CodingPlanEntryPlanStatus;
    entryPlanLevel: string;
    entryPlanList: string;
    purchaseAudience: CodingPlanPurchaseAudience;
    providerFamily: CodingPlanProviderFamily;
    channel: string;
}
export interface CodingPlanEntryPlanState {
    entryPlanStatus: CodingPlanEntryPlanStatus;
    entryPlanLevel: string;
}
type TelemetryPlatform = Pick<IPlatformService, "reportTelemetryEvent">;
export declare function createPurchaseFunnelId(): string;
export declare function createCodingPlanFunnelContext(params: {
    providerId: string;
    upgradeSource: CodingPlanUpgradeSource;
    eventRegion: string;
    eventText: string;
    entryPlanState?: CodingPlanEntryPlanState;
    purchaseAudience?: CodingPlanPurchaseAudience;
}): CodingPlanFunnelContext;
export declare function createIdleTimeCodingPlanFunnelContext(params: {
    providerId: string;
    eventText: string;
    entryPlanState: CodingPlanEntryPlanState;
}): CodingPlanFunnelContext;
export declare function resolveCodingPlanEntryPlanState(params: {
    displayStatus?: string | null;
    providerId?: string | null;
    planLevel?: string | null;
    snapshot?: UsageEntitlementSnapshot | null;
}): CodingPlanEntryPlanState;
export declare function resolveCodingPlanEntryPlanStateFromProviderSettings(view: ProviderSettingsView | null): CodingPlanEntryPlanState;
export declare function reportCodingPlanUpgradeClick(platform: TelemetryPlatform | null | undefined, context: CodingPlanFunnelContext | null | undefined): void;
export declare function buildFunnelBaseDetail(context: CodingPlanFunnelContext): Record<string, string>;
export declare function resolveCodingPlanProviderFamily(providerId: string): CodingPlanProviderFamily;
export declare function resolveCodingPlanChannel(providerFamily: CodingPlanProviderFamily): string;
export declare function stringifyDetail(detail: Record<string, unknown>): Record<string, string>;
export {};
//# sourceMappingURL=codingPlanFunnelTelemetry.d.ts.map