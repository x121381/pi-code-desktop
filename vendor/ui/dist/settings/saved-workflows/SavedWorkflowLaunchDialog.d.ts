import { type ZCodeSavedWorkflowEntry } from "@zcode/shared";
import { type AutomationWorkspaceOption } from "@/settings/automationWorkspaceOptions.js";
import type { SavedWorkflowLaunchError } from "@/settings/saved-workflows/useSavedWorkflowLauncher.js";
interface SavedWorkflowLaunchDialogProps {
    entry: ZCodeSavedWorkflowEntry | null;
    /** 作用域徽标与「将立即在 X 的新会话中运行」文案都要它；也决定启动命令的 scope。 */
    scope: "project" | "global";
    /**
     * 「将立即在 {project} 的新会话中运行」里的项目名：项目档 = 所属项目名；全局档 = 未选到
     * 「运行于」时的兜底名（选到后用选中项目 label）。
     */
    projectLabel: string;
    onOpenChange: (open: boolean) => void;
    onSubmit: (entry: ZCodeSavedWorkflowEntry, args: Record<string, unknown>, target?: AutomationWorkspaceOption) => void;
    /**
     * 「运行于」项目候选（仅全局工作流传入）。传入即渲染选择器；
     * 空数组表示没有本地项目可跑——渲染提示并禁用提交。undefined 时窗口与项目档逐字一致。
     */
    targets?: readonly AutomationWorkspaceOption[];
    /** 默认选中的项目 key（活动项目）；不在候选里时回落到首个候选。 */
    defaultTargetKey?: string | null;
    /**
     * 预填实参：完成卡的「再次运行」传这次 run 跑过的那一份（journal 给的）。声明里没有的键忽略；
     * 缺席即按声明的默认值铺（中枢自己的「运行」就是这条）。
     */
    initialArgs?: Record<string, unknown>;
    /** 正在启动：主按钮 loading + 禁用，防重复点击（launcher.pending）。 */
    pending?: boolean;
    /** 启动失败：行内错误区展示（title 按 reason + 服务端 message）；成功由组关窗清空。 */
    error?: SavedWorkflowLaunchError | null;
}
/**
 * 实参窗：头部 = Workflow 图标 + 名字（mono）
 * + 作用域徽标 + 说明；「运行于」（全局档）；实参表；一句「将立即在 X 的新会话中运行」；主按钮
 * 「运行」。点「运行」= GUI 直接启动（无模型回合、无确认窗）：loading 期禁用，失败在行内错误区
 * 显示、窗口留着，成功由组关窗并切到新会话。无实参的项目档不弹本窗（组直接启动）。
 */
export declare function SavedWorkflowLaunchDialog({ entry, scope, projectLabel, onOpenChange, onSubmit, targets, defaultTargetKey, initialArgs, pending, error, }: SavedWorkflowLaunchDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowLaunchDialog.d.ts.map