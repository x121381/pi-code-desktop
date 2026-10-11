import { type ZCodeAutomation } from "@zcode/shared";
import type { AutomationRunsEntry, CreateAutomationInput, UpdateAutomationInput } from "@/store/automationManagementStore.js";
export interface AutomationEditSubmit {
    input: CreateAutomationInput | UpdateAutomationInput;
    /** 目标项目(创建时可能不同于当前列表项目)。 */
    workspacePath: string;
    workspaceIdentity?: string;
}
export interface AutomationEditViewProps {
    /** null = 新建；否则编辑。 */
    editing: ZCodeAutomation | null;
    /** 新建预填(来自 More ideas 模板)。 */
    initialDraft?: {
        title: string;
        cronExpr: string;
        prompt: string;
    } | null;
    /** 当前列表所在项目,作为新建的默认目标项目。 */
    defaultWorkspacePath: string;
    defaultWorkspaceIdentity?: string;
    onManageModels?: () => void;
    saving: boolean;
    onSubmit: (params: AutomationEditSubmit) => Promise<boolean>;
    onBack: () => void;
    /** 编辑态:立即运行 / 启停 / 删除。 */
    onRunNow?: (automation: ZCodeAutomation) => Promise<void> | void;
    onToggle?: (automation: ZCodeAutomation, enabled: boolean) => void;
    onDelete?: (automation: ZCodeAutomation) => void;
    /** History tab 运行历史。 */
    runsEntry?: AutomationRunsEntry;
    onLoadRuns?: () => void;
    onDeleteRun?: (runId: string) => void;
    onOpenSession?: (sessionId: string) => void;
}
export declare function saveAndRunAutomation(save: () => Promise<boolean>, run: () => Promise<void> | void): Promise<boolean>;
export declare function AutomationEditView({ editing, initialDraft, defaultWorkspacePath, defaultWorkspaceIdentity, onManageModels, saving, onSubmit, onBack, onRunNow, onToggle, onDelete, runsEntry, onLoadRuns, onDeleteRun, onOpenSession, }: AutomationEditViewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=AutomationEditView.d.ts.map