import type { IZCodeAgentService } from "#src/zcode-agent/zcodeAgent.js";
import type { ZCodeTaskIndexSyncer } from "#src/zcode-agent/zcodeTaskIndexSyncer.js";
import type { IZCodeSessionService } from "#src/zcode-session/zcodeSession.js";
import type { CuaProductMcpServerResolver } from "#src/cua-permission-broker/index.js";
interface CreateZCodeSessionServiceOptions {
    agentService: IZCodeAgentService;
    /**
     * 后台 task index sqlite 同步器。注入后，每次 session 被创建/恢复/发送 prompt 或
     * 订阅事件时都会通知 syncer 维护 shadow 订阅，保证 desktop-continuous 路径下
     * sqlite 仍能跟随 runtime 状态收敛；同时每次会变更 session 状态的操作完成后会
     * 主动把最新 snapshot 同步到 sqlite 并广播 workspace_task_list_changed，
     * 让侧边栏列表立刻看到 first_input title 和 updatedAt 排序刷新。
     */
    taskIndexSyncer?: ZCodeTaskIndexSyncer;
    cuaProductMcpServerResolver?: CuaProductMcpServerResolver;
}
export declare function createZCodeSessionService({ agentService, taskIndexSyncer, cuaProductMcpServerResolver, }: CreateZCodeSessionServiceOptions): IZCodeSessionService;
export {};
//# sourceMappingURL=zcodeSessionService.d.ts.map