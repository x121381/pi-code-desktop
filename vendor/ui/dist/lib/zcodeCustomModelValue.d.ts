interface DecodedCustomModelValue {
    providerId: string;
    modelName?: string;
}
export declare function encodeCustomModelValue(providerId: string, modelName?: string): string;
export declare function decodeCustomModelValue(value: string): DecodedCustomModelValue | null;
export {};
//# sourceMappingURL=zcodeCustomModelValue.d.ts.map