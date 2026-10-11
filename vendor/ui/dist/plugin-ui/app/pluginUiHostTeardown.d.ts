import type { Transport } from "@modelcontextprotocol/client";
import type { PluginSandboxHandle, PluginSandboxPlatformPort } from "@zcode/shared/mcp-apps";
import type { PluginUiHostBridge } from "./pluginUiHostBridge.js";
/**
 * 实例卸载的收尾顺序：已握手的实例先给页面 `ui/resource-teardown` 的清理窗口（回包或超时），再关桥与端口、
 * 按捕获的 sandboxId/initId 释放旧登记，不能影响新凭证创建的页面。
 */
export declare function runPluginUiHostTeardown(input: {
    bridge: PluginUiHostBridge | null;
    transport: Transport | null;
    wasAttached: boolean;
    handle: PluginSandboxHandle | null;
    platform: Pick<PluginSandboxPlatformPort, "disposeSandbox">;
    setTimer: (callback: () => void, ms: number) => () => void;
    teardownTimeoutMs?: number;
}): Promise<void>;
//# sourceMappingURL=pluginUiHostTeardown.d.ts.map