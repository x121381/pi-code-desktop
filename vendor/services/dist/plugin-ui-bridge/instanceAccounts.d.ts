import type { McpAppInstance } from "@zcode/shared/mcp-apps";
import type { PluginUiPluginScope, PluginUiPrepareSandboxParams } from "./contract.js";
/** Host 的账号上下文来自凭据 owner；不接收页面传入的账号或访问令牌。 */
export declare function createPluginUiAccountBindings(deps: {
    readAccount(): Promise<unknown>;
    open(params: PluginUiPrepareSandboxParams & {
        accountContext: string;
    }): Promise<McpAppInstance>;
    close(params: PluginUiPluginScope): Promise<void>;
}): {
    open(params: PluginUiPrepareSandboxParams): Promise<{
        runtimeId: string;
        generation: number;
        appIdentity: string;
        token: string;
    }>;
    close: (params: PluginUiPluginScope) => Promise<void>;
    invalidate(): void;
};
//# sourceMappingURL=instanceAccounts.d.ts.map