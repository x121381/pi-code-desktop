import { jsx as _jsx } from "react/jsx-runtime";
// 完成卡上那两个**壳级**落点（docs/dynamic-workflow/transcript-and-notifications.md
// 「Saving the run, and running it again」）：
//
//   openWorkflow  ── 「已保存」芯片 → 工作流中枢里那一页；
//   navigateToRun ── 「再次运行」启动成功 → 切到新建的那个会话。
//
// 与 WorkflowRunOpenProvider 同一条理由用 context 而不是逐层 props：这两件事只有壳知道怎么做，
// 而卡片长在会话时间线与 run 侧板两处，中间隔着 pane / 行上下文好几层，没有一层需要知道
// 「中枢在哪」。没有 provider（手机远控壳、单测、静态回放）时芯片只是文字、启动不切页——
// 手机远控壳本来就不提供中枢。
import { createContext, useContext, useMemo, useRef } from "react";
const SavedWorkflowHubContext = createContext(null);
export function SavedWorkflowHubProvider({ children, navigateToRun, openWorkflow, }) {
    const ref = useRef({ openWorkflow, navigateToRun });
    ref.current = { openWorkflow, navigateToRun };
    // 引用恒定：芯片挂在虚拟列表里的卡上，回调换引用就等于整列重渲染。
    const stable = useMemo(() => ({
        openWorkflow: (target) => ref.current.openWorkflow(target),
        navigateToRun: (target, sessionId) => ref.current.navigateToRun(target, sessionId),
    }), []);
    return (_jsx(SavedWorkflowHubContext.Provider, { value: stable, children: children }));
}
export function useSavedWorkflowHub() {
    return useContext(SavedWorkflowHubContext);
}
//# sourceMappingURL=savedWorkflowHubContext.js.map