import type { ZCodeSessionStateSnapshot } from "@zcode/shared";
import type { IZCodeAgentService } from "#src/zcode-agent/zcodeAgent.js";
import type { ZCodeSessionReadParams, ZCodeSessionResumeParams } from "#src/zcode-session/zcodeSession.js";
export declare function repairEmptyImportedClaudeSessionSnapshot(params: {
    agentService: IZCodeAgentService;
    snapshot: ZCodeSessionStateSnapshot;
    target: ZCodeSessionResumeParams | ZCodeSessionReadParams;
}): Promise<ZCodeSessionStateSnapshot>;
//# sourceMappingURL=importedClaudeSessionRepair.d.ts.map