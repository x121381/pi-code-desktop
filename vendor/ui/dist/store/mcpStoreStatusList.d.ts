import type { ZCodeMcpServer, ZCodeMcpServerStatusSnapshot } from "@zcode/shared";
export declare function mergeMcpServerStatusSnapshots(servers: ZCodeMcpServer[], statuses: Record<string, ZCodeMcpServerStatusSnapshot>, options?: {
    markMissingConnectingAsError?: boolean;
}): ZCodeMcpServer[];
//# sourceMappingURL=mcpStoreStatusList.d.ts.map