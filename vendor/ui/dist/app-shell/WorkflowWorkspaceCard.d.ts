import type { WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import { type WorkspaceCardModel } from "@/app-shell/workflowWorkspaceTranscript.js";
interface WorkflowWorkspaceCardProps {
    card: WorkspaceCardModel;
    sessionId: string;
    runId: string;
    run: WorkflowRunState | undefined;
    /** 时间标尺的零点（第一张卡的准入时刻）；缺席即不画时刻。 */
    origin: number | undefined;
    /** 当前时刻（运行中的卡每秒推进）。 */
    now: number;
    /** 到场错位（每张 24 ms，封顶在面板侧）；缺席即立刻。 */
    enterDelayMs?: number;
    /** 落点那张卡：到位后底色亮一下。 */
    landed?: boolean;
    /** 工作区根：Read 卡的相对路径据此补成绝对路径再交给代码查看器。 */
    workspacePath: string;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}
export declare const WorkflowWorkspaceCard: import("react").MemoExoticComponent<({ card, enterDelayMs, landed, now, onOpenCodeViewer, origin, run, runId, sessionId, workspacePath, }: WorkflowWorkspaceCardProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=WorkflowWorkspaceCard.d.ts.map