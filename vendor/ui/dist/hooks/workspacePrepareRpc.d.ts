/**
 * workspace prepare 的协议 RPC 收口。
 *
 * 拆出原因：useWorkspacePrepare.ts 只保留可单测的轻量判定入口；
 * 这里只读取 workspace presentation（mode/slash commands）；模型选择事实由目标 Host View 提供。
 */
import type { IZCodeSessionService } from "@zcode/services";
import { type ZCodeProvider, type ZCodeWorkspacePrepareResult } from "@zcode/shared";
export declare function prepareWorkspaceWithZCodeSessionService(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    provider: ZCodeProvider;
    zcodeSessionService: Pick<IZCodeSessionService, "readWorkspacePresentation">;
}): Promise<ZCodeWorkspacePrepareResult>;
//# sourceMappingURL=workspacePrepareRpc.d.ts.map