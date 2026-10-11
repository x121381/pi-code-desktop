import { type ServiceLogger } from "#src/logger/serviceLogger.js";
import type { IHooksService } from "./hooks.js";
export declare function createHooksService(options?: {
    logger?: ServiceLogger;
    grantWorkspaceHookTrust?: NonNullable<IHooksService["grantWorkspaceHookTrust"]>;
}): IHooksService;
//# sourceMappingURL=hooksService.d.ts.map