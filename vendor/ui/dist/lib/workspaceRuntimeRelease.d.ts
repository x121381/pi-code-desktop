import type { IZCodeTaskService } from "@zcode/services";
import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function releaseWorkspaceRuntimeAfterProjectRemoval({ tab, zcodeTaskService, }: {
    tab: Pick<WorkspaceTabState, "workspacePath" | "workspaceIdentity">;
    zcodeTaskService: Pick<IZCodeTaskService, "releaseWorkspacePreparation">;
}): void;
//# sourceMappingURL=workspaceRuntimeRelease.d.ts.map