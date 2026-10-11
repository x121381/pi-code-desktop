import { type IZCodeTaskService as IZCodeTaskServiceShape } from "#src/session/zcodeTaskService.js";
import { type IZCodeAgentService as IZCodeAgentServiceShape } from "#src/zcode-agent/zcodeAgent.js";
import { type IZCodeSessionService as IZCodeSessionServiceShape } from "#src/zcode-session/zcodeSession.js";
import { type IModelSelectionService as IModelSelectionServiceShape } from "#src/model-provider/providerFacadeServices.js";
export interface RemoteBotWorkspaceRuntimeServices {
    zcodeAgentService: IZCodeAgentServiceShape;
    zcodeTaskService: IZCodeTaskServiceShape;
    zcodeSessionService: IZCodeSessionServiceShape;
    modelSelectionService: IModelSelectionServiceShape;
}
export declare function createRemoteRuntimeServicesFromPort(port: unknown): RemoteBotWorkspaceRuntimeServices;
//# sourceMappingURL=botRemoteRuntimeServices.d.ts.map