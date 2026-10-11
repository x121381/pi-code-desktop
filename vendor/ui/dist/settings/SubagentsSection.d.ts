import { type AgentColor, type AgentsListResult, type AgentSummary } from "@zcode/shared";
import type { ModelSelectionView } from "@zcode/services";
import { type ModelSelectGroup } from "@/ModelConfigSelect.js";
import { type SubagentReasoningFieldState } from "@/settings/SubagentReasoningField.js";
export declare function projectSettingsSubagents(result: AgentsListResult): AgentSummary[];
export interface SubagentFormInitialState {
    name: string;
    description: string;
    color: AgentColor;
    model: string;
    thoughtLevel?: string;
    injectAgentsMd: boolean;
    inheritAllTools: boolean;
    selectedTools: string[];
    preservedTools: string[];
    systemPrompt: string;
}
interface SubagentsSectionProps {
    onManageModels?: () => void;
    workspacePath?: string | null;
    workspaceIdentity?: string;
}
export type SubagentThoughtOptionState = SubagentReasoningFieldState;
export declare function resolveSubagentThoughtOptionState(params: {
    model: string;
    modelAvailable: boolean;
    modelSelectionView?: ModelSelectionView | null;
    modelSelectionLoading: boolean;
    thoughtLevel?: string;
}): SubagentThoughtOptionState;
export declare function isSubagentThoughtLevelAvailable(state: SubagentThoughtOptionState, thoughtLevel: string | undefined): boolean;
export declare function isSubagentModelAvailable(modelGroups: readonly ModelSelectGroup[], model: string | undefined, modelSelectionLoading?: boolean): boolean;
export declare function createSubagentFormInitialState(initial?: Pick<AgentSummary, "name" | "description" | "color" | "modelSelection" | "tools" | "systemPrompt" | "injectAgentsMd">): SubagentFormInitialState;
/** 按完整插件 ID 分组，避免同名 marketplace 的子智能体互相合并。 */
export declare function groupPluginAgentsById(agents: readonly AgentSummary[]): Array<[string, AgentSummary[]]>;
export declare function SubagentsSection({ onManageModels }: SubagentsSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SubagentsSection.d.ts.map