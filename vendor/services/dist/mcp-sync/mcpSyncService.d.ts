import type { IMcpSyncService } from "./mcpSync.js";
export interface McpSyncServiceDependencies {
    /**
     * MCP server 运行态状态检查的执行面。真实 connect/listTools 必须发生在
     * agent 进程（workspace 的 PATH/cwd 环境），host 侧没有可替代实现；无该依赖的
     * 构造（纯目录同步用途/单测）调用 listWorkspaceMcpServerStatuses 会显式抛错。
     */
    listMcpServerStatuses?: IMcpSyncService["listWorkspaceMcpServerStatuses"];
}
export declare function createMcpSyncService(dependencies?: McpSyncServiceDependencies): IMcpSyncService;
//# sourceMappingURL=mcpSyncService.d.ts.map