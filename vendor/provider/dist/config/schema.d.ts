import { ModelConfig, ModelConfigRules } from "./model-config.js";
import { ProviderConfig, ProviderConfigMap, ProviderTemplateMap } from "./provider-config.js";
export declare function parseProviderConfigMap(input: unknown): ProviderConfigMap;
export declare function parseZCodeBuiltinProviderConfigMap(input: unknown): ProviderConfigMap;
export declare function parseProviderTemplateMap(input: unknown): ProviderTemplateMap;
export declare function parseZCodeBuiltinProviderConfigRules(input: unknown): {
    providers: ProviderConfigMap;
    providerTemplates: ProviderTemplateMap;
};
export declare function parsePersonalProviderConfigMap(input: unknown): ProviderConfigMap;
/** Account 运行时事实仍只有成员及权益；不是磁盘配置规则的第二种格式。 */
export declare function parseAccountProviderConfigMap(input: unknown): ProviderConfigMap;
export declare function parseProviderConfig(input: unknown): ProviderConfig;
export declare function parseModelConfig(input: unknown): ModelConfig;
export declare function parseZCodeBuiltinModelConfigRules(input: unknown): ModelConfigRules;
export declare function parsePersonalModelConfigRules(input: unknown): ModelConfigRules;
//# sourceMappingURL=schema.d.ts.map