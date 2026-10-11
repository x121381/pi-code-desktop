import { z } from "zod";
import { modelConfigDataSchema } from "@zcode/shared/model-config";
import { providerConfigDataSchema, zhipuAccountAccessDataSchema } from "./provider-data-schema.js";
import { ModelConfig, ModelConfigRules } from "./model-config.js";
import { ApiKeyAccessConfig, ProviderApiConfig, ProviderConfig, ProviderConfigMap, ProviderTemplate, ProviderTemplateMap, ZhipuAccountAccessConfig, } from "./provider-config.js";
import { builtinModelConfigRulesSchema, personalModelConfigRulesSchema, builtinProviderConfigRulesSchema, personalProviderConfigRulesSchema, providerConfigRuleSchema, providerTemplateConfigRuleSchema, builtinProviderConfigRuleSchema, } from "./rule-data-schema.js";
const accountProviderConfigSchema = providerConfigDataSchema
    .pick({ builtinModelIds: true })
    .extend({
    access: zhipuAccountAccessDataSchema.pick({ type: true, entitled: true }).nullable().optional(),
});
export function parseProviderConfigMap(input) {
    return createProviderRules(z.array(providerConfigRuleSchema).parse(input));
}
export function parseZCodeBuiltinProviderConfigMap(input) {
    return createProviderRules(z.array(builtinProviderConfigRuleSchema).parse(input));
}
export function parseProviderTemplateMap(input) {
    return createTemplateRules(z.array(providerTemplateConfigRuleSchema).parse(input));
}
export function parseZCodeBuiltinProviderConfigRules(input) {
    const parsed = builtinProviderConfigRulesSchema.parse(input);
    return {
        providers: createProviderRules(parsed.providerRules),
        providerTemplates: createTemplateRules(parsed.templateRules),
    };
}
export function parsePersonalProviderConfigMap(input) {
    return createProviderRules(personalProviderConfigRulesSchema.parse(input).providerRules);
}
/** Account 运行时事实仍只有成员及权益；不是磁盘配置规则的第二种格式。 */
export function parseAccountProviderConfigMap(input) {
    const parsed = z.record(z.string().min(1), accountProviderConfigSchema).parse(input);
    return new ProviderConfigMap(Object.entries(parsed).map(([providerId, config]) => [
        providerId,
        createProviderConfig(config),
    ]));
}
export function parseProviderConfig(input) {
    return createProviderConfig(providerConfigDataSchema.parse(input));
}
export function parseModelConfig(input) {
    return createModelConfig(modelConfigDataSchema.parse(input));
}
export function parseZCodeBuiltinModelConfigRules(input) {
    const parsed = builtinModelConfigRulesSchema.parse(input);
    return new ModelConfigRules([
        ...parsed.modelRules.map((rule) => ({
            ...rule,
            type: "model",
            config: createModelConfig(rule.config),
        })),
        ...parsed.modelApiRules.map((rule) => ({
            ...rule,
            type: "model-api",
            config: createModelConfig(rule.config),
        })),
        ...parsed.providerSiteRules.map((rule) => ({
            ...rule,
            type: "provider-site",
            config: createModelConfig(rule.config),
        })),
        ...parsed.templateModelRules.map((rule) => ({
            ...rule,
            type: "template-model",
            config: createModelConfig(rule.config),
        })),
        ...parsed.builtinProviderModelRules.map((rule) => ({
            ...rule,
            type: "provider-model",
            config: createModelConfig(rule.config),
        })),
    ]);
}
export function parsePersonalModelConfigRules(input) {
    const parsed = personalModelConfigRulesSchema.parse(input);
    return new ModelConfigRules([
        ...parsed.providerModelRules.map((rule) => ({
            ...rule,
            type: "provider-model",
            config: createModelConfig(rule.config),
        })),
        ...parsed.manualProviderModelRules.map((rule) => ({
            ...rule,
            type: "manual-provider-model",
            config: createModelConfig(rule.config),
        })),
    ]);
}
function createProviderRules(rules) {
    return new ProviderConfigMap(rules.map(({ config, ...rule }) => ({
        ...rule,
        config: createProviderConfig(config),
    })));
}
function createTemplateRules(rules) {
    return new ProviderTemplateMap(rules.map((rule) => [
        rule.templateId,
        new ProviderTemplate({ ...rule, config: createProviderConfig(rule.config) }),
    ]));
}
function createProviderConfig(config) {
    return new ProviderConfig({
        ...config,
        access: config.access == null
            ? config.access
            : config.access.type !== "zhipu-account"
                ? new ApiKeyAccessConfig(config.access)
                : new ZhipuAccountAccessConfig(config.access),
        api: config.api == null ? config.api : new ProviderApiConfig(config.api),
    });
}
function createModelConfig(config) {
    return ModelConfig.fromData(config);
}
//# sourceMappingURL=schema.js.map