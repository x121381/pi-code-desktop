import { type ZCodeProvider, type SkillSummary, type SkillsCapability } from "@zcode/shared";
import type { ISkillsService } from "@zcode/services";
interface SkillStoreState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    loadedWorkspacePath: string | null;
    loadedWorkspaceIdentity: string | null;
    provider: ZCodeProvider;
    loadedProvider: ZCodeProvider | null;
    skills: SkillSummary[];
    capability: SkillsCapability | null;
    loading: boolean;
    error: string | null;
    initialize: (workspacePath: string, providerOrSkillsService: ZCodeProvider | ISkillsService, maybeSkillsService?: ISkillsService, workspaceIdentity?: string) => Promise<void>;
    refresh: (skillsService: ISkillsService, workspaceIdentity?: string) => Promise<void>;
    setEnabled: (skillId: string, providerOrEnabled: ZCodeProvider | boolean, scopeOrSkillsService: SkillSummary["scope"] | ISkillsService, enabledOrSkillsService?: boolean | ISkillsService, maybeSkillsService?: ISkillsService, workspaceIdentity?: string) => Promise<void>;
}
export declare const useSkillStore: import("zustand").UseBoundStore<import("zustand").StoreApi<SkillStoreState>>;
type SkillStoreE2EBridge = typeof useSkillStore;
declare global {
    interface Window {
        __skillStoreE2E?: SkillStoreE2EBridge;
    }
}
export {};
//# sourceMappingURL=skillStore.d.ts.map