import { type ApiClient, type ProviderFamilyDomain, type ProviderFamilyConnectionSelectionSettings } from "@zcode/shared";
export type CodingPlanUnavailableReason = "coding_plan_not_authenticated" | "coding_plan_not_connected" | "coding_plan_auth_failed" | "coding_plan_not_entitled";
interface CodingPlanAvailabilityCredentialService {
    load(key: string): Promise<string | null>;
}
interface CodingPlanAvailabilityContext {
    apiClient?: ApiClient;
    credentialService?: CodingPlanAvailabilityCredentialService;
    providerFamilyConnectionSelections?: ProviderFamilyConnectionSelectionSettings;
}
export type CodingPlanAvailabilityResult = {
    kind: "available";
    models?: readonly string[];
} | {
    kind: "pending";
    effectiveAt: number;
    models: readonly string[];
} | {
    kind: "unavailable";
    reason: CodingPlanUnavailableReason;
} | {
    kind: "unknown";
};
export interface CodingPlanAvailabilityProvider {
    readonly providerId: string;
    readonly family: ProviderFamilyDomain;
    readonly planKind: "start-plan" | "individual-coding-plan" | "team-coding-plan";
    readonly apiKey?: string | null;
}
export declare function validateCodingPlanProviderAvailability(provider: CodingPlanAvailabilityProvider, context: CodingPlanAvailabilityContext): Promise<CodingPlanAvailabilityResult>;
export declare function validateZaiAccountProviderAvailability(providers: readonly CodingPlanAvailabilityProvider[], context: CodingPlanAvailabilityContext): Promise<Partial<Record<string, CodingPlanAvailabilityResult>>>;
export declare function validateBigModelAccountProviderAvailability(providers: readonly CodingPlanAvailabilityProvider[], context: CodingPlanAvailabilityContext): Promise<Partial<Record<string, CodingPlanAvailabilityResult>>>;
export {};
//# sourceMappingURL=codingPlanProviderAvailability.d.ts.map