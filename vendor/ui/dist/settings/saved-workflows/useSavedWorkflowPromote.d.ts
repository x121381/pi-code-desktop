import type { WorkspaceConnectionAgentService } from "@/v4/workspaceConnectionRegistry.js";
import { type SavedWorkflowLaunchTarget } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
/** 被提升的项目档：名字与路径进提示词（模型自己读文件），locale 选中英文案。 */
interface SavedWorkflowPromoteRequest {
    name: string;
    path: string;
    locale: string;
}
type SavedWorkflowPromoteResult = {
    ok: true;
    sessionId: string;
} | {
    ok: false;
    /** 原始 fault code / ACK 状态；日志与 toast 兜底文案用。 */
    code: string;
    /** 服务端人可读原因（有则优先展示）。 */
    message?: string;
};
interface UseSavedWorkflowPromoteResult {
    promote: (target: SavedWorkflowLaunchTarget, request: SavedWorkflowPromoteRequest) => Promise<SavedWorkflowPromoteResult>;
    /** 正在发起：卡片 / 详情菜单禁用，防重复点击。 */
    pending: boolean;
}
/**
 * 载体 `agentService` = 该项目解析出的 agent service（项目组已经有它）；`onNavigate` 在 accepted
 * 后切到新会话（与直接启动共用 `onNavigateToLaunchedRun`）。运行时缺省模型 / 模式，不复用 composer
 * 草稿配置——与直接启动同一取舍。
 */
export declare function useSavedWorkflowPromote(params: {
    agentService: WorkspaceConnectionAgentService;
    onNavigate?: (target: SavedWorkflowLaunchTarget, sessionId: string) => void;
}): UseSavedWorkflowPromoteResult;
export {};
//# sourceMappingURL=useSavedWorkflowPromote.d.ts.map