import { type ReactNode } from "react";
import type { ConversationRow, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { type WorkflowRunSaveSlots } from "@/components/workflow-timeline/WorkflowRunSaveControls.js";
import type { WorkflowRunSidePaneTab } from "@/lib/workspaceSidePane.js";
interface WorkflowRunPaneSaveParams {
    /** 父会话的行窗口：转写里认领过这次 run 的 SaveWorkflow 候选从这里读。 */
    rows: readonly ConversationRow[] | undefined;
    run: WorkflowRunState | undefined;
    tab: WorkflowRunSidePaneTab;
}
/** 侧板状态头的两个槽位：造宿主描述，再经服务边界挂控制器（没有服务上下文时交出 null）。 */
export declare function WorkflowRunPaneSaveSlots({ children, ...params }: WorkflowRunPaneSaveParams & {
    children: (slots: WorkflowRunSaveSlots | null) => ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkflowRunPaneSaveSlots.d.ts.map