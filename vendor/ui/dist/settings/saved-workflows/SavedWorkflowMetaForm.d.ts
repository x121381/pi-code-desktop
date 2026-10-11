import type { SavedWorkflowArgRow, SavedWorkflowArgRowError } from "@/settings/saved-workflows/savedWorkflowArgsForm.js";
export interface SavedWorkflowMetaDraft {
    description: string;
    whenToUse: string;
    rows: SavedWorkflowArgRow[];
}
interface SavedWorkflowMetaFormProps {
    draft: SavedWorkflowMetaDraft;
    rowErrors: Record<string, SavedWorkflowArgRowError>;
    descriptionError: boolean;
    dirty: boolean;
    saving: boolean;
    onDescriptionChange: (value: string) => void;
    onWhenToUseChange: (value: string) => void;
    onRowChange: (key: string, patch: Partial<SavedWorkflowArgRow>) => void;
    onRowAdd: () => void;
    onRowRemove: (key: string) => void;
    onDiscard: () => void;
    onSave: () => void;
}
/**
 * 详情页「基本信息」表单：说明 / 何时使用 / 参数表
 * 行内可编，脏了才浮出「放弃 / 保存」。状态由 SavedWorkflowDetailView 持有，这里只渲染。
 */
export declare function SavedWorkflowMetaForm({ draft, rowErrors, descriptionError, dirty, saving, onDescriptionChange, onWhenToUseChange, onRowChange, onRowAdd, onRowRemove, onDiscard, onSave, }: SavedWorkflowMetaFormProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SavedWorkflowMetaForm.d.ts.map