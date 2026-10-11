import { type SubagentRuntimeConfig } from "@zcode/shared";
import { type SubagentStorageOptions } from "./subagentStorage.js";
import type { ISubagentsService } from "./subagents.js";
interface SubagentsServiceOptions extends SubagentStorageOptions {
    isDesktopRuntime?: boolean;
}
export declare function createSubagentsService(options?: SubagentsServiceOptions): ISubagentsService & {
    /** Host 启动/重启 Agent 前准备配置，不暴露为 Renderer RPC。 */
    prepareRuntimeState(workspace?: {
        workspacePath: string;
        workspaceIdentity?: string;
    }): Promise<void>;
    readRuntimeConfig(workspace: {
        workspacePath: string;
        workspaceIdentity?: string;
    }): Promise<SubagentRuntimeConfig>;
    disposeAll(): void;
};
export {};
//# sourceMappingURL=subagentsService.d.ts.map