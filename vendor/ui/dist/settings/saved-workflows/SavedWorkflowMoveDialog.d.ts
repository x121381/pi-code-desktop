import { type AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
interface SavedWorkflowMoveDialogProps {
    open: boolean;
    /** 被移动的工作流名（用作对话描述）；null 时不渲染标题上下文。 */
    entryName: string | null;
    /** 目标项目候选（「移到项目…」的落点，同「运行于」候选）。 */
    targets: readonly AutomationWorkspaceOption[];
    defaultTargetKey?: string | null;
    busy?: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (target: AutomationWorkspaceOption) => void;
}
/**
 * 「移到项目」窗：全局工作流搬回某个本地项目。
 * 一个项目选择器 + 提交；没有本地项目时禁用提交并提示。结构 / 样式沿用实参窗。
 */
export declare function SavedWorkflowMoveDialog({ open, entryName, targets, defaultTargetKey, busy, onOpenChange, onSubmit, }: SavedWorkflowMoveDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowMoveDialog.d.ts.map