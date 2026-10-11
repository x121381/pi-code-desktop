import { type CSSProperties } from "react";
import { type ZCodeContextUsageBreakdownItem, type ZCodeProvider } from "@zcode/shared";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { type ChatCodingPlanUsageRemainingConfig } from "@/chat-input-toolbar/CodingPlanContextUsage.js";
import { type ChatStartPlanBalanceConfig } from "@/chat-input-toolbar/StartPlanContextBalance.js";
type ContextUsageBreakdownSource = ZCodeContextUsageBreakdownItem["source"];
interface ContextUsageBreakdownSegment {
    chars: number;
    percent: number;
    source: ContextUsageBreakdownSource;
}
export declare function formatContextUsageTokenCount(value: number, locale: string, options?: {
    maximumFractionDigits?: number;
}): string;
export declare function formatContextUsageSummary({ locale, percent, size, used, }: {
    locale: string;
    percent: number;
    size: number;
    used: number;
}): string;
export declare function formatContextCacheHitRateLabel(hitRate: number | null | undefined, locale: string, options?: {
    showBelowThreshold?: boolean;
}): string | null;
export declare function buildContextUsageBreakdownSegments(breakdown: readonly ZCodeContextUsageBreakdownItem[] | undefined): ContextUsageBreakdownSegment[];
export declare function buildContextUsageProgressSegments(segments: readonly ContextUsageBreakdownSegment[]): {
    id: "messages" | "system_prompt" | "meta_user_context" | "skills" | "tool_prompt" | "system_tool_schemas" | "mcp_tool_schemas";
    percent: number;
    style: CSSProperties;
}[];
export declare function getRenderableTaskUsage<T extends {
    used: number;
    size: number;
}>(taskUsage: T | null): T | null;
export declare function getContextCompressionCommand(_provider: ZCodeProvider): string;
export declare function refreshContextUsageOnOpen(open: boolean, onAccess: (() => Promise<void> | void) | undefined): void;
export declare function ChatContextUsage({ codingPlanUsageRemaining, startPlanBalance, taskUsage, selectedProvider: _selectedProvider, intl, locale, }: {
    codingPlanUsageRemaining?: ChatCodingPlanUsageRemainingConfig;
    startPlanBalance?: ChatStartPlanBalanceConfig;
    taskUsage: {
        used: number;
        size: number;
        cache?: {
            hitRate: number | null;
        };
        breakdown?: ZCodeContextUsageBreakdownItem[];
    } | null;
    selectedProvider: ZCodeProvider;
    intl: ReturnType<typeof useZCodeIntl>["intl"];
    locale: string;
    onSendCompressionCommand?: (command: string) => void;
    compressionDisabled?: boolean;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=contextUsage.d.ts.map