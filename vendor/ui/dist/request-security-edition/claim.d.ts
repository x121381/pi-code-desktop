import type { ICodingPlanSubscriptionService } from "@zcode/services";
import type { RequestVerificationProof } from "@zcode/shared";
export declare function useRequestVerificationPrewarm(_visible: boolean): void;
export declare function prepareRequestVerificationClaim(_service: ICodingPlanSubscriptionService, signal: AbortSignal, _onVerifying: () => void): Promise<RequestVerificationProof | undefined>;
//# sourceMappingURL=claim.d.ts.map