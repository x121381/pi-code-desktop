import type { SavedWorkflowArgRow, SavedWorkflowArgRowError } from "@/settings/saved-workflows/savedWorkflowArgsForm.js";
/** 详情页「参数」声明表：可增删行，默认值按类型出控件。 */
export declare function SavedWorkflowArgsTable({ rows, errors, onChange, onAdd, onRemove, }: {
    rows: readonly SavedWorkflowArgRow[];
    errors: Record<string, SavedWorkflowArgRowError>;
    onChange: (key: string, patch: Partial<SavedWorkflowArgRow>) => void;
    onAdd: () => void;
    onRemove: (key: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SavedWorkflowArgsTable.d.ts.map