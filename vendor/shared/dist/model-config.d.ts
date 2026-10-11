import { z } from "zod";
export declare const completeEnumOptionSpecDataSchema: z.ZodObject<{
    values: z.ZodReadonly<z.ZodArray<z.ZodString>>;
    map: z.ZodString;
}, z.core.$strict>;
export declare const completeLimitOptionSpecDataSchema: z.ZodObject<{
    max: z.ZodNumber;
    map: z.ZodString;
}, z.core.$strict>;
export declare const enumOptionSpecDataSchema: z.ZodObject<{
    values: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
    map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const limitOptionSpecDataSchema: z.ZodObject<{
    max: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strict>;
export declare const completeModelInputFormatDataSchema: z.ZodObject<{
    supportsText: z.ZodBoolean;
    supportsImage: z.ZodBoolean;
    supportsVideo: z.ZodBoolean;
    supportsAudio: z.ZodBoolean;
    supportsPdf: z.ZodBoolean;
}, z.core.$strict>;
export declare const completeModelOutputFormatDataSchema: z.ZodObject<{
    supportsText: z.ZodBoolean;
}, z.core.$strict>;
export declare const modelInputFormatDataSchema: z.ZodObject<{
    supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsImage: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsVideo: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsAudio: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsPdf: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>;
export declare const modelOutputFormatDataSchema: z.ZodObject<{
    supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>;
export declare const completeModelPropertiesDataSchema: z.ZodObject<{
    requiresMfjsToolSchema: z.ZodBoolean;
    contextWindow: z.ZodNumber;
    inputFormat: z.ZodObject<{
        supportsText: z.ZodBoolean;
        supportsImage: z.ZodBoolean;
        supportsVideo: z.ZodBoolean;
        supportsAudio: z.ZodBoolean;
        supportsPdf: z.ZodBoolean;
    }, z.core.$strict>;
    outputFormat: z.ZodObject<{
        supportsText: z.ZodBoolean;
    }, z.core.$strict>;
    supportsToolCall: z.ZodBoolean;
    supportsJsonSchemaOutput: z.ZodBoolean;
    supportsNativeWebSearch: z.ZodBoolean;
    supportsMidConversationSystem: z.ZodBoolean;
}, z.core.$strict>;
export declare const modelPropertiesDataSchema: z.ZodObject<{
    inputFormat: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsImage: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsVideo: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsAudio: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsPdf: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strict>>>;
    outputFormat: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strict>>>;
    requiresMfjsToolSchema: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    contextWindow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    supportsToolCall: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsJsonSchemaOutput: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsNativeWebSearch: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    supportsMidConversationSystem: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>;
export declare const completeModelOptionSpecsDataSchema: z.ZodObject<{
    reasoningLevel: z.ZodObject<{
        values: z.ZodReadonly<z.ZodArray<z.ZodString>>;
        map: z.ZodString;
    }, z.core.$strict>;
    maxOutputTokens: z.ZodObject<{
        max: z.ZodNumber;
        map: z.ZodString;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const modelOptionSpecsDataSchema: z.ZodObject<{
    reasoningLevel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        values: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
        map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
    maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        max: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, z.core.$strict>>>;
}, z.core.$strict>;
export declare const completeModelConfigDataSchema: z.ZodObject<{
    enabled: z.ZodBoolean;
    properties: z.ZodObject<{
        requiresMfjsToolSchema: z.ZodBoolean;
        contextWindow: z.ZodNumber;
        inputFormat: z.ZodObject<{
            supportsText: z.ZodBoolean;
            supportsImage: z.ZodBoolean;
            supportsVideo: z.ZodBoolean;
            supportsAudio: z.ZodBoolean;
            supportsPdf: z.ZodBoolean;
        }, z.core.$strict>;
        outputFormat: z.ZodObject<{
            supportsText: z.ZodBoolean;
        }, z.core.$strict>;
        supportsToolCall: z.ZodBoolean;
        supportsJsonSchemaOutput: z.ZodBoolean;
        supportsNativeWebSearch: z.ZodBoolean;
        supportsMidConversationSystem: z.ZodBoolean;
    }, z.core.$strict>;
    optionSpecs: z.ZodObject<{
        reasoningLevel: z.ZodObject<{
            values: z.ZodReadonly<z.ZodArray<z.ZodString>>;
            map: z.ZodString;
        }, z.core.$strict>;
        maxOutputTokens: z.ZodObject<{
            max: z.ZodNumber;
            map: z.ZodString;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>;
export declare const modelConfigDataSchema: z.ZodObject<{
    properties: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        inputFormat: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            supportsImage: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            supportsVideo: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            supportsAudio: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
            supportsPdf: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        }, z.core.$strict>>>;
        outputFormat: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            supportsText: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        }, z.core.$strict>>>;
        requiresMfjsToolSchema: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        contextWindow: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
        supportsToolCall: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsJsonSchemaOutput: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsNativeWebSearch: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
        supportsMidConversationSystem: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    }, z.core.$strict>>>;
    optionSpecs: z.ZodOptional<z.ZodNullable<z.ZodObject<{
        reasoningLevel: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            values: z.ZodOptional<z.ZodNullable<z.ZodReadonly<z.ZodArray<z.ZodString>>>>;
            map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
        maxOutputTokens: z.ZodOptional<z.ZodNullable<z.ZodObject<{
            max: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
            map: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>>;
    enabled: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
}, z.core.$strict>;
export type ModelInputFormatData = z.infer<typeof completeModelInputFormatDataSchema>;
export type ModelOutputFormatData = z.infer<typeof completeModelOutputFormatDataSchema>;
export type ModelPropertiesData = z.infer<typeof completeModelPropertiesDataSchema>;
export type EnumOptionSpecData = z.infer<typeof completeEnumOptionSpecDataSchema>;
export type LimitOptionSpecData = z.infer<typeof completeLimitOptionSpecDataSchema>;
export type ModelOptionSpecsData = z.infer<typeof completeModelOptionSpecsDataSchema>;
//# sourceMappingURL=model-config.d.ts.map