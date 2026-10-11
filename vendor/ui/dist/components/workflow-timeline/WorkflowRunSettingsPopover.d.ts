import { type RefObject } from "react";
import type { CommandAck, WorkflowRunState } from "@zcode/shared/zcode-protocol-v4";
import { type WorkflowSettingsModelScope } from "./useWorkflowSettingsModelChoices.js";
import { type WorkflowRunSettingsChange } from "./workflowRunSettings.js";
/** 宿主给弹层的一切：模型清单的作用域、会话模型、以及发命令的那一下。 */
export interface WorkflowRunSettingsHost extends WorkflowSettingsModelScope {
    /** 发 `amendWorkflowRunSettings`（宿主补 workId 与会话），回 ACK。 */
    apply: (change: WorkflowRunSettingsChange) => Promise<CommandAck>;
}
/** 被接受后新 run 的两把钥匙（ACK.result）。 */
export interface WorkflowRunSettingsAccepted {
    runId: string;
    toolCallId: string;
}
/** 触发点的开关与锚点：点同一个触发点再点一次是关，点另一个是移过去重开。 */
export declare function useWorkflowRunSettingsPopoverState(): {
    anchorRef: RefObject<HTMLElement | null>;
    open: boolean;
    setOpen: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    toggleFrom: (element: HTMLElement) => void;
};
export declare function WorkflowRunSettingsPopover({ anchorRef, host, onAccepted, onOpenChange, open, run, }: {
    anchorRef: RefObject<HTMLElement | null>;
    host: WorkflowRunSettingsHost;
    onAccepted?: (accepted: WorkflowRunSettingsAccepted) => void;
    onOpenChange: (open: boolean) => void;
    open: boolean;
    run: WorkflowRunState;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRunSettingsPopover.d.ts.map