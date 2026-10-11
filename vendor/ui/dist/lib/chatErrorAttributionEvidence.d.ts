/**
 * transcript 和 custom provider 的安全 code/message 证据集中在这里判定：
 * 低基数 allowlist，每条规则原子返回同一份证据决定的 source/reason。
 */
export interface TelemetryEvidenceAttribution {
    errorSource: "provider" | "runtime" | "network";
    failureReason: string;
}
export declare function isLocalModelValidationMessage(message: string): boolean;
export declare function resolveStableTransportCodeAttribution(code: string): TelemetryEvidenceAttribution | undefined;
export declare function resolveGenericProviderCodeAttribution(code: string | undefined): TelemetryEvidenceAttribution | undefined;
export declare function resolveKnownProviderCodeFailureReason(code: string | undefined): string | undefined;
export declare function resolveTrustedProviderCodeFailureReason(params: {
    providerId: string | undefined;
    providerErrorCode: string | undefined;
    errorCode: string | undefined;
}): string | undefined;
export declare function isGenericProviderInvalidRequestCode(code: string): boolean;
export declare function resolveLegacyProviderEnvelopeCode(errorCode: string | undefined, message: string): string | undefined;
export declare function isQuotaMessage(message: string): boolean;
export declare function resolveControlledUnknownMessageAttribution(message: string): TelemetryEvidenceAttribution | undefined;
//# sourceMappingURL=chatErrorAttributionEvidence.d.ts.map