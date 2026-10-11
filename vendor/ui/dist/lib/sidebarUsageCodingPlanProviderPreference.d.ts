import { BUILTIN_MODEL_PROVIDER_IDS } from "@zcode/shared";
export type SidebarUsageCodingPlanProviderId = typeof BUILTIN_MODEL_PROVIDER_IDS.zaiIndividualCodingPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.zaiTeamCodingPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.bigmodelIndividualCodingPlan | typeof BUILTIN_MODEL_PROVIDER_IDS.bigmodelTeamCodingPlan;
export type SidebarUsageCodingPlanSourceId = SidebarUsageCodingPlanProviderId | `team:${string}`;
export declare function readSidebarUsageCodingPlanProviderPreference(): SidebarUsageCodingPlanProviderId | undefined;
export declare function readSidebarUsageCodingPlanSourcePreference(): SidebarUsageCodingPlanSourceId | undefined;
export declare function writeSidebarUsageCodingPlanProviderPreference(providerId: SidebarUsageCodingPlanSourceId): void;
//# sourceMappingURL=sidebarUsageCodingPlanProviderPreference.d.ts.map