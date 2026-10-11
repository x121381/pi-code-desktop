import { ProviderRegistryService, type AccountProviderConfigSnapshot, type ProviderConfigSnapshot, type ProviderSource } from "@zcode/provider";
import { type ProviderConfigRuntime, type ProviderConfigRuntimeOptions } from "./providerConfigRuntime.js";
import { type IModelSelectionService, type IProviderSettingsService, type ModelSelectionConfiguredDefaultSource, type ProviderSettingsConnectivityTester } from "./providerFacadeServices.js";
export interface ProviderRuntimeOptions extends ProviderConfigRuntimeOptions {
    readonly accountSource?: RefreshableProviderSource<AccountProviderConfigSnapshot>;
    readonly testConnectivity?: ProviderSettingsConnectivityTester;
}
export interface ProviderRuntimeDependencies {
    readonly configRuntime: ProviderConfigRuntime;
    readonly accountSource?: RefreshableProviderSource<AccountProviderConfigSnapshot>;
    readonly disposeAccountSource?: () => void;
    readonly testConnectivity?: ProviderSettingsConnectivityTester;
    readonly modelSelectionConfiguredDefaultSource?: ModelSelectionConfiguredDefaultSource;
    readonly disposeModelSelectionConfiguredDefaultSource?: () => void;
}
interface RefreshableProviderSource<TSnapshot> extends ProviderSource<TSnapshot> {
    refresh?(reason: string): Promise<TSnapshot>;
}
/**
 * 普通 API Provider 可以在账号能力尚未装配时独立运行。
 * Account Provider 由当前 Built-in revision 对齐的 access.entitled=false Overlay 显式 fail-closed。
 */
export declare class EmptyAccountProviderConfigSource implements ProviderSource<AccountProviderConfigSnapshot> {
    readonly configSource: ProviderSource<ProviderConfigSnapshot>;
    constructor(configSource: ProviderSource<ProviderConfigSnapshot>);
    read(): Promise<AccountProviderConfigSnapshot>;
    onDidChange(): () => void;
}
/** 组装一个进程内共享的 Provider Config、Registry 与 Facade。 */
export declare class ProviderRuntime {
    #private;
    readonly configService: ProviderConfigRuntime["configService"];
    readonly registryService: ProviderRegistryService;
    readonly providerSettings: IProviderSettingsService;
    readonly modelSelection: IModelSelectionService;
    constructor(dependencies: ProviderRuntimeDependencies);
    start(): Promise<void>;
    dispose(): void;
}
export declare function createProviderRuntime(options: ProviderRuntimeOptions): ProviderRuntime;
export declare function createProviderRuntimeFromConfigRuntime(dependencies: ProviderRuntimeDependencies): ProviderRuntime;
export {};
//# sourceMappingURL=providerRuntime.d.ts.map