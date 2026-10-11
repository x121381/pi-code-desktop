/* oxlint-disable eslint(max-lines) -- ZCode Agent store 类型和默认状态集中导出，避免切片间重复定义共享结构。 */
/**
 * ZCode Session Store 类型定义、接口、常量与默认值工厂
 *
 * 从 zcodeSessionStore.ts 拆分出来，供 store 本体和 selectors / navigation 等子模块共享。
 */
import { buildNativeSupplierKey, ZCODE_AGENT_PROVIDER, } from "@zcode/shared";
// ────────────────────────────────────────────
// Constants
// ────────────────────────────────────────────
export const DEFAULT_WORKSPACE_INIT_STATE = {
    status: "idle",
    error: null,
    attempts: 0,
};
export const FALLBACK_PROVIDER = ZCODE_AGENT_PROVIDER;
export const DEFAULT_TASK_UI_STATE = {
    permissionRequest: null,
    pendingPermissionRequests: [],
    elicitationRequest: null,
    pendingElicitationRequests: [],
    elicitationFormDraftsByRequestId: {},
    error: null,
};
export const DEFAULT_TASK_RUNTIME_STATE = {
    status: "notReady",
    error: null,
    provider: undefined,
    contextWindow: null,
    usage: null,
    apiRetry: null,
    backgroundTaskControls: [],
    activeTurnKind: undefined,
    activeInputId: undefined,
    activeInputOwnerClientId: undefined,
};
// ────────────────────────────────────────────
// Factory functions
// ────────────────────────────────────────────
export function createDefaultWorkspaceState(selectedProvider) {
    return {
        activeTaskId: null,
        workspaceInit: { ...DEFAULT_WORKSPACE_INIT_STATE },
        draftRuntime: { status: "idle", error: null },
        draftSessionId: null,
        draftRuntimeInvalidationVersion: 0,
        composerTextInsertVersion: 0,
        composerTextInsertRequest: null,
        timelineBottomRequestVersion: 0,
        timelineBottomRequest: null,
        draftError: null,
        modelSwitchRequestId: null,
        modelSwitchPending: false,
        modelSwitchStage: "idle",
        taskRuntimeByTaskId: {},
        taskUiByTaskId: {},
        taskConfigOptionsByTaskId: {},
        taskConfigOptionsStatusByTaskId: {},
        taskUnreadByTaskId: {},
        optimisticTaskListByTaskId: {},
        groupedDraftTask: null,
        draftCreateSource: "session",
        promotedGroupedDraftTaskByTaskId: {},
        selectedProvider,
        selectedSupplierKey: buildNativeSupplierKey(selectedProvider),
        isGhostSupplier: false,
        supplierMismatchReason: null,
        configOptions: null,
        configOptionsStatus: "idle",
        slashCommands: [],
        taskListVersion: 0,
        taskListCache: null,
        draftFocusVersion: 0,
    };
}
const DEFAULT_WORKSPACE_STATE = createDefaultWorkspaceState(FALLBACK_PROVIDER);
export function getDefaultWorkspaceState() {
    // 单 ZCode Agent 迁移后默认 provider 必须收敛到 glm。
    // 这里返回稳定引用，避免未写入 workspace bucket 的连续 selector 读取产生不同快照。
    return DEFAULT_WORKSPACE_STATE;
}
//# sourceMappingURL=zcodeSessionStoreTypes.js.map