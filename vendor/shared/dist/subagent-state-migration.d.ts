import { type BuiltInSubagentModelSelectionOverrides, type PluginSubagentModelSelectionOverrides } from "./subagents-types.js";
/** 仅存储迁移入口使用；正式 reader 不得再解释旧双 map 或旧 Provider。 */
export declare function importSubagentStateSelections(input: Record<string, unknown>): Record<string, unknown> & {
    builtInModelSelectionOverrides: BuiltInSubagentModelSelectionOverrides;
    pluginAgentModelSelectionOverrides: PluginSubagentModelSelectionOverrides;
};
//# sourceMappingURL=subagent-state-migration.d.ts.map