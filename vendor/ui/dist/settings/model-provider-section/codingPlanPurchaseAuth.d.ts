import { type OAuthProviderId } from "@zcode/shared";
import { type CodingPlanProviderId } from "@/settings/model-provider-section/constants.js";
export type CodingPlanPurchaseAuthStatus = "unknown" | "loading" | "authenticated" | "unauthenticated" | "error";
export declare function isCodingPlanPurchaseAuthPending(status: CodingPlanPurchaseAuthStatus): boolean;
export declare function readCodingPlanPurchaseTokenState(credentialService: {
    load(key: string): Promise<string | null>;
}): Promise<{
    "account:zai-individual-coding-plan": boolean;
    "account:zai-start-plan": boolean;
    "account:bigmodel-individual-coding-plan": boolean;
    "account:bigmodel-start-plan": boolean;
}>;
export declare function normalizeCodingPlanProviderId(providerId: string | null | undefined): CodingPlanProviderId | null;
export declare function isCodingPlanProviderId(providerId: CodingPlanProviderId | null): providerId is CodingPlanProviderId;
export declare function resolveCodingPlanOAuthProviderId(providerId: CodingPlanProviderId): OAuthProviderId;
//# sourceMappingURL=codingPlanPurchaseAuth.d.ts.map