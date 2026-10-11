import { type RefObject } from "react";
import type { ZCodeSavedWorkflowScope, ZCodeWorkflowsSaveResult } from "@zcode/shared";
import { type WorkflowSaveDraft } from "./workflowRunSave.js";
export interface WorkflowSavePopoverHost {
    /** 弹层打开那一刻用来预填名字与说明。 */
    runName?: string;
    /** 老 agent 没有 `workflows/save`：只留 ZCode 那条路。 */
    directSaveUnsupported: boolean;
    /** 远程项目不给全局档：`~` 在 agent 机器上，中枢从不读它。 */
    scopeLocked: boolean;
    saving: boolean;
    save: (input: {
        name: string;
        scope: ZCodeSavedWorkflowScope;
        meta: {
            description: string;
        };
        overwrite?: boolean;
    }) => Promise<ZCodeWorkflowsSaveResult>;
    checkNameTaken: (name: string, scope: ZCodeSavedWorkflowScope) => Promise<boolean>;
    /**
     * 把那条用户消息发出去（宿主各有各的发送路径：卡在本会话，侧板在父会话）。
     * 缺席即这条路不可达——弹层只剩细线之下的那一半。
     */
    sendLead?: (draft: WorkflowSaveDraft) => Promise<void>;
    /** 写成之后：父级据此翻成「再次运行」并播一次 aria-live。 */
    onSaved: (saved: {
        name: string;
        scope: ZCodeSavedWorkflowScope;
    }) => void;
}
export declare function WorkflowSavePopover({ anchorRef, host, onOpenChange, open, }: {
    anchorRef: RefObject<HTMLElement | null>;
    host: WorkflowSavePopoverHost;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowSavePopover.d.ts.map