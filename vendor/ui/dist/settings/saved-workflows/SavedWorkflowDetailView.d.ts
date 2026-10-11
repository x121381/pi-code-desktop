import { type ReactNode } from "react";
import { type ZCodeSavedWorkflowEntry, type ZCodeSavedWorkflowRun } from "@zcode/shared";
import type { IZCodeAgentService, ZCodeAgentSavedWorkflowTarget } from "@zcode/services";
import { type SavedWorkflowRunProject } from "@/settings/saved-workflows/SavedWorkflowRunHistoryPanel.js";
interface SavedWorkflowDetailViewProps {
    /** 项目档传 workspace target；全局档传 `{ scope: "global" }`（get/updateMeta 直接透传）。 */
    target: ZCodeAgentSavedWorkflowTarget;
    agentService: IZCodeAgentService;
    name: string;
    /** 面包屑「自动化 › <项目名> › <工作流名>」里的项目一级。 */
    projectLabel: string;
    entry: ZCodeSavedWorkflowEntry | undefined;
    runs: readonly ZCodeSavedWorkflowRun[];
    now: number;
    busy: boolean;
    canOpenRun: boolean;
    onBack: () => void;
    onRun: () => void;
    onRevise: () => void;
    onCopyPath: () => void;
    /** 作用域动作：项目档「提升为全局」（AI 概括）/ 全局档「移到项目…」；仅在传入时出现。 */
    onMove?: () => void;
    onDelete: () => void;
    onOpenRun: (run: ZCodeSavedWorkflowRun) => void;
    /** 产物 chip → `workflow-artifact` tab；缺席即 chips 只读。 */
    onOpenArtifact?: (run: ZCodeSavedWorkflowRun, artifactId: string) => void;
    onMetaSaved: () => void;
    /** 传入即在运行历史每行渲染项目列（全局工作流跨项目历史）。 */
    resolveRunProject?: (run: ZCodeSavedWorkflowRun) => SavedWorkflowRunProject | null;
    /** 实参窗由列表层持有（同一份状态），详情页只负责挂到树上。 */
    launchDialog: ReactNode;
}
/**
 * 工作流详情页：与定时任务编辑页同构——
 * 面包屑、标题、右上动作、分段标签。「定义」= 元数据行内编辑 + 只读脚本；「运行历史」= journal 行。
 */
export declare function SavedWorkflowDetailView({ target, agentService, name, projectLabel, entry, runs, now, busy, canOpenRun, onBack, onRun, onRevise, onCopyPath, onMove, onDelete, onOpenRun, onOpenArtifact, onMetaSaved, resolveRunProject, launchDialog, }: SavedWorkflowDetailViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowDetailView.d.ts.map