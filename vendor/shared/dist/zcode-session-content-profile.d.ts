import type { ZCodeSessionStateSnapshot } from "./zcode-protocol/index.js";
export type ZCodeSessionContentProfile = "full" | "index";
/** 生成 task index 专用的轻量 snapshot；不修改入参（CLI 侧 messages 可能来自共享缓存）。 */
export declare function elideSessionSnapshotForIndex<T extends ZCodeSessionStateSnapshot>(snapshot: T): T;
//# sourceMappingURL=zcode-session-content-profile.d.ts.map