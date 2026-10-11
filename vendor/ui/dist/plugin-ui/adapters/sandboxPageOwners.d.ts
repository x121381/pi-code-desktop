import { PluginUiPageManager, type ManagedPluginPage } from "../app/pluginUiPageManager.js";
export interface SandboxPageOwner extends ManagedPluginPage {
    readonly kind: "mcp" | "gen-ui";
}
export declare const sandboxPages: PluginUiPageManager<SandboxPageOwner>;
export declare function onSandboxPageRemoved(key: string, listener: () => void): () => void;
//# sourceMappingURL=sandboxPageOwners.d.ts.map