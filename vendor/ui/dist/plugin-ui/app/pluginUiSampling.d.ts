import type { IPluginUiSamplingService, PluginUiPluginScope } from "@zcode/services";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
export declare function createPluginUiSampling(deps: {
    bridge: Pick<IPluginUiSamplingService, "sample" | "cancelSampling">;
    scope(): PluginUiPluginScope;
    canSample(): boolean;
    createCallId(): string;
    activeCalls: Set<string>;
    onBusyChange?(): void;
}): {
    reset(): void;
    install(bridge: PluginUiHostBridge, isCurrent: () => boolean): void;
};
//# sourceMappingURL=pluginUiSampling.d.ts.map