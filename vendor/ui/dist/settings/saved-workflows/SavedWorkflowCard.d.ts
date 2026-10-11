import { type ZCodeSavedWorkflowEntry, type ZCodeSavedWorkflowRun } from "@zcode/shared";
/** 卡片「上次运行」徽标：四态 + 尚未运行。沿用定时任务卡的徽标形状（rounded-lg，20px 图标槽）。 */
export declare function SavedWorkflowLastRunBadge({ run, now, }: {
    run: ZCodeSavedWorkflowRun | undefined;
    now: number;
}): import("react/jsx-runtime").JSX.Element;
interface SavedWorkflowCardProps {
    entry: ZCodeSavedWorkflowEntry;
    lastRun: ZCodeSavedWorkflowRun | undefined;
    now: number;
    busy?: boolean;
    onOpen: (entry: ZCodeSavedWorkflowEntry) => void;
    onRun: (entry: ZCodeSavedWorkflowEntry) => void;
    onRevise: (entry: ZCodeSavedWorkflowEntry) => void;
    onCopyPath: (entry: ZCodeSavedWorkflowEntry) => void;
    /** 作用域动作：项目档「提升为全局」（AI 概括）/ 全局档「移到项目…」；仅在传入时出现。 */
    onMove?: (entry: ZCodeSavedWorkflowEntry) => void;
    onDelete: (entry: ZCodeSavedWorkflowEntry) => void;
}
/**
 * 与定时任务卡同一张网格（132px 行、rounded-xl、p-3）：标题行 = 名字 + 右上「运行」与 ⋯；
 * 两行说明；底栏左 = 上次运行徽标、右 = 实参名芯片（最多 3 个 + `+N`）。整卡可点进详情。
 */
export declare const SavedWorkflowCard: import("react").MemoExoticComponent<({ entry, lastRun, now, busy, onOpen, onRun, onRevise, onCopyPath, onMove, onDelete, }: SavedWorkflowCardProps) => import("react/jsx-runtime").JSX.Element>;
export {};
//# sourceMappingURL=SavedWorkflowCard.d.ts.map