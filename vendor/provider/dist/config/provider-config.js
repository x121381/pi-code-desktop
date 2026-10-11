/* oxlint-disable eslint(max-lines) -- Provider 与 Access Config 的 Overlay/序列化必须集中维护同一联合类型；待契约稳定后再按配置族拆文件。 */
import { ConfigOverlay } from "../config-overlay.js";
import { completeApiKeyAccessDataSchema, completeZhipuAccountAccessDataSchema, completeProviderApiDataSchema, completeProviderConfigDataSchema, } from "./provider-data-schema.js";
import { validateConfigSchema } from "./schema-validation.js";
export class ApiKeyAccessConfig extends ConfigOverlay {
    type;
    apiKey;
    apiKeyManagementUrl;
    constructor(input = {}) {
        super();
        this.type = input.type ?? "api-key";
        this.apiKey = input.apiKey;
        this.apiKeyManagementUrl = input.apiKeyManagementUrl;
        Object.freeze(this);
    }
    overlay(next) {
        return new ApiKeyAccessConfig({
            type: next.type,
            apiKey: this.overlayValue(this.apiKey, next.apiKey),
            apiKeyManagementUrl: this.overlayValue(this.apiKeyManagementUrl, next.apiKeyManagementUrl),
        });
    }
    validateComplete(path = []) {
        return validateConfigSchema(completeApiKeyAccessDataSchema, this.toJSON(), path);
    }
    toJSON() {
        return {
            type: this.type,
            ...objectWithoutUndefined({
                apiKey: this.apiKey,
                apiKeyManagementUrl: this.apiKeyManagementUrl,
            }),
        };
    }
}
export class ZhipuAccountAccessConfig extends ConfigOverlay {
    type = "zhipu-account";
    accountType;
    mode;
    entitled;
    constructor(input = {}) {
        super();
        this.accountType = input.accountType;
        this.mode = input.mode;
        this.entitled = input.entitled;
        Object.freeze(this);
    }
    overlay(next) {
        return new ZhipuAccountAccessConfig({
            accountType: this.overlayValue(this.accountType, next.accountType),
            mode: this.overlayValue(this.mode, next.mode),
            entitled: this.overlayValue(this.entitled, next.entitled),
        });
    }
    validateComplete(path = []) {
        return validateConfigSchema(completeZhipuAccountAccessDataSchema, this.toJSON(), path);
    }
    toJSON() {
        return {
            type: this.type,
            ...objectWithoutUndefined({
                accountType: this.accountType,
                mode: this.mode,
                entitled: this.entitled,
            }),
        };
    }
}
/** 手动 Key 的编辑/保存共用能力判断，不把套餐 Key 误写成普通 API Key。 */
export function isApiKeyAccess(access) {
    return access?.type === "api-key" || access?.type === "zhipu-coding-plan-api-key";
}
export class ProviderApiConfig extends ConfigOverlay {
    type;
    baseUrl;
    headers;
    constructor(input = {}) {
        super();
        this.type = input.type;
        this.baseUrl = input.baseUrl;
        this.headers = input.headers ? Object.freeze({ ...input.headers }) : input.headers;
        Object.freeze(this);
    }
    overlay(next) {
        return new ProviderApiConfig({
            type: this.overlayValue(this.type, next.type),
            baseUrl: this.overlayValue(this.baseUrl, next.baseUrl),
            headers: this.overlayValue(this.headers, next.headers),
        });
    }
    validateComplete(path = []) {
        // 旧检查只判断 type 非空，不可信 JS 值可绕过枚举；准入与保存共用 schema。
        return validateConfigSchema(completeProviderApiDataSchema, this.toJSON(), path);
    }
    toJSON() {
        return objectWithoutUndefined({
            type: this.type,
            baseUrl: this.baseUrl,
            headers: this.headers,
        });
    }
}
export class ProviderConfig extends ConfigOverlay {
    group;
    logo;
    access;
    api;
    builtinModelIds;
    personalModelIds;
    modelOrder;
    visibility;
    constructor(input = {}) {
        super();
        this.group = input.group;
        this.logo = freezeProviderLogo(input.logo);
        this.access = input.access;
        this.api = input.api;
        this.builtinModelIds = freezeModelIds(input.builtinModelIds);
        this.personalModelIds = freezeModelIds(input.personalModelIds);
        this.modelOrder = freezeModelIds(input.modelOrder);
        this.visibility = input.visibility;
        Object.freeze(this);
    }
    overlay(next) {
        return new ProviderConfig({
            group: this.overlayValue(this.group, next.group),
            logo: this.overlayValue(this.logo, next.logo),
            access: overlayProviderAccess(this.access, next.access),
            api: this.overlayConfig(this.api, next.api),
            builtinModelIds: this.overlayValue(this.builtinModelIds, next.builtinModelIds),
            personalModelIds: this.overlayValue(this.personalModelIds, next.personalModelIds),
            modelOrder: this.overlayValue(this.modelOrder, next.modelOrder),
            visibility: this.overlayValue(this.visibility, next.visibility),
        });
    }
    withBuiltinModelIds(builtinModelIds) {
        return this.overlay(new ProviderConfig({ builtinModelIds }));
    }
    withPersonalModelIds(modelIds) {
        return this.overlay(new ProviderConfig({ personalModelIds: modelIds }));
    }
    withModelOrder(modelOrder) {
        return this.overlay(new ProviderConfig({ modelOrder }));
    }
    withoutGroup() {
        return new ProviderConfig({
            logo: this.logo,
            access: this.access,
            api: this.api,
            builtinModelIds: this.builtinModelIds,
            personalModelIds: this.personalModelIds,
            modelOrder: this.modelOrder,
            visibility: this.visibility,
        });
    }
    /** 普通 Provider 字段保存不拥有成员变更；成员只能由明确的领域操作更新。 */
    withModelMembershipFrom(source) {
        return new ProviderConfig({
            group: this.group,
            logo: this.logo,
            access: this.access,
            api: this.api,
            builtinModelIds: source?.builtinModelIds,
            personalModelIds: source?.personalModelIds,
            modelOrder: source?.modelOrder,
            visibility: this.visibility,
        });
    }
    validateComplete(path = []) {
        // 不再用字段存在性代替值域验证，也不把展示/成员等可选字段变成执行必填项。
        return validateConfigSchema(completeProviderConfigDataSchema, this.toJSON(), path);
    }
    toJSON() {
        return objectWithoutUndefined({
            group: this.group,
            logo: this.logo,
            access: this.access?.toJSON() ?? this.access,
            api: this.api?.toJSON() ?? this.api,
            builtinModelIds: this.builtinModelIds,
            personalModelIds: this.personalModelIds,
            modelOrder: this.modelOrder,
            visibility: this.visibility,
        });
    }
}
/** Template 是元数据与 Provider Overlay 的领域壳，本身不是 Provider。 */
export class ProviderTemplate {
    templateId;
    templateNameMap;
    config;
    constructor(input) {
        this.templateId = input.templateId;
        this.templateNameMap = Object.freeze({ ...input.templateNameMap });
        this.config = input.config;
        Object.freeze(this);
    }
    toJSON() {
        return {
            templateId: this.templateId,
            templateNameMap: this.templateNameMap,
            config: this.config.toJSON(),
        };
    }
}
export function resolveProviderTemplateName(templateId, template, locale) {
    return (template.templateNameMap[locale]?.trim() ||
        template.templateNameMap["en-US"]?.trim() ||
        templateId);
}
/** Built-in Template 与真实 Provider 使用不同身份空间；Template 永不进入 Registry。 */
export class ProviderTemplateMap extends ConfigOverlay {
    #values;
    constructor(entries = []) {
        super();
        const values = new Map();
        for (const [templateId, template] of entries) {
            if (values.has(templateId))
                throw new Error(`重复 Provider Template key: ${templateId}`);
            values.set(templateId, template);
        }
        this.#values = values;
        Object.freeze(this);
    }
    static empty() {
        return new ProviderTemplateMap();
    }
    overlay(next) {
        const result = new Map(this.#values);
        for (const [templateId, template] of next.#values)
            result.set(templateId, template);
        return new ProviderTemplateMap(result);
    }
    validateComplete() {
        return [];
    }
    get(templateId) {
        return this.#values.get(templateId);
    }
    has(templateId) {
        return this.#values.has(templateId);
    }
    keys() {
        return [...this.#values.keys()];
    }
    entries() {
        return [...this.#values.entries()];
    }
    toJSON() {
        return this.entries().map(([, template]) => template.toJSON());
    }
}
function freezeProviderLogo(logo) {
    return logo ? Object.freeze({ ...logo }) : logo;
}
function freezeModelIds(modelIds) {
    if (!modelIds)
        return modelIds;
    return Object.freeze(modelIds.map((modelId) => {
        const normalized = modelId.trim();
        if (!normalized)
            throw new Error("Model ID 不能为空");
        return normalized;
    }));
}
/** 索引只保存完整规则；get/entries 是内容投影，改成员时不能丢掉外层身份和名称。 */
export class ProviderConfigMap extends ConfigOverlay {
    #values;
    constructor(entries = []) {
        super();
        const values = new Map();
        for (const entry of entries) {
            const rule = "providerId" in entry ? entry : { providerId: entry[0], config: entry[1] };
            if (values.has(rule.providerId))
                throw new Error(`重复 Provider key: ${rule.providerId}`);
            values.set(rule.providerId, Object.freeze({ ...rule }));
        }
        this.#values = values;
        Object.freeze(this);
    }
    static empty() {
        return new ProviderConfigMap();
    }
    overlay(next) {
        const result = new Map(this.#values);
        for (const [providerId, rule] of next.#values) {
            const current = result.get(providerId);
            result.set(providerId, current
                ? {
                    providerId,
                    templateId: this.overlayValue(current.templateId, rule.templateId),
                    providerName: this.overlayValue(current.providerName, rule.providerName),
                    enabled: this.overlayValue(current.enabled, rule.enabled),
                    config: current.config.overlay(rule.config),
                }
                : rule);
        }
        return new ProviderConfigMap(result.values());
    }
    mapConfigs(transform) {
        return new ProviderConfigMap(this.rules().map((rule) => ({
            ...rule,
            config: transform(rule.config, rule.providerId, rule),
        })));
    }
    reorder(providerIds) {
        const result = new Map();
        for (const providerId of providerIds) {
            const rule = this.#values.get(providerId);
            if (rule && !result.has(providerId))
                result.set(providerId, rule);
        }
        for (const [providerId, rule] of this.#values) {
            if (!result.has(providerId))
                result.set(providerId, rule);
        }
        return new ProviderConfigMap(result.values());
    }
    set(providerId, config) {
        return this.setRule({ ...this.#values.get(providerId), providerId, config });
    }
    setRule(rule) {
        const result = new Map(this.#values);
        result.set(rule.providerId, rule);
        return new ProviderConfigMap(result.values());
    }
    delete(providerId) {
        return new ProviderConfigMap(this.rules().filter((rule) => rule.providerId !== providerId));
    }
    validateComplete(path = []) {
        return this.entries().flatMap(([providerId, config]) => config.validateComplete([...path, providerId]));
    }
    get(providerId) {
        return this.#values.get(providerId)?.config;
    }
    getRule(providerId) {
        return this.#values.get(providerId);
    }
    has(providerId) {
        return this.#values.has(providerId);
    }
    keys() {
        return [...this.#values.keys()];
    }
    rules() {
        return [...this.#values.values()];
    }
    entries() {
        return this.rules().map((rule) => [rule.providerId, rule.config]);
    }
    toJSON() {
        return this.rules().map(({ config, ...rule }) => objectWithoutUndefined({ ...rule, config: config.toJSON() }));
    }
}
function overlayProviderAccess(current, next) {
    if (next === undefined)
        return current;
    if (next === null || current === undefined || current === null)
        return next;
    if (current.type !== next.type)
        return next;
    switch (current.type) {
        case "api-key":
        case "zhipu-coding-plan-api-key":
            return current.overlay(next);
        case "zhipu-account":
            return current.overlay(next);
    }
}
function objectWithoutUndefined(input) {
    return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined));
}
//# sourceMappingURL=provider-config.js.map