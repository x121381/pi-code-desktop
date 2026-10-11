import { type ZCodeProvider, type AgentSummary, type AgentsCapability, type SubAgentConfig } from "@zcode/shared";
import type { ISubagentsService } from "@zcode/services";
interface SubagentsStoreState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    loadedWorkspacePath: string | null;
    loadedWorkspaceIdentity: string | null;
    provider: ZCodeProvider;
    loadedProvider: ZCodeProvider | null;
    agents: AgentSummary[];
    capability: AgentsCapability | null;
    loading: boolean;
    error: string | null;
    /** 正在操作的 agent ID（用于 UI 状态指示） */
    operatingAgentId: string | null;
    initialize: (workspacePath: string, providerOrSubagentsService: ZCodeProvider | ISubagentsService, maybeSubagentsService?: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
    refresh: (subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
    setEnabled: (agentId: string, enabled: boolean, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<void>;
    createAgent: (config: SubAgentConfig, provider: ZCodeProvider, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<AgentSummary | null>;
    updateAgent: (agentId: string, config: SubAgentConfig, oldFilePath: string | undefined, provider: ZCodeProvider, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<AgentSummary | null>;
    deleteAgent: (agentId: string, filePath: string, subagentsService: ISubagentsService, workspaceIdentity?: string) => Promise<boolean>;
}
export declare const useSubagentsStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SubagentsStoreState>>;
type SubagentsStoreE2EBridge = typeof useSubagentsStore;
declare global {
    interface Window {
        __subagentsStoreE2E?: SubagentsStoreE2EBridge;
    }
}
export declare function refreshLoadedSubagentsStoreForWorkspace(params: {
    workspacePath?: string | null;
    workspaceIdentity?: string | null;
    subagentsService: ISubagentsService;
}): Promise<void>;
export {};
//# sourceMappingURL=subagentsStore.d.ts.map