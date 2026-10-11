import { type ZCodeSessionStateSnapshot } from "@zcode/shared";
import type { ZCodeSessionServiceEvent, ZCodeTaskTarget } from "#src/zcode-session/zcodeSession.js";
export declare function createZCodeSessionApiRetryRuntimeTracker(): {
    trackApiRetryFromSessionEvent: (params: ZCodeTaskTarget, event: ZCodeSessionServiceEvent) => ZCodeSessionServiceEvent;
    withApiRetryRuntime: (snapshot: ZCodeSessionStateSnapshot) => ZCodeSessionStateSnapshot;
};
//# sourceMappingURL=zcodeSessionApiRetry.d.ts.map