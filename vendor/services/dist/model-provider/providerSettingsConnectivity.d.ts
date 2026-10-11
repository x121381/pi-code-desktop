import type { ModelConnectivityResult } from "@zcode/shared";
import type { ProviderSettingsConnectivityTester } from "./providerFacadeServices.js";
interface FormalModelConnectivityInput {
    readonly workspacePath: string;
    readonly workspaceIdentity?: string;
    readonly selection: {
        readonly providerId: string;
        readonly modelId: string;
    };
}
type FormalModelConnectivityExecutor = (input: FormalModelConnectivityInput) => Promise<{
    readonly success: true;
}>;
/**
 * 设置页只负责把已经落盘并进入 Registry 的 ModelSelection 交给目标 Environment。
 * Provider 鉴权、headers、reasoning 映射和流消费全部由正式 Model 执行链负责。
 */
export declare function createProviderSettingsConnectivityTester(dependencies: {
    readonly testModelConnectivity: FormalModelConnectivityExecutor;
}): ProviderSettingsConnectivityTester;
export type { ModelConnectivityResult };
//# sourceMappingURL=providerSettingsConnectivity.d.ts.map