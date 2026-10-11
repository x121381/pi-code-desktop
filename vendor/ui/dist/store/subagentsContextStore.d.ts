import type { ISubagentsService } from "@zcode/services";
import { type AgentSummary, type AgentsCapability, type ZCodeProvider } from "@zcode/shared";
export interface SubagentsContextSnapshot {
    workspacePath: string;
    workspaceIdentity: string | null;
    provider: ZCodeProvider;
    agents: AgentSummary[];
    capability: AgentsCapability | null;
    loading: boolean;
    loaded: boolean;
    error: string | null;
}
interface SubagentsContextStoreState {
    contexts: Record<string, SubagentsContextSnapshot>;
    initialize: (workspacePath: string, provider: ZCodeProvider, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
    refresh: (workspacePath: string, provider: ZCodeProvider, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
    setEnabled: (workspacePath: string, provider: ZCodeProvider, agentId: string, enabled: boolean, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
}
export declare function getSubagentsContextKey(workspacePath: string, provider: ZCodeProvider, workspaceIdentity?: string | null): string;
export declare const useSubagentsContextStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SubagentsContextStoreState>>;
export {};
//# sourceMappingURL=subagentsContextStore.d.ts.map