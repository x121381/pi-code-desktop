import type { ProviderProvisioningEnvelope, ProviderProvisioningResult } from "@zcode/shared";
/** 仅供 Window Host 调用的远端 Environment target，不加入 IServiceAccessor。 */
export interface IProviderProvisioningTargetService {
    apply(envelope: ProviderProvisioningEnvelope): Promise<ProviderProvisioningResult>;
}
export declare const IProviderProvisioningTargetService: import("../descriptors.js").ServiceDescriptor<IProviderProvisioningTargetService>;
//# sourceMappingURL=providerProvisioning.d.ts.map