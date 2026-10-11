import { type PluginUiInstanceDerivation, type PluginUiRowDisposition } from "../domain/pluginUiInstancePolicy.js";
export declare function setPluginUiInstanceDerivation(sessionKey: string, derivation: PluginUiInstanceDerivation): void;
export declare function getPluginUiRowDisposition(sessionKey: string, toolCallId: string): PluginUiRowDisposition | undefined;
export declare function subscribePluginUiInstances(listener: () => void): () => void;
/** 测试用：清空全部记录。 */
export declare function resetPluginUiInstancesForTest(): void;
//# sourceMappingURL=pluginUiInstanceStore.d.ts.map