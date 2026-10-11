import type { AccountProviderConnectionResolver, ProviderConfigSnapshot, ProviderSource } from "@zcode/provider";
import { AccountProviderService } from "@zcode/provider";
import { type ApiClient, type ProviderFamilyConnectionSelectionSettings, type ProviderFamilyDomain, type ZCodeAccountAccess, type ZCodeProviderAccountAccess } from "@zcode/shared";
import type { CodingPlanAvailabilityProvider, CodingPlanAvailabilityResult } from "#src/model-provider/codingPlanProviderAvailability.js";
export interface AccountProviderConnectionSettings {
    readonly providerFamilyDomain: ProviderFamilyDomain | null;
    readonly selections: ProviderFamilyConnectionSelectionSettings;
    /** Host 旧连接导入尚不能确定身份；仅运行时事实，不写入配置或协议。 */
    readonly unresolvedFamilies?: readonly ProviderFamilyDomain[];
}
export interface AccountProviderFamilyAvailabilityInput {
    readonly family: ProviderFamilyDomain;
    readonly providers: readonly CodingPlanAvailabilityProvider[];
    readonly selections: ProviderFamilyConnectionSelectionSettings;
}
export type AccountProviderFamilyAvailabilityResolver = (input: AccountProviderFamilyAvailabilityInput) => Promise<Partial<Record<string, CodingPlanAvailabilityResult>>>;
export interface AccountProviderConnectionResolverOptions {
    readonly readSettings: () => Promise<AccountProviderConnectionSettings>;
    readonly loadCodingPlanApiKey: (providerId: string, family: ProviderFamilyDomain, accountIdentity: string, forceRefresh: boolean) => Promise<string | null>;
    readonly loadAccountIdentity: (family: ProviderFamilyDomain) => Promise<string | null>;
    readonly resolveFamilyAvailability: AccountProviderFamilyAvailabilityResolver;
}
export interface CodingPlanFamilyAvailabilityResolverOptions {
    readonly apiClient: ApiClient;
    readonly credentialService?: {
        load(key: string): Promise<string | null>;
    };
}
export interface AccountProviderConfigSourceOptions extends AccountProviderConnectionResolverOptions {
    readonly configSource: ProviderSource<ProviderConfigSnapshot>;
}
/**
 * 把现有账号域、连接模式和套餐权益统一投影为领域层 Connection Result。
 *
 * 该适配器不保存凭据。Personal Coding Plan Key 的物理来源由注入端决定；
 * Start/Team 的动态凭据继续由现有 availability 依赖按请求读取。
 */
export declare function createAccountProviderConnectionResolver(options: AccountProviderConnectionResolverOptions): AccountProviderConnectionResolver;
/** 组装 Config、账号连接解析与第三层 Account Provider Config Source。 */
export declare function createAccountProviderConfigSource(options: AccountProviderConfigSourceOptions): AccountProviderService;
/** 用当前稳定的 Plan 查询实现生产 Family Availability Port。 */
export declare function createCodingPlanFamilyAvailabilityResolver(options: CodingPlanFamilyAvailabilityResolverOptions): AccountProviderFamilyAvailabilityResolver;
/**
 * 把 Active Model 的静态 Access 约束投影到当前账号连接。
 *
 * Team scope 和账号版本不能冻结进 Model：账号切换后旧 Model 会错误失效。
 * 每次请求重新读取当前选择；只有 family 与 mode 兼容时才返回动态访问事实。
 */
export declare function resolveCurrentAccountAccess(input: {
    readonly access: ZCodeProviderAccountAccess;
    readonly readSettings: () => Promise<AccountProviderConnectionSettings>;
    readonly loadAccountIdentity: (family: ProviderFamilyDomain) => Promise<string | null>;
}): Promise<ZCodeAccountAccess | null>;
//# sourceMappingURL=accountProviderConnectionResolver.d.ts.map