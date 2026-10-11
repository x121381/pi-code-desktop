import { type ZCodeAutomation, type ZCodeAutomationRun, type ZCodeAutomationScheduleRule, type ModelSelection } from "@zcode/shared";
import type { IZCodeAgentService } from "@zcode/services";
/** 单条 automation 的运行历史缓存（按 automationId 记 loading/data/error）。 */
export interface AutomationRunsEntry {
    status: "loading" | "loaded" | "error";
    runs?: ZCodeAutomationRun[];
    error?: string;
}
export type AutomationRunNowResult = "queued" | "duplicate" | "failed";
export interface CreateAutomationInput {
    title: string;
    cronExpr: string;
    prompt: string;
    modelSelection?: ModelSelection;
    mode?: string;
    recurring?: boolean;
    maxRuns?: number;
    endAt?: number;
    scheduleRule?: ZCodeAutomationScheduleRule;
    workspacePath?: string;
    workspaceIdentity?: string;
}
export interface UpdateAutomationInput {
    title?: string;
    cronExpr?: string;
    prompt?: string;
    modelSelection?: ModelSelection | null;
    mode?: string | null;
    recurring?: boolean;
    maxRuns?: number | null;
    endAt?: number | null;
    scheduleRule?: ZCodeAutomationScheduleRule | null;
    scheduleEditedByUser?: boolean;
}
export interface AutomationManagementState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    automations: ZCodeAutomation[];
    loading: boolean;
    error: string | null;
    operationId: string | null;
    runsCache: Record<string, AutomationRunsEntry>;
    initialize: (params: {
        workspacePath: string;
        workspaceIdentity?: string;
        agentService: IZCodeAgentService;
    }) => Promise<void>;
    refresh: (agentService: IZCodeAgentService) => Promise<void>;
    createAutomation: (input: CreateAutomationInput, agentService: IZCodeAgentService) => Promise<ZCodeAutomation | null>;
    updateAutomation: (automationId: string, input: UpdateAutomationInput, agentService: IZCodeAgentService) => Promise<boolean>;
    deleteAutomation: (automationId: string, agentService: IZCodeAgentService) => Promise<void>;
    setEnabled: (automationId: string, enabled: boolean, agentService: IZCodeAgentService) => Promise<void>;
    restartAutomation: (automationId: string, agentService: IZCodeAgentService) => Promise<void>;
    /** 立即运行一次；queued / duplicate / failed 均由调用方 toast。 */
    runAutomationNow: (automationId: string, agentService: IZCodeAgentService) => Promise<AutomationRunNowResult>;
    loadRuns: (automationId: string, agentService: IZCodeAgentService, force?: boolean) => Promise<void>;
    deleteRun: (automationId: string, runId: string, agentService: IZCodeAgentService) => Promise<void>;
}
export declare const useAutomationManagementStore: import("zustand").UseBoundStore<import("zustand").StoreApi<AutomationManagementState>>;
//# sourceMappingURL=automationManagementStore.d.ts.map