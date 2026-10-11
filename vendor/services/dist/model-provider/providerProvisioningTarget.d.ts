import { type PersonalProviderConfigRepository } from "@zcode/provider";
import type { ICredentialService } from "../credential/credential.js";
import type { ISettingService } from "../setting/setting.js";
import type { ProviderRuntime } from "./providerRuntime.js";
import type { AccountProviderService } from "@zcode/provider";
import type { IProviderProvisioningTargetService } from "./providerProvisioning.js";
export interface ProviderProvisioningTargetOptions {
    readonly providerRuntime: ProviderRuntime;
    readonly personalRepository: PersonalProviderConfigRepository;
    readonly accountProviderSource: AccountProviderService;
    readonly credentialService: ICredentialService;
    readonly settingService: ISettingService;
    readonly personalConfigFilePath: string;
    readonly stateFilePath: string;
    readonly listProvisioningCredentialKeys?: () => Promise<readonly string[]>;
}
/** 运行在目标 Environment 内的 Provisioning target；负责写正式 Store 并在失败时回滚。 */
export declare function createProviderProvisioningTarget(options: ProviderProvisioningTargetOptions): IProviderProvisioningTargetService;
//# sourceMappingURL=providerProvisioningTarget.d.ts.map