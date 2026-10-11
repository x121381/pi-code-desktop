import { type UsageEntitlementSnapshot } from "@zcode/shared";
import type { GlmQuotaBannerBusinessCode, StartPlanConcurrentLimitBannerReason } from "@/lib/providerBusinessError.js";
import type { McpUnavailableNotice } from "@/v4/mcpUnavailableBannerNotice.js";
export type SessionQuotaBannerKind = "model-very-low" | "model-exhausted" | "daily-exhausted" | "concurrent-limit" | "provider-limited" | "mcp-quota-exhausted" | "mcp-plan-required";
export interface SessionQuotaBannerState {
    visible: boolean;
    kind: SessionQuotaBannerKind | null;
    concurrentLimitBusinessCode: "3008" | "3009" | "3010" | null;
    concurrentLimitReason: StartPlanConcurrentLimitBannerReason | null;
    providerLimitedBusinessCode: GlmQuotaBannerBusinessCode | null;
    providerLimitedMessage: string | null;
    modelName: string | null;
    /** 官方 Server MCP 提示专用：出问题的 MCP server 名，用于文案点名。 */
    mcpServerName: string | null;
    /** 官方 Server MCP 提示专用：产生该事实的 tool row，参与去重键。 */
    mcpNoticeRowId: number | null;
    /** 仅低额度提醒携带稳定桶周期键；不影响其他业务错误关闭。 */
    reminderKey?: string;
    reminderExpiresAt?: number;
    /** 与桶有效性一致的快照时间，不能换算为设备时钟。 */
    reminderReferenceTime?: number;
    quotaPeriod?: string;
    remainingTokens: number | null;
    remainingPercent: number | null;
    dismissible: boolean;
    blocksSubmit: boolean;
    priority: number;
}
export declare const HIDDEN_SESSION_QUOTA_BANNER_STATE: SessionQuotaBannerState;
export declare function normalizeProviderLimitedBannerMessage(message: string | null | undefined): string | null;
/**
 * 额度业务错误保持原优先级；Start Plan 低额度按桶提醒，耗尽按全部有效桶判断。
 */
export declare function buildSessionQuotaBannerState(params: {
    activeProviderId: string | null;
    snapshot: UsageEntitlementSnapshot | null;
    modelId: string | null;
    serverQuotaExhausted?: boolean;
    isReminderHidden?: (key: string, referenceTime: number) => boolean;
    serverConcurrentLimited?: boolean;
    serverConcurrentLimitBusinessCode?: "3008" | "3009" | "3010";
    serverConcurrentLimitReason?: StartPlanConcurrentLimitBannerReason;
    serverProviderLimitedBusinessCode?: GlmQuotaBannerBusinessCode;
    serverProviderLimitedMessage?: string | null;
    /** 官方 Server MCP 在本次会话内被判定不可用的事实（来自 tool row 的结构化标识）。 */
    mcpUnavailableNotice?: McpUnavailableNotice | null;
}): SessionQuotaBannerState;
export declare function buildSessionQuotaBannerDismissKey(state: SessionQuotaBannerState, serverErrorKey?: string | null): string | null;
export declare function resolveQuotaBannerUpgradeProviderId(providerId: string | null): string | null;
/**
 * 该提示是否应该带升级入口。
 *
 * `mcp-quota-exhausted` 明确不带：今日额度用完只能等自然日重置，升级按钮会让用户以为
 * 花钱就能立刻继续，是误导。权益缺失（`mcp-plan-required`）才是升级能解决的问题。
 */
export declare function shouldOfferQuotaBannerUpgrade(kind: SessionQuotaBannerKind | null): boolean;
//# sourceMappingURL=sessionQuotaBannerState.d.ts.map