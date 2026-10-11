import type { IGenUiService } from "@zcode/services";
import type { PluginSandboxPlatformPort } from "@zcode/shared/mcp-apps";
import type { GenUiCardTarget, GenUiPage } from "../contract.js";
export interface GenUiPageInput {
    target: GenUiCardTarget;
    files: IGenUiService;
    state: IGenUiService;
    platform: PluginSandboxPlatformPort;
    openExternal(url: string): void | Promise<void>;
    confirm(prompt: string): Promise<string | null>;
    onVisibility?(visible: boolean): void;
    onSettled?(): void;
}
export declare function createGenUiPage(input: GenUiPageInput): GenUiPage;
//# sourceMappingURL=page.d.ts.map