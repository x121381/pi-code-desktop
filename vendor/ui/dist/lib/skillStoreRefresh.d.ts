import type { ISkillsService } from "@zcode/services";
import { type ZCodeProvider } from "@zcode/shared";
export declare function refreshSharedSkillStoreForWorkspace(params: {
    workspacePath: string | null | undefined;
    workspaceIdentity?: string | null;
    skillsService: ISkillsService;
    provider?: ZCodeProvider;
}): Promise<void>;
//# sourceMappingURL=skillStoreRefresh.d.ts.map