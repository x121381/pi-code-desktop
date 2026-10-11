export interface OfficialMcpIssuanceAudit {
    markFirst(pluginId: string, mcpKey: string, workspaceKey: string): boolean;
}
/** 进程内有界首次发放审计；返回 true 表示该三元组第一次出现。 */
export declare function createOfficialMcpIssuanceAudit(maxEntries?: number): OfficialMcpIssuanceAudit;
//# sourceMappingURL=officialMcpIssuanceAudit.d.ts.map