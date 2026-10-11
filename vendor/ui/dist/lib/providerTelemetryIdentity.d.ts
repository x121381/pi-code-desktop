export declare function legacyTelemetryProviderId(providerId: string): string;
/** 只替换已知 Provider 前缀；纯模型 ID、未知身份及模型内部编码保持原样。 */
export declare function legacyTelemetryModelValue(value: string): string;
/** 对话事件完成归因后再投影，不改 request/child/seed 的原始事实。 */
export declare function legacyTelemetryModelFields(detail: Record<string, string>): Record<string, string>;
//# sourceMappingURL=providerTelemetryIdentity.d.ts.map