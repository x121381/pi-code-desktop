import type { TurnHeaderRow } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
interface ConversationFileSummaryPanelProps {
    header: TurnHeaderRow;
    context: ConversationRowRenderContext;
    assistantText?: string;
}
export declare function ConversationFileSummaryPanel({ header, context, assistantText, }: ConversationFileSummaryPanelProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=ConversationFileSummaryPanel.d.ts.map