import { jsx as _jsx } from "react/jsx-runtime";
// 侧栏运行行「点击 → 选中会话 + 打开 run pane」的入口。与 composer 徽标同一跳转，由 WorkspaceShellLayout 一处裁决；
// 用 context 而不是逐层 props：运行行长在五种任务行里（默认 / 时间线 / 置顶 / 归档 / 分组）。
// 没有 provider（手机远控首页、单测）时运行行只是文字，不是按钮。
import { createContext, useContext, useMemo, useRef } from "react";
const WorkflowRunOpenContext = createContext(null);
export function WorkflowRunOpenProvider({ onOpenRun, children, }) {
    const handlerRef = useRef(onOpenRun);
    handlerRef.current = onOpenRun;
    const stable = useMemo(() => (target) => handlerRef.current(target), []);
    return (_jsx(WorkflowRunOpenContext.Provider, { value: stable, children: children }));
}
export function useWorkflowRunOpen() {
    return useContext(WorkflowRunOpenContext);
}
//# sourceMappingURL=workflowRunOpenContext.js.map