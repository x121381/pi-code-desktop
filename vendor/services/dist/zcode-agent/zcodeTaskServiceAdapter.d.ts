import type { IZCodeTaskService } from "../session/zcodeTaskService.js";
import type { ISettingService } from "#src/setting/setting.js";
import { TaskIndexRepo } from "#src/session/taskIndexRepo.js";
import type { IZCodeAgentService } from "./zcodeAgent.js";
import type { ZCodeTaskIndexSyncer } from "./zcodeTaskIndexSyncer.js";
import type { CuaProductMcpServerResolver } from "#src/cua-permission-broker/index.js";
interface CreateZCodeTaskServiceAdapterOptions {
    zcodeAgentService: IZCodeAgentService;
    taskIndexRepo?: TaskIndexRepo;
    taskIndexSyncer: ZCodeTaskIndexSyncer;
    settingService?: Pick<ISettingService, "get">;
    cuaProductMcpServerResolver?: CuaProductMcpServerResolver;
}
export declare function createZCodeTaskServiceAdapter(options: CreateZCodeTaskServiceAdapterOptions): IZCodeTaskService;
export {};
//# sourceMappingURL=zcodeTaskServiceAdapter.d.ts.map