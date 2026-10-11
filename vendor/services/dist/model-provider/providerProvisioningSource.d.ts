import { type ProviderProvisioningEnvelope } from "@zcode/shared";
import type { PersonalProviderConfigRepository, ProviderConfigLayerSnapshot } from "@zcode/provider";
import { type CredentialCipherProvider } from "../credential/providers/credentialCipherProvider.js";
import type { ISettingService } from "../setting/setting.js";
export declare const PROVIDER_PROVISIONING_OAUTH_CREDENTIAL_KEYS: readonly ["oauth:active_provider", "oauth:zai:access_token", "oauth:zai:refresh_token", "oauth:zai:user_info", "oauth:bigmodel:access_token", "oauth:bigmodel:refresh_token", "oauth:bigmodel:user_info", "zcodejwttoken"];
export interface ProviderProvisioningSource {
    read(syncId: string): Promise<ProviderProvisioningEnvelope>;
}
export interface ProviderProvisioningSourceOptions {
    readonly personalRepository: PersonalProviderConfigRepository;
    readonly settingService: ISettingService;
    readonly credentialFilePath: string;
    readonly personalConfigFilePath: string;
    readonly cipherProvider?: CredentialCipherProvider;
}
/** 从 Local Environment 读取可 Provision 的事实；不会读取或导出完整 Registry Snapshot。 */
export declare function createProviderProvisioningSource(options: ProviderProvisioningSourceOptions): ProviderProvisioningSource;
/** 分发读取不能把坏文件的内存降级当成权威；Source 与 Target 使用同一完整读取约束。 */
export declare function readProvisionablePersonalConfig(repository: PersonalProviderConfigRepository, filePath: string): Promise<ProviderConfigLayerSnapshot>;
export declare function resolveCredentialFilePath(appConfigDir: string): string;
/** 只枚举 Provisioning allowlist 的物理 key，供目标端实现 replace-allowlist 删除语义。 */
export declare function listProviderProvisioningCredentialKeys(credentialFilePath: string): Promise<readonly string[]>;
//# sourceMappingURL=providerProvisioningSource.d.ts.map