import type { ZCodeAgentMcpServer, ZCodeSessionImportHistory, ZCodeSessionImportMessage, ZCodeSessionStateSnapshot } from "@zcode/shared";
export interface ImportedClaudeHistoryRepairTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string;
}
export interface ImportedClaudeHistoryRepairResult {
    title?: string;
    createdAt?: number;
    updatedAt?: number;
    messages: ZCodeSessionImportMessage[];
    source: "legacySnapshot" | "nativeJsonl";
}
export interface ImportedClaudeSessionRepairTarget extends ImportedClaudeHistoryRepairTarget {
    mcpServers?: ZCodeAgentMcpServer[];
}
export interface ImportedClaudeSessionRepairCreateParams {
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    mode: ZCodeSessionStateSnapshot["session"]["mode"];
    model: ZCodeSessionStateSnapshot["settings"]["model"]["current"];
    thoughtLevel?: string;
    persistence: "immediate";
    mcpServers?: ZCodeAgentMcpServer[];
    importedHistory: ZCodeSessionImportHistory;
}
export declare function shouldRepairImportedClaudeSnapshot(snapshot: Pick<ZCodeSessionStateSnapshot, "messages" | "runtime" | "session">): boolean;
export declare function resolveImportedClaudeHistoryForRepair(target: ImportedClaudeHistoryRepairTarget): Promise<ImportedClaudeHistoryRepairResult | null>;
export declare function repairImportedClaudeSessionSnapshot<T>(params: {
    snapshot: ZCodeSessionStateSnapshot;
    target: ImportedClaudeSessionRepairTarget;
    createSession(input: ImportedClaudeSessionRepairCreateParams): Promise<T>;
    onRepair?(history: ImportedClaudeHistoryRepairResult): void;
}): Promise<T | null>;
//# sourceMappingURL=importedClaudeHistoryRepair.d.ts.map