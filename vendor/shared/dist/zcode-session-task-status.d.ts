import type { ZCodeSessionStateSnapshot } from "./zcode-protocol/index.js";
import type { ZCodeTaskMeta } from "./zcode-task-types-core.js";
type ZCodeTaskStatus = ZCodeTaskMeta["status"];
export declare function deriveZCodeTaskStatusFromSessionSnapshot(snapshot: ZCodeSessionStateSnapshot): ZCodeTaskStatus;
export {};
//# sourceMappingURL=zcode-session-task-status.d.ts.map