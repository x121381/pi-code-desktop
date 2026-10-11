import type { Transport } from "@modelcontextprotocol/client";
import type { PluginSandboxTransportPort } from "@zcode/shared/mcp-apps";
/**
 * 宿主 renderer 侧的 MCP `Transport`：一条 MessagePort（main 建的 channel 的 port2）上跑原始 JSON-RPC，
 * 另一端是 relay shell → 插件 iframe 里的官方 `App`（或手写 JSON-RPC）。不解析业务，只做 JSON-RPC 帧的最小形状检查。
 */
export declare function createPluginUiMessagePortTransport(port: PluginSandboxTransportPort): Transport;
//# sourceMappingURL=messagePortTransport.d.ts.map