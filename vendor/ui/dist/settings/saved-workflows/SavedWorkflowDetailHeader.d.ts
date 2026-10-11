import { type ZCodeSavedWorkflowEntry } from "@zcode/shared";
interface SavedWorkflowDetailHeaderProps {
    name: string;
    description: string;
    entry: ZCodeSavedWorkflowEntry | undefined;
    busy: boolean;
    onRun: () => void;
    onRevise: () => void;
    onCopyPath: () => void;
    /** 作用域动作：项目档「提升为全局」（AI 概括）/ 全局档「移到项目…」；仅在传入时出现。 */
    onMove?: () => void;
    onDelete: () => void;
}
/**
 * 详情页头行：标题 + 说明 + 右上「运行」与 ⋯ 菜单。从详情页拆出以守住 max-lines（≤400）。
 */
export declare function SavedWorkflowDetailHeader({ name, description, entry, busy, onRun, onRevise, onCopyPath, onMove, onDelete, }: SavedWorkflowDetailHeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowDetailHeader.d.ts.map