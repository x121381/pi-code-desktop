import type { useZCodeIntl } from "@/i18n/IntlProvider.js";
import type { ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
type AgentIntl = ReturnType<typeof useZCodeIntl>["intl"];
type AgentToolCall = ToolCallBlockRenderContext["toolCallNode"]["toolCall"];
export declare function formatAgentMessage(intl: AgentIntl, id: string, fallback: string): string;
export declare function getAgentKindLabel(toolCall: AgentToolCall, fallbackLabel: string, authoritativeAgentType?: string): string;
export declare function getAgentColor(toolCall: AgentToolCall): import("@zcode/shared").AgentColor | undefined;
export declare function readBackgroundAgentInfo(toolCall: AgentToolCall): {
    outputFile: string | undefined;
} | null;
export declare function getAgentActivityContent(toolCall: AgentToolCall): string | undefined;
export declare function getAgentPrimaryText(toolCall: AgentToolCall, fallbackLabel: string): string;
export declare function getAgentPrompt(toolCall: AgentToolCall): string | undefined;
export {};
//# sourceMappingURL=agentHelpers.d.ts.map