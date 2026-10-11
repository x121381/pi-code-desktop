import { type ReactNode } from "react";
import { type ZCodeWorkflowsForRunCandidate } from "@zcode/shared";
export interface WorkflowRunSaveSlotsHost {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    runId: string;
    /** run 名：弹层用它预填说明，交给 ZCode 的那条消息用它指认「刚跑完的哪一个」。 */
    runName?: string;
    /** 转写里 SaveWorkflow 认领过这次 run 的候选（`buildWorkflowSaveCandidatesByRunId`）。 */
    candidates?: readonly ZCodeWorkflowsForRunCandidate[];
    /**
     * 两道门（只读、灰度）都开着：缺省 false。关着时整个 trailing 缺席——写文件与起引擎都
     * 属于「Resume 被收走的地方一并收走」。芯片是事实，不受这道门影响。
     */
    canSave?: boolean;
    /** 把那条用户消息发出去；缺席即弹层只剩「直接保存」那一半。 */
    sendLead?: (text: string) => Promise<void>;
    /**
     * 动词的词何时退成只剩图标：`card`（缺省）= 完成卡窄于 480px 时（卡上的容器查询）；
     * `never` = 永远带词（run 侧板的状态头：那里的按钮本来就都带词，且没有 wf-card 容器）。
     */
    verbWord?: "card" | "never";
}
export interface WorkflowRunSaveSlots {
    leading: ReactNode;
    trailing: ReactNode;
}
export declare function useWorkflowRunSaveSlots(host: WorkflowRunSaveSlotsHost): WorkflowRunSaveSlots;
/**
 * 只在有服务上下文时挂载控制器（spec「Gates」：没有会话上下文的卡——静态渲染、回放、分享只读
 * 时间线——就是它原来那张卡，一个控件都没有）。控制器要查 agent，而这些宿主根本没有 agent 可查；
 * 用一层边界而不是在 hook 里判空，是因为 hook 不能按条件调用。
 */
export declare function WorkflowRunSaveSlotsBoundary({ children, host, }: {
    children: (slots: WorkflowRunSaveSlots | null) => ReactNode;
    host: WorkflowRunSaveSlotsHost;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunSaveControls.d.ts.map