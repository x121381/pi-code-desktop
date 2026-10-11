import { create } from "zustand";
let requestSeq = 0;
export const useModelTrajectoryStore = create((set) => ({
    pendingRequest: null,
    requestOpen: (request) => {
        requestSeq += 1;
        set({
            pendingRequest: { ...request, requestId: `model-trajectory-open:${requestSeq}` },
        });
    },
    consumeRequest: (requestId) => {
        set((state) => state.pendingRequest?.requestId === requestId ? { pendingRequest: null } : state);
    },
}));
// E2E 需要在双 workspace 壳中直接验证 request bridge → 目标 workspace side pane 的完整链路。
// Header 菜单只绑定当前 header 的 activeTaskId，不能作为分屏壳（split pane）的稳定测试入口；
// 与 __zcodeSessionStoreE2E 保持同一模式，暴露 store 本身而不是另造测试专用业务实现。
if (typeof window !== "undefined") {
    window.__zcodeModelTrajectoryStoreE2E = useModelTrajectoryStore;
}
//# sourceMappingURL=modelTrajectoryStore.js.map