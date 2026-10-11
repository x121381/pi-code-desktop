import { ConfigOverlay, type ConfigValidationIssue } from "../config-overlay.js";
import type { z } from "zod";
import { completeEnumOptionSpecDataSchema, completeLimitOptionSpecDataSchema, type enumOptionSpecDataSchema, type limitOptionSpecDataSchema, type modelInputFormatDataSchema, type modelOutputFormatDataSchema, type modelPropertiesDataSchema, type modelOptionSpecsDataSchema, type modelConfigDataSchema } from "@zcode/shared/model-config";
import { type ProviderModelConfigRuleData, type ManualProviderModelConfigRuleData, type TemplateModelConfigRuleData, type ModelMatchConfigRuleData, type ModelApiMatchConfigRuleData, type ProviderSiteMatchConfigRuleData, type BuiltinModelConfigRulesData, type PersonalModelConfigRulesData } from "./rule-data-schema.js";
export type EnumOptionSpec = Readonly<z.infer<typeof completeEnumOptionSpecDataSchema>>;
export type LimitOptionSpec = Readonly<z.infer<typeof completeLimitOptionSpecDataSchema>>;
export type EnumOptionSpecConfigInput = Readonly<z.infer<typeof enumOptionSpecDataSchema>>;
export declare class EnumOptionSpecConfig extends ConfigOverlay<EnumOptionSpecConfig> {
    readonly values?: EnumOptionSpecConfigInput["values"];
    readonly map?: EnumOptionSpecConfigInput["map"];
    constructor(input?: EnumOptionSpecConfigInput);
    overlay(next: EnumOptionSpecConfig): EnumOptionSpecConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): EnumOptionSpecConfigInput;
}
export type LimitOptionSpecConfigInput = Readonly<z.infer<typeof limitOptionSpecDataSchema>>;
export declare class LimitOptionSpecConfig extends ConfigOverlay<LimitOptionSpecConfig> {
    readonly max?: LimitOptionSpecConfigInput["max"];
    readonly map?: LimitOptionSpecConfigInput["map"];
    constructor(input?: LimitOptionSpecConfigInput);
    overlay(next: LimitOptionSpecConfig): LimitOptionSpecConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): LimitOptionSpecConfigInput;
}
export type ModelPropertiesConfigInput = Readonly<z.infer<typeof modelPropertiesDataSchema>>;
export type ModelInputFormatConfigInput = Readonly<z.infer<typeof modelInputFormatDataSchema>>;
export declare class ModelInputFormatConfig extends ConfigOverlay<ModelInputFormatConfig> {
    readonly supportsText?: ModelInputFormatConfigInput["supportsText"];
    readonly supportsImage?: ModelInputFormatConfigInput["supportsImage"];
    readonly supportsVideo?: ModelInputFormatConfigInput["supportsVideo"];
    readonly supportsAudio?: ModelInputFormatConfigInput["supportsAudio"];
    readonly supportsPdf?: ModelInputFormatConfigInput["supportsPdf"];
    constructor(input?: ModelInputFormatConfigInput);
    overlay(next: ModelInputFormatConfig): ModelInputFormatConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ModelInputFormatConfigInput;
}
export type ModelOutputFormatConfigInput = Readonly<z.infer<typeof modelOutputFormatDataSchema>>;
export declare class ModelOutputFormatConfig extends ConfigOverlay<ModelOutputFormatConfig> {
    readonly supportsText?: ModelOutputFormatConfigInput["supportsText"];
    constructor(input?: ModelOutputFormatConfigInput);
    overlay(next: ModelOutputFormatConfig): ModelOutputFormatConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ModelOutputFormatConfigInput;
}
export declare class ModelPropertiesConfig extends ConfigOverlay<ModelPropertiesConfig> {
    readonly requiresMfjsToolSchema?: ModelPropertiesConfigInput["requiresMfjsToolSchema"];
    readonly contextWindow?: ModelPropertiesConfigInput["contextWindow"];
    readonly inputFormat?: ModelInputFormatConfig | null;
    readonly outputFormat?: ModelOutputFormatConfig | null;
    readonly supportsToolCall?: ModelPropertiesConfigInput["supportsToolCall"];
    readonly supportsJsonSchemaOutput?: ModelPropertiesConfigInput["supportsJsonSchemaOutput"];
    readonly supportsNativeWebSearch?: ModelPropertiesConfigInput["supportsNativeWebSearch"];
    readonly supportsMidConversationSystem?: ModelPropertiesConfigInput["supportsMidConversationSystem"];
    constructor(input?: ModelPropertiesConfigInput);
    overlay(next: ModelPropertiesConfig): ModelPropertiesConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ModelPropertiesConfigInput;
}
export type ModelOptionSpecsConfigInput = Readonly<z.infer<typeof modelOptionSpecsDataSchema>>;
export declare class ModelOptionSpecsConfig extends ConfigOverlay<ModelOptionSpecsConfig> {
    readonly reasoningLevel?: EnumOptionSpecConfig | null;
    readonly maxOutputTokens?: LimitOptionSpecConfig | null;
    constructor(input?: ModelOptionSpecsConfigInput);
    overlay(next: ModelOptionSpecsConfig): ModelOptionSpecsConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ModelOptionSpecsConfigInput;
}
export type ModelConfigInput = Omit<ModelConfigObject, "properties" | "optionSpecs"> & {
    readonly properties?: ModelPropertiesConfig | null;
    readonly optionSpecs?: ModelOptionSpecsConfig | null;
};
export type ModelConfigObject = Readonly<z.infer<typeof modelConfigDataSchema>>;
export declare class ModelConfig extends ConfigOverlay<ModelConfig> {
    readonly enabled?: ModelConfigObject["enabled"];
    readonly properties?: ModelPropertiesConfig | null;
    readonly optionSpecs?: ModelOptionSpecsConfig | null;
    constructor(input?: ModelConfigInput);
    static empty(): ModelConfig;
    static fromData(config: ModelConfigObject): ModelConfig;
    overlay(next: ModelConfig): ModelConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ModelConfigObject;
}
type RuleWithConfig<T> = Readonly<Omit<T, "config"> & {
    config: ModelConfig;
}>;
export type ProviderModelConfigRule = RuleWithConfig<ProviderModelConfigRuleData>;
export type ManualProviderModelConfigRule = RuleWithConfig<ManualProviderModelConfigRuleData>;
export type TemplateModelConfigRule = RuleWithConfig<TemplateModelConfigRuleData>;
export type ModelMatchConfigRule = RuleWithConfig<ModelMatchConfigRuleData>;
export type ModelApiMatchConfigRule = RuleWithConfig<ModelApiMatchConfigRuleData>;
export type ProviderSiteMatchConfigRule = RuleWithConfig<ProviderSiteMatchConfigRuleData>;
/** type 只标识内存执行规则的来源层，不写入配置文件；分组不能再按字段有无猜测。 */
export type ModelConfigRule = (ProviderModelConfigRule & {
    readonly type: "provider-model";
}) | (ManualProviderModelConfigRule & {
    readonly type: "manual-provider-model";
}) | (TemplateModelConfigRule & {
    readonly type: "template-model";
}) | (ModelMatchConfigRule & {
    readonly type: "model";
}) | (ModelApiMatchConfigRule & {
    readonly type: "model-api";
}) | (ProviderSiteMatchConfigRule & {
    readonly type: "provider-site";
});
type ExactModelConfigRule = Extract<ModelConfigRule, {
    type: "provider-model" | "manual-provider-model";
}>;
export interface ModelConfigRuleResolutionInput {
    readonly providerId: string;
    readonly templateId?: string | null;
    readonly modelId: string;
    readonly apiType?: string | null;
    readonly baseUrl?: string | null;
}
export declare class ModelConfigRules {
    #private;
    constructor(rules?: readonly ModelConfigRule[]);
    static empty(): ModelConfigRules;
    /** Built-in 保留原层次和组内顺序；个人只包含普通/手动精确规则。 */
    static composeEffective(builtin: ModelConfigRules, personal: ModelConfigRules): ModelConfigRules;
    rules(): readonly ModelConfigRule[];
    resolve(input: ModelConfigRuleResolutionInput): ModelConfig;
    setExact(providerId: string, modelId: string, config: ModelConfig, useRecommendedConfig?: boolean): ModelConfigRules;
    deleteExact(providerId: string, modelId: string): ModelConfigRules;
    renameExactModel(providerId: string, currentModelId: string, nextModelId: string): ModelConfigRules;
    deleteExactForProvider(providerId: string): ModelConfigRules;
    getExact(providerId: string, modelId: string): ModelConfig | undefined;
    getExactRule(providerId: string, modelId: string): ExactModelConfigRule | undefined;
    toZCodeBuiltinJSON(): BuiltinModelConfigRulesData;
    toPersonalJSON(): PersonalModelConfigRulesData;
    toJSON(): {
        manualProviderModelRules: ((Omit<never, "type" | "config"> & {
            config: Readonly<{
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            }>;
        }) | (Omit<Readonly<Omit<{
            modelId: string;
            providerId: string;
            config: {
                properties: {
                    contextWindow: number;
                    supportsJsonSchemaOutput: boolean;
                    supportsNativeWebSearch: boolean;
                    supportsMidConversationSystem: boolean;
                    inputFormat: {
                        supportsImage: boolean;
                        supportsVideo: boolean;
                        supportsPdf: boolean;
                    };
                };
                optionSpecs: {
                    reasoningLevel: {
                        values: readonly string[];
                        map: string;
                    };
                    maxOutputTokens: {
                        max: number;
                    };
                };
                enabled?: boolean | null | undefined;
            };
        }, "config"> & {
            config: ModelConfig;
        }> & {
            readonly type: "manual-provider-model";
        }, "type" | "config"> & {
            config: Readonly<{
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            }>;
        }))[];
        modelRules: {
            modelMatch: string;
            config: {
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            };
        }[];
        modelApiRules: {
            modelMatch: string;
            config: {
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            };
            apiTypeMatch: string;
        }[];
        providerSiteRules: {
            modelMatch: string;
            config: {
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            };
            baseUrlMatch: string;
            apiTypeMatch?: string | undefined;
        }[];
        templateModelRules: {
            templateId: string;
            modelId: string;
            config: {
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            };
        }[];
        builtinProviderModelRules: {
            config: {
                properties?: {
                    inputFormat?: {
                        supportsText?: boolean | null | undefined;
                        supportsImage?: boolean | null | undefined;
                        supportsVideo?: boolean | null | undefined;
                        supportsAudio?: boolean | null | undefined;
                        supportsPdf?: boolean | null | undefined;
                    } | null | undefined;
                    outputFormat?: {
                        supportsText?: boolean | null | undefined;
                    } | null | undefined;
                    requiresMfjsToolSchema?: boolean | null | undefined;
                    contextWindow?: number | null | undefined;
                    supportsToolCall?: boolean | null | undefined;
                    supportsJsonSchemaOutput?: boolean | null | undefined;
                    supportsNativeWebSearch?: boolean | null | undefined;
                    supportsMidConversationSystem?: boolean | null | undefined;
                } | null | undefined;
                optionSpecs?: {
                    reasoningLevel?: {
                        values?: readonly string[] | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                    maxOutputTokens?: {
                        max?: number | null | undefined;
                        map?: string | null | undefined;
                    } | null | undefined;
                } | null | undefined;
                enabled?: boolean | null | undefined;
            };
            modelId: string;
            providerId: string;
        }[];
    };
}
export {};
//# sourceMappingURL=model-config.d.ts.map