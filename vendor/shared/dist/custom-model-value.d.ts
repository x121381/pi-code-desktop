export declare const CUSTOM_MODEL_VALUE_PREFIX = "custom:";
export interface DecodedCustomModelValue {
    providerId: string;
    modelName?: string;
}
export declare function encodeCustomModelValue(providerId: string, modelName?: string): string;
export declare function decodeCustomModelValue(value: string): DecodedCustomModelValue | null;
//# sourceMappingURL=custom-model-value.d.ts.map