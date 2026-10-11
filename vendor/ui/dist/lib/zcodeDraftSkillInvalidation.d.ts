import type { IZCodeSessionService } from "@zcode/services";
interface DeferredDraftRuntimeChangeParams {
    logScope: string;
    reason: string;
    workspacePath?: string | null;
    workspaceIdentity?: string | null;
    zcodeSessionService: Pick<IZCodeSessionService, "closeSession">;
}
export declare function invalidateDeferredDraftSessionForRuntimeChange(params: DeferredDraftRuntimeChangeParams): Promise<void>;
export declare function invalidateDeferredDraftSessionForSkillChange(params: Omit<DeferredDraftRuntimeChangeParams, "logScope">): Promise<void>;
export {};
//# sourceMappingURL=zcodeDraftSkillInvalidation.d.ts.map