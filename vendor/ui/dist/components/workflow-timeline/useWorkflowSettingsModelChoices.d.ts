import { type ZCodeConfigOption } from "@zcode/shared";
import type { ModelSelectGroup, ModelSelectGroupItem } from "@/ModelConfigSelect.js";
import { type WorkflowRunSettingsModel } from "./workflowRunSettings.js";
/** 模型清单的作用域与会话模型：宿主给。 */
export interface WorkflowSettingsModelScope {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    /** 会话当前模型（首项与触发器用它的名字）；缺席时首项只写「会话模型」。 */
    sessionModel?: {
        providerId: string;
        modelId: string;
    };
}
/** 一个模型选择在屏幕上的样子。 */
export interface WorkflowSettingsModelFace {
    /** 菜单值（会话模型是占位值）。 */
    value: string;
    /** 触发器上的名字：会话模型的名字，或规范串的人话名。 */
    triggerLabel: string;
    /** 清单读好了却找不到它：被删或停用。 */
    unavailable: boolean;
    /** 它的思考档；没有档位（或不可用）即 null。 */
    thoughtOption: ZCodeConfigOption | null;
}
export declare function useWorkflowSettingsModelChoices(scope: WorkflowSettingsModelScope): {
    /** 清单还没读好（读好之前字段禁用）。 */
    loading: boolean;
    /** 清单读好了却一个模型都没有：模型那一格退成一句话。 */
    noCatalog: boolean;
    groups: ModelSelectGroup[];
    providerName: (providerId: string) => string | undefined;
    sessionBadge: string;
    sessionModelItem: ModelSelectGroupItem;
    sessionModelName: string;
    describe: (model: WorkflowRunSettingsModel) => WorkflowSettingsModelFace;
    pick: (value: string, current: WorkflowRunSettingsModel) => WorkflowRunSettingsModel;
};
//# sourceMappingURL=useWorkflowSettingsModelChoices.d.ts.map