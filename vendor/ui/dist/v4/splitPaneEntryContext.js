import { jsx as _jsx } from "react/jsx-runtime";
// 侧栏会话项「在分屏打开 / 拖拽分屏」入口的可用性开关。
// session workbench groups 支持桌面和普通 web app；手机与 /remote web-remote
// 不启用。用 context 而不是逐层 props：会话项上下文菜单和 drag source 被多个
// 侧栏 Section 共用，判定源收敛在 WorkspaceShellLayout 一处。
import { createContext, useContext, useMemo, useRef } from "react";
const DEFAULT_SPLIT_PANE_ENTRY_CONTEXT = {
    enabled: false,
    canOpenSession: () => false,
    openSession: () => { },
};
const V4SplitPaneEntryContext = createContext(DEFAULT_SPLIT_PANE_ENTRY_CONTEXT);
export function V4SplitPaneEntryProvider({ enabled, canOpenSession, onOpenSession, children, }) {
    const controllerRef = useRef({ canOpenSession, onOpenSession });
    controllerRef.current = { canOpenSession, onOpenSession };
    const value = useMemo(() => ({
        enabled,
        canOpenSession: (target) => enabled && controllerRef.current.canOpenSession(target),
        openSession: (target) => {
            if (enabled)
                controllerRef.current.onOpenSession(target);
        },
    }), [enabled]);
    return (_jsx(V4SplitPaneEntryContext.Provider, { value: value, children: children }));
}
/** 右键入口由 shell 统一裁决，避免 task row 绕过 active group/draft pane owner。 */
export function useV4SplitPaneEntry() {
    return useContext(V4SplitPaneEntryContext);
}
//# sourceMappingURL=splitPaneEntryContext.js.map