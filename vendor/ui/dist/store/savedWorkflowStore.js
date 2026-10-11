// 已保存工作流中枢的读缓存。
// 按 workspaceKey 分片；磁盘仍是唯一权威（不变式 2）——缓存只服务同一页内的重渲染，
// 变更后一律 `bypass` 刷新（skillStore 的同一条教训：复用 in-flight Promise 会拿到旧扫描）。
import { create } from "zustand";
import { resolveWorkspaceKey, } from "@zcode/shared";
import { logger } from "../logger.js";
import { useWorkflowRunSavedStore } from "../store/workflowRunSavedStore.js";
/** 一页里最多拉多少条 run 来算「上次运行」；一个项目的活跃工作流很少超过这个数。 */
const SAVED_WORKFLOW_RUNS_PAGE = 50;
const EMPTY_SAVED_WORKFLOW_STATE = {
    entries: [],
    invalid: [],
    runs: [],
    dir: null,
    loading: false,
    loaded: false,
    error: null,
    errorCode: null,
};
const inFlight = new Map();
/**
 * 读缓存的分片键：全局档（`scope:"global"` 且不带 workspace）
 * 用固定键 `"global"`——它跨项目、由 services 自选载体，不该与任何项目的 workspaceKey 混淆；
 * 项目档仍按 `resolveWorkspaceKey` 分片。
 */
function savedWorkflowStoreKey(target) {
    if (target.scope === "global" && !target.workspacePath)
        return "global";
    return resolveWorkspaceKey({
        workspacePath: target.workspacePath ?? "",
        ...(target.workspaceIdentity ? { workspaceIdentity: target.workspaceIdentity } : {}),
    });
}
/** 从抛出的错误里取 JSON-RPC code（ChannelClient 保留 error.code）；取不到回 null。 */
function extractErrorCode(error) {
    const code = error?.code;
    return typeof code === "number" ? code : null;
}
async function fetchWorkspace(target, agentService) {
    // 列表与运行历史并行；运行历史失败不拖垮列表（journal 缺席时中枢照常能看、能管）。
    const [list, runs] = await Promise.all([
        agentService.listSavedWorkflows(target),
        agentService
            .listSavedWorkflowRuns({ ...target, limit: SAVED_WORKFLOW_RUNS_PAGE })
            .then((result) => result.runs)
            .catch((error) => {
            logger.warn("[savedWorkflowStore] 拉取运行历史失败，按无记录处理", {
                error: error instanceof Error ? error.message : String(error),
            });
            return [];
        }),
    ]);
    return { list, runs };
}
export const useSavedWorkflowStore = create((set) => ({
    byWorkspaceKey: {},
    async load(target, agentService, options = {}) {
        const key = savedWorkflowStoreKey(target);
        if (!options.bypassCache) {
            const current = inFlight.get(key);
            if (current)
                return current;
        }
        set((state) => ({
            byWorkspaceKey: {
                ...state.byWorkspaceKey,
                [key]: { ...(state.byWorkspaceKey[key] ?? EMPTY_SAVED_WORKFLOW_STATE), loading: true },
            },
        }));
        const request = fetchWorkspace(target, agentService)
            .then(({ list, runs }) => {
            // 中枢刚看过磁盘：把完成卡那张「这次 run 存成了哪个工作流」的读缓存一并作废
            // （docs/dynamic-workflow/transcript-and-notifications.md「Which workflow a run is saved as」）。
            // 中枢里的删除 / 移动 / 改元数据都以一次刷新收尾，这一行让那些动作也走到对话里的卡片上。
            useWorkflowRunSavedStore.getState().invalidate();
            set((state) => ({
                byWorkspaceKey: {
                    ...state.byWorkspaceKey,
                    [key]: {
                        entries: list.workflows,
                        invalid: list.invalid,
                        runs,
                        dir: list.dir,
                        loading: false,
                        loaded: true,
                        error: null,
                        errorCode: null,
                    },
                },
            }));
        })
            .catch((error) => {
            const message = error instanceof Error ? error.message : String(error);
            logger.warn("[savedWorkflowStore] 拉取已保存工作流失败", { error: message });
            set((state) => ({
                byWorkspaceKey: {
                    ...state.byWorkspaceKey,
                    [key]: {
                        ...(state.byWorkspaceKey[key] ?? EMPTY_SAVED_WORKFLOW_STATE),
                        loading: false,
                        loaded: true,
                        error: message,
                        errorCode: extractErrorCode(error),
                    },
                },
            }));
        })
            .finally(() => {
            if (inFlight.get(key) === request)
                inFlight.delete(key);
        });
        inFlight.set(key, request);
        return request;
    },
}));
export function selectSavedWorkflowState(state, target) {
    if (!target)
        return EMPTY_SAVED_WORKFLOW_STATE;
    return state.byWorkspaceKey[savedWorkflowStoreKey(target)] ?? EMPTY_SAVED_WORKFLOW_STATE;
}
/** 测试用：清掉 in-flight 去重表。 */
export function resetSavedWorkflowStoreForTests() {
    inFlight.clear();
    useSavedWorkflowStore.setState({ byWorkspaceKey: {} });
}
//# sourceMappingURL=savedWorkflowStore.js.map