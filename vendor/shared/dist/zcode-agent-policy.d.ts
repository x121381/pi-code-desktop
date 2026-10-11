import { z } from "zod";
import type { CommandAgentSource } from "./command-types.js";
import type { ZCodeProvider } from "./zcode-task-types-core.js";
export declare const ZCODE_AGENT_PROVIDER = "glm";
export declare const ZCODE_AGENT_PROVIDER_LABEL = "ZCode Agent";
export declare const ZCODE_COMMAND_AGENT_SOURCE = "zcodeAgent";
/**
 * 解析持久化/relay 数据时的 provider 归一 schema：
 * 已移除的第三方 provider 历史值仅作为归一化输入保留，统一收敛为 glm；
 * 其它非法值保持拒绝，与收窄前的校验边界一致。
 */
export declare const legacyZCodeProviderSchema: z.ZodPipe<z.ZodEnum<{
    claude: "claude";
    glm: "glm";
    opencode: "opencode";
    gemini: "gemini";
    codex: "codex";
}>, z.ZodTransform<"glm", "claude" | "glm" | "opencode" | "gemini" | "codex">>;
export declare const ZCODE_ENABLED_AGENT_PROVIDERS: readonly ["glm"];
export declare const ZCODE_COMMAND_AGENT_SOURCES: readonly ["zcodeAgent"];
export declare function normalizeAgentProviderToZCodeAgent(_provider?: ZCodeProvider | null): ZCodeProvider;
export declare function normalizeAgentProvidersToZCodeAgent(_providers?: ReadonlyArray<ZCodeProvider> | null): ZCodeProvider[];
export declare function normalizeCommandAgentSourceToZCodeAgent(_agentSource?: CommandAgentSource | null): CommandAgentSource;
export declare function isZCodeAgentProvider(provider: ZCodeProvider | null | undefined): provider is typeof ZCODE_AGENT_PROVIDER;
//# sourceMappingURL=zcode-agent-policy.d.ts.map