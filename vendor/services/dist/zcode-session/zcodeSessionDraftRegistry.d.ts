import type { ZCodeSessionStateSnapshot } from "@zcode/shared";
import type { ZCodeSessionWorkspaceTarget, ZCodeTaskTarget } from "#src/zcode-session/zcodeSession.js";
export declare function createZCodeDeferredDraftRegistry(): {
    remember(params: ZCodeSessionWorkspaceTarget, snapshot: ZCodeSessionStateSnapshot): void;
    has(target: ZCodeTaskTarget): boolean;
    forget(target: ZCodeTaskTarget): void;
};
//# sourceMappingURL=zcodeSessionDraftRegistry.d.ts.map