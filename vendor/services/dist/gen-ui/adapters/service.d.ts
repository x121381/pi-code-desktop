import type { PluginSandboxHandle, PluginSandboxRegisterInput } from "@zcode/shared/mcp-apps";
import type { IGenUiService } from "../contract.js";
export declare function createGenUiService(options?: {
    stateRoot?: string;
    outputRoot?: string;
    registerSandbox?: (input: PluginSandboxRegisterInput) => Promise<PluginSandboxHandle>;
}): IGenUiService & {
    dispose(): void;
};
//# sourceMappingURL=service.d.ts.map