import { shouldExposeE2EStoreBridge } from "./lib/e2eStoreBridge.js";
import { useEffect } from "react";
/**
 * 将 test actions 注册到 window.__testActions。
 * 仅在 import.meta.env.PROD 为 true 时跳过注册（Vite 环境）。
 */
export function useTestActions(actions) {
    useEffect(() => {
        // E2E 的 production renderer 也需要服务入口；只能由专用 bridge 开关打开，避免普通生产包泄露。
        if (import.meta.env.PROD && !shouldExposeE2EStoreBridge())
            return;
        window.__testActions = actions;
        return () => {
            actions.releaseTaskMembershipRefreshHold();
            delete window.__testActions;
        };
    }, [actions]);
}
//# sourceMappingURL=test-actions.js.map