import { ConfigOverlay, type ConfigValidationIssue } from "../config-overlay.js";
import type { z } from "zod";
import { type providerApiTypeDataSchema, type providerGroupDataSchema, type zhipuAccountModeDataSchema, type providerVisibilityDataSchema, type providerLogoDataSchema, type apiKeyAccessDataSchema, type zhipuAccountAccessDataSchema, type providerAccessDataSchema, type providerApiDataSchema, type providerConfigDataSchema, type providerTemplateNameMapDataSchema, type providerTemplateDataSchema } from "./provider-data-schema.js";
import type { ModelId, ProviderId, ProviderTemplateId } from "./ids.js";
import type { ProviderConfigRuleData } from "./rule-data-schema.js";
export type ProviderApiType = z.infer<typeof providerApiTypeDataSchema>;
export type ProviderGroup = z.infer<typeof providerGroupDataSchema>;
export type ZhipuAccountMode = z.infer<typeof zhipuAccountModeDataSchema>;
export type ApiKeyAccessConfigInput = Omit<ApiKeyAccessConfigObject, "type"> & {
    readonly type?: ApiKeyAccessConfigObject["type"];
};
export type ApiKeyAccessConfigObject = Readonly<z.infer<typeof apiKeyAccessDataSchema>>;
export declare class ApiKeyAccessConfig extends ConfigOverlay<ApiKeyAccessConfig> {
    readonly type: ApiKeyAccessConfigObject["type"];
    readonly apiKey?: ApiKeyAccessConfigInput["apiKey"];
    readonly apiKeyManagementUrl?: ApiKeyAccessConfigInput["apiKeyManagementUrl"];
    constructor(input?: ApiKeyAccessConfigInput);
    overlay(next: ApiKeyAccessConfig): ApiKeyAccessConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ApiKeyAccessConfigObject;
}
export type ZhipuAccountAccessConfigInput = Omit<ZhipuAccountAccessConfigObject, "type">;
export type ZhipuAccountAccessConfigObject = Readonly<z.infer<typeof zhipuAccountAccessDataSchema>>;
export declare class ZhipuAccountAccessConfig extends ConfigOverlay<ZhipuAccountAccessConfig> {
    readonly type: "zhipu-account";
    readonly accountType?: ZhipuAccountAccessConfigInput["accountType"];
    readonly mode?: ZhipuAccountAccessConfigInput["mode"];
    readonly entitled?: ZhipuAccountAccessConfigInput["entitled"];
    constructor(input?: ZhipuAccountAccessConfigInput);
    overlay(next: ZhipuAccountAccessConfig): ZhipuAccountAccessConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ZhipuAccountAccessConfigObject;
}
export type ProviderAccessConfig = ApiKeyAccessConfig | ZhipuAccountAccessConfig;
export type ProviderAccessConfigObject = Readonly<z.infer<typeof providerAccessDataSchema>>;
/** 手动 Key 的编辑/保存共用能力判断，不把套餐 Key 误写成普通 API Key。 */
export declare function isApiKeyAccess<T extends {
    readonly type: string;
}>(access: T | null | undefined): access is Extract<T, {
    readonly type: ApiKeyAccessConfigObject["type"];
}>;
export type ProviderVisibility = z.infer<typeof providerVisibilityDataSchema>;
export type ProviderLogoRef = Readonly<z.infer<typeof providerLogoDataSchema>>;
export type ProviderApiConfigInput = Readonly<z.infer<typeof providerApiDataSchema>>;
export declare class ProviderApiConfig extends ConfigOverlay<ProviderApiConfig> {
    readonly type?: ProviderApiConfigInput["type"];
    readonly baseUrl?: ProviderApiConfigInput["baseUrl"];
    readonly headers?: ProviderApiConfigInput["headers"];
    constructor(input?: ProviderApiConfigInput);
    overlay(next: ProviderApiConfig): ProviderApiConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ProviderApiConfigInput;
}
export type ProviderConfigInput = Omit<ProviderConfigObject, "access" | "api"> & {
    readonly access?: ProviderAccessConfig | null;
    readonly api?: ProviderApiConfig | null;
};
export type ProviderConfigObject = Readonly<z.infer<typeof providerConfigDataSchema>>;
export declare class ProviderConfig extends ConfigOverlay<ProviderConfig> {
    readonly group?: ProviderConfigObject["group"];
    readonly logo?: ProviderConfigObject["logo"];
    readonly access?: ProviderAccessConfig | null;
    readonly api?: ProviderApiConfig | null;
    readonly builtinModelIds?: ProviderConfigObject["builtinModelIds"];
    readonly personalModelIds?: ProviderConfigObject["personalModelIds"];
    readonly modelOrder?: ProviderConfigObject["modelOrder"];
    readonly visibility?: ProviderConfigObject["visibility"];
    constructor(input?: ProviderConfigInput);
    overlay(next: ProviderConfig): ProviderConfig;
    withBuiltinModelIds(builtinModelIds: readonly ModelId[]): ProviderConfig;
    withPersonalModelIds(modelIds: readonly ModelId[]): ProviderConfig;
    withModelOrder(modelOrder: readonly ModelId[]): ProviderConfig;
    withoutGroup(): ProviderConfig;
    /** 普通 Provider 字段保存不拥有成员变更；成员只能由明确的领域操作更新。 */
    withModelMembershipFrom(source: ProviderConfig | undefined): ProviderConfig;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    toJSON(): ProviderConfigObject;
}
export type ProviderTemplateNameMap = Readonly<z.infer<typeof providerTemplateNameMapDataSchema>>;
export type ProviderTemplateLocale = keyof ProviderTemplateNameMap;
export type ProviderTemplateInput = Omit<ProviderTemplateObject, "config"> & {
    readonly config: ProviderConfig;
};
export type ProviderTemplateObject = Readonly<z.infer<typeof providerTemplateDataSchema>>;
/** Template 是元数据与 Provider Overlay 的领域壳，本身不是 Provider。 */
export declare class ProviderTemplate {
    readonly templateId: ProviderTemplateId;
    readonly templateNameMap: ProviderTemplateNameMap;
    readonly config: ProviderConfig;
    constructor(input: ProviderTemplateInput);
    toJSON(): ProviderTemplateObject;
}
export declare function resolveProviderTemplateName(templateId: ProviderTemplateId, template: Pick<ProviderTemplate, "templateNameMap">, locale: ProviderTemplateLocale): string;
/** Built-in Template 与真实 Provider 使用不同身份空间；Template 永不进入 Registry。 */
export declare class ProviderTemplateMap extends ConfigOverlay<ProviderTemplateMap> {
    #private;
    constructor(entries?: Iterable<readonly [ProviderTemplateId, ProviderTemplate]>);
    static empty(): ProviderTemplateMap;
    overlay(next: ProviderTemplateMap): ProviderTemplateMap;
    validateComplete(): readonly ConfigValidationIssue[];
    get(templateId: ProviderTemplateId): ProviderTemplate | undefined;
    has(templateId: ProviderTemplateId): boolean;
    keys(): ProviderTemplateId[];
    entries(): Array<readonly [ProviderTemplateId, ProviderTemplate]>;
    toJSON(): ProviderTemplateObject[];
}
export type ProviderConfigRule = Readonly<Omit<ProviderConfigRuleData, "config"> & {
    config: ProviderConfig;
}>;
/** 索引只保存完整规则；get/entries 是内容投影，改成员时不能丢掉外层身份和名称。 */
export declare class ProviderConfigMap extends ConfigOverlay<ProviderConfigMap> {
    #private;
    constructor(entries?: Iterable<ProviderConfigRule | readonly [ProviderId, ProviderConfig]>);
    static empty(): ProviderConfigMap;
    overlay(next: ProviderConfigMap): ProviderConfigMap;
    mapConfigs(transform: (config: ProviderConfig, providerId: ProviderId, rule: ProviderConfigRule) => ProviderConfig): ProviderConfigMap;
    reorder(providerIds: readonly ProviderId[]): ProviderConfigMap;
    set(providerId: ProviderId, config: ProviderConfig): ProviderConfigMap;
    setRule(rule: ProviderConfigRule): ProviderConfigMap;
    delete(providerId: ProviderId): ProviderConfigMap;
    validateComplete(path?: readonly string[]): readonly ConfigValidationIssue[];
    get(providerId: ProviderId): ProviderConfig | undefined;
    getRule(providerId: ProviderId): ProviderConfigRule | undefined;
    has(providerId: ProviderId): boolean;
    keys(): ProviderId[];
    rules(): ProviderConfigRule[];
    entries(): Array<readonly [ProviderId, ProviderConfig]>;
    toJSON(): ProviderConfigRuleData[];
}
//# sourceMappingURL=provider-config.d.ts.map