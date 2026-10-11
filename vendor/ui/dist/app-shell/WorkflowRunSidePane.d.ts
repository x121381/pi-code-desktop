import type { OpenScopedWorkflowActorSessionSideTabRequest, OpenScopedWorkflowArtifactSideTabRequest, OpenScopedWorkflowRunSideTabRequest, OpenScopedWorkflowWorkspaceSideTabRequest, WorkflowRunSidePaneTab } from "@/lib/workspaceSidePane.js";
/**
 * workflow run 的详情页。
 *
 * 详情页承担用量、控制与交付物；图本身回到了聊天区的工具卡上，这里画的是同一个时间线模型的
 * 纵向清单。它**不复刻**卡片的有界 display——图之外的一切都读 `workflowRuns` 的权威投影，
 * 产物清单则直接读 journal。
 *
 * 面板只呈现**用户**要看的东西。`report` 条目、事件日志与脚本原文
 * 三节已经撤走——它们是技术细节，读者是模型与 CLI，不是坐在这块面板前的人。
 * journal 的读面一个没动（事件查询、report 行仍在），撤掉的只是它们在这里的显示。
 */
export declare const WorkflowRunSidePane: import("react").MemoExoticComponent<({ tab, onOpenWorkflowActorSession, onOpenWorkflowArtifact, onOpenWorkflowRun, onOpenWorkflowWorkspace, }: {
    tab: WorkflowRunSidePaneTab;
    /** 子代理行 → actor transcript tab。缺省即行不可点。 */
    onOpenWorkflowActorSession?: (request: OpenScopedWorkflowActorSessionSideTabRequest) => void;
    /** 产物卡片 → 全尺寸查看 tab。缺省即卡片不可点。 */
    onOpenWorkflowArtifact?: (request: OpenScopedWorkflowArtifactSideTabRequest) => void;
    /** 「已被 run X 替代」→ 后继 run 的详情 tab。缺省即那一行是静态文字。 */
    onOpenWorkflowRun?: (request: OpenScopedWorkflowRunSideTabRequest) => void;
    /** 脚本行 → 脚本 transcript tab，落到那一站。缺省即行不可点。 */
    onOpenWorkflowWorkspace?: (request: OpenScopedWorkflowWorkspaceSideTabRequest) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=WorkflowRunSidePane.d.ts.map