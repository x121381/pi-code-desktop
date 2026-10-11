export type RequestVerificationConfig = Readonly<Record<string, unknown>>;
export type RequestVerificationProof = Record<never, never>;
export type RequestVerificationClientConfig = Record<never, never>;
export declare const requestVerificationReasons: readonly ["model-request"];
export type RequestVerificationReason = (typeof requestVerificationReasons)[number];
export declare const requestVerificationTimeoutMessage = "Provider runtime headers request timed out. Please send your message again.";
export declare const REQUEST_VERIFICATION_REQUIRED = "request_verification_unavailable";
export declare function readRequestVerificationConfig(_configs: RequestVerificationClientConfig | null | undefined): RequestVerificationConfig | null;
export declare function requestVerificationClaimHeaders(_proof: RequestVerificationProof): Record<string, string>;
export declare function withoutRequestVerificationHeaders(headers: Record<string, string> | undefined): Record<string, string>;
export declare function allowRequestVerificationHeaders(_headers: Record<string, string>): Record<string, string>;
export declare function requiresRequestVerification(_access: {
    mode: string;
} | undefined): boolean;
export declare function isRequestVerificationMessage(_message: string): boolean;
export declare function summarizeRequestVerificationHeaders(_headers: Record<string, string>): Record<string, unknown>;
export declare function requestVerificationDiagnostics(_input: Record<string, unknown>): Record<string, unknown>;
export declare const requestVerificationInteractionAvailable = false;
//# sourceMappingURL=verification-policy.d.ts.map