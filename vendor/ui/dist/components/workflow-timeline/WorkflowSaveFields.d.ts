import type { RefObject } from "react";
import { type WorkflowSaveDraft } from "./workflowRunSave.js";
/** agent 拒绝了这一次保存：`reason` 是词表里的原因，`detail` 是它带回来的诊断（已有界）。 */
export interface WorkflowSaveFailure {
    reason: string;
    detail?: string;
}
export declare function WorkflowSaveFields({ draft, failure, nameInvalid, nameRef, onDirectSave, pathPreview, saving, scopeLocked, shadowing, showDivider, submitDisabled, submitLabel, taken, update, }: {
    draft: WorkflowSaveDraft;
    failure: WorkflowSaveFailure | undefined;
    nameInvalid: boolean;
    nameRef: RefObject<HTMLInputElement | null>;
    onDirectSave: () => void;
    pathPreview: string;
    saving: boolean;
    scopeLocked: boolean;
    /** 另一个作用域也占着这个名字：遮蔽会发生，在点下去之前说出来。 */
    shadowing: boolean;
    showDivider: boolean;
    submitDisabled: boolean;
    submitLabel: string;
    taken: boolean;
    update: (next: Partial<WorkflowSaveDraft>) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowSaveFields.d.ts.map