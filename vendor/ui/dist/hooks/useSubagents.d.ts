import type { ZCodeProvider } from "@zcode/shared";
export declare function useSubagents(workspacePath: string | null, provider: ZCodeProvider, explicitWorkspaceIdentity?: string): {
    agents: import("@zcode/shared").AgentSummary[];
    capability: import("@zcode/shared").AgentsCapability | null;
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
    setEnabled: (agentId: string, enabled: boolean) => Promise<void>;
};
//# sourceMappingURL=useSubagents.d.ts.map