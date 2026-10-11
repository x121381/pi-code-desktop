import { type PipSessionClient, type PipSessionClientOptions } from "@zcode/zcode-cua/pip-session/node";
import { type ServiceLogger } from "../logger/serviceLogger.js";
import type { CuaPipSessionService } from "./cuaPipSession.js";
export interface CuaPipPresentationCredentials {
    socketPath: string;
}
export declare function createCuaPipSessionService(options: {
    enabled: boolean;
    resolveCredentials: () => Promise<CuaPipPresentationCredentials | undefined>;
    createClient?: (options: PipSessionClientOptions) => PipSessionClient;
    logger?: ServiceLogger;
}): CuaPipSessionService;
//# sourceMappingURL=cuaPipSessionService.d.ts.map