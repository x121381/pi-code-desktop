export declare const REQUEST_VERIFICATION_REJECTED_MESSAGE = "";
export declare function resolveRequestVerificationBusinessCode(_code: string | undefined, _message: string | undefined): "3007" | undefined;
export declare function isRequestVerificationTerminalError(_error: {
    code?: string;
    message?: string;
} | null | undefined): boolean;
export declare function isRequestVerificationRejectedMessage(_message: string | undefined): boolean;
export declare const requestVerificationRecoveryAction: null;
export type RequestVerificationRecoveryAction = never;
export declare const requestVerificationActionMessages: {};
export declare const requestVerificationErrorAttribution: {};
export declare const requestVerificationClaimFailureMessageId = "manualClaimPlan.claim.failure.generic";
export declare const additionalRequestModalSelectors: readonly string[];
//# sourceMappingURL=errors.d.ts.map