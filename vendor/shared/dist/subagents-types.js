import { modelSelectionSchema } from "./model-selection.js";
/** 正式 reader 只接受结构化覆盖，不在读取时解释旧双 map 或重新匹配 Provider。 */
export function parsePluginSubagentModelSelectionOverrides(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
        return {};
    return Object.fromEntries(Object.entries(value).flatMap(([id, candidate]) => {
        const selection = modelSelectionSchema.safeParse(candidate);
        return id.startsWith("plugin:") && selection.success ? [[id, selection.data]] : [];
    }));
}
/**
 * 插件 subagent 的稳定 id：`plugin:<pluginId>:<裸名小写>`。
 * pluginId 为 `<name>@<marketplace>`，不含版本，插件升级后 id 不变，覆盖随之保留。
 * services 与 CLI bootstrap 都用它做 agents-state.json 的键，必须共用一处实现。
 */
export function createPluginAgentStateId(pluginId, agentName) {
    return `plugin:${pluginId}:${agentName.trim().toLowerCase()}`;
}
export function createAgentStateId(input) {
    return `${input.source}:${input.scope}:${input.name.trim().toLowerCase()}`;
}
//# sourceMappingURL=subagents-types.js.map