import type { IUsageStatsService } from "@zcode/services";
import type { SessionErrorInfo, SessionPhase } from "@zcode/shared/zcode-protocol-v4";
import type { McpUnavailableNotice } from "@/v4/mcpUnavailableBannerNotice.js";
/**
 * V4 quota 业务状态：conversation snapshot 只提供当前 provider/model/错误，额度仍由
 * entitlement 服务读取。两者在 renderer 合并，不把购买或额度状态写回 conversation。
 */
export declare function useV4SessionQuotaBanner(params: {
    sessionId: string | null;
    error: SessionErrorInfo | null;
    errorKey: string | null;
    phase: SessionPhase | null;
    providerId: string | null;
    modelId: string | null;
    usageStatsService?: IUsageStatsService;
    /**
     * 官方 Server MCP 不可用的事实。由调用方从 conversation rows 解析——它是会话事件的投影，
     * 与 entitlement 服务无关，不放进这个 hook 里取。
     */
    mcpUnavailableNotice?: McpUnavailableNotice | null;
}): {
    readonly state: import("@/v4/sessionQuotaBannerState.js").SessionQuotaBannerState;
    readonly dismissKey: string | null;
    readonly dismissed: boolean;
    readonly dismiss: () => void;
    readonly markShown: () => void;
    readonly takesOverError: boolean;
    readonly upgradeProviderId: string | null;
    readonly upgradeActionLabelId: "chat.quota.action.upgrade" | "chat.quota.action.renew";
};
//# sourceMappingURL=useV4SessionQuotaBanner.d.ts.map