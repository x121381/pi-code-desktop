import { z } from "zod";
export const ZCODE_AGENT_PROVIDER = "glm";
export const ZCODE_AGENT_PROVIDER_LABEL = "ZCode Agent";
export const ZCODE_COMMAND_AGENT_SOURCE = "zcodeAgent";
/**
 * 解析持久化/relay 数据时的 provider 归一 schema：
 * 已移除的第三方 provider 历史值仅作为归一化输入保留，统一收敛为 glm；
 * 其它非法值保持拒绝，与收窄前的校验边界一致。
 */
export const legacyZCodeProviderSchema = z
    .enum(["claude", "opencode", "gemini", "codex", "glm"])
    .transform(() => ZCODE_AGENT_PROVIDER);
export const ZCODE_ENABLED_AGENT_PROVIDERS = [
    ZCODE_AGENT_PROVIDER,
];
export const ZCODE_COMMAND_AGENT_SOURCES = [
    ZCODE_COMMAND_AGENT_SOURCE,
];
export function normalizeAgentProviderToZCodeAgent(_provider) {
    return ZCODE_AGENT_PROVIDER;
}
export function normalizeAgentProvidersToZCodeAgent(_providers) {
    return [...ZCODE_ENABLED_AGENT_PROVIDERS];
}
export function normalizeCommandAgentSourceToZCodeAgent(_agentSource) {
    return ZCODE_COMMAND_AGENT_SOURCE;
}
export function isZCodeAgentProvider(provider) {
    return provider === ZCODE_AGENT_PROVIDER;
}
//# sourceMappingURL=zcode-agent-policy.js.map