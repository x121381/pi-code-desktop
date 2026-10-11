import type { IZCodeSessionService, IZCodeTaskService } from "@zcode/services";
import type { ZCodeConfigOption, ModelSelection, ZCodeSessionStateSnapshot, ZCodeTaskSnapshot } from "@zcode/shared";
import { type ZCodeUiError } from "@/lib/zcodeUiError.js";
export type ZCodeSessionRestoreService = Pick<IZCodeSessionService, "readSession" | "resumeSession">;
export type ZCodeLegacyTaskSnapshotRestoreService = Pick<IZCodeTaskService, "getTaskSnapshot">;
export interface DesktopContinuousSessionRestoreSnapshot {
    snapshot: ZCodeTaskSnapshot;
    restoreWarning?: ZCodeUiError;
    resumedSessionSnapshot?: ZCodeSessionStateSnapshot;
    usedLegacySnapshot?: boolean;
}
export declare function readDesktopContinuousSessionRestoreSnapshot(params: {
    zcodeSessionService: ZCodeSessionRestoreService;
    zcodeTaskService?: ZCodeLegacyTaskSnapshotRestoreService;
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    messageLimit?: number;
    model?: ModelSelection;
    thoughtLevel?: string;
}): Promise<DesktopContinuousSessionRestoreSnapshot>;
export declare function readWebRemoteReplayableSessionConfigOptions(params: {
    zcodeSessionService: ZCodeSessionRestoreService;
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    model?: ModelSelection;
    thoughtLevel?: string;
}): Promise<ZCodeConfigOption[] | null>;
//# sourceMappingURL=zcodeSessionRestore.d.ts.map