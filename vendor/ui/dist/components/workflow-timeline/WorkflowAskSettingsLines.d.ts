import { type WorkflowAdjustableSettings } from "@/ToolCallBlocks/renderers/createWorkflowInput.js";
import { type WorkflowSettingsModelScope } from "./useWorkflowSettingsModelChoices.js";
import { type WorkflowAskSettingsContent } from "./workflowAskSettings.js";
export declare function WorkflowAskSettings({ adjustable, disabled, input, onBlockedChange, onContentChange, scope, }: {
    adjustable: WorkflowAdjustableSettings;
    disabled: boolean;
    /** 确认窗的工具入参（CLI resolveInput 归一化过的那一份）。 */
    input: unknown;
    onContentChange?: (content: WorkflowAskSettingsContent | undefined) => void;
    /** 所选模型读好清单后仍不可用：Allow 要等用户换一个（与弹层的 Apply 同一条规则）。 */
    onBlockedChange?: (blocked: boolean) => void;
    scope: WorkflowSettingsModelScope;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowAskSettingsLines.d.ts.map