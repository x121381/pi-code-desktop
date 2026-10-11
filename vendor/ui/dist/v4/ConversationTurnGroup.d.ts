import type { ApiRetryState, AttachmentRef, CommandAck, ConversationRowTarget } from "@zcode/shared/zcode-protocol-v4";
import type { AssistantFeedbackHandler } from "@/v4/ConversationRowView.js";
import { type ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
import type { ConversationTurnRenderUnit } from "@/v4/conversationTurnRenderUnits.js";
interface ConversationTurnGroupProps {
    unit: ConversationTurnRenderUnit;
    /** Timeline 的共享 UI 时钟；用于在 Highspeed 过期边界立即撤销运行态紫色流光。 */
    nowMs?: number;
    /** 仅由 Timeline 注入给当前 live turn；历史 turn 永远不携带运行时 retry。 */
    apiRetry?: ApiRetryState | null;
    context: ConversationRowRenderContext;
    onFork?: (target: ConversationRowTarget) => void;
    onRetry?: (target: ConversationRowTarget) => void;
    onFeedbackChange?: AssistantFeedbackHandler;
    onEdit?: (target: ConversationRowTarget, newText: string, attachments?: readonly AttachmentRef[], workspaceMode?: "preserve" | "rewind") => Promise<CommandAck | boolean | void> | CommandAck | boolean | void;
    /** 分享选择阶段在正文左侧显示本轮勾选入口。 */
    shareSelection?: {
        eligibleRowIds: ReadonlySet<number>;
        selectedRowIds: ReadonlySet<number>;
        onToggle: (rowId: number) => void;
    };
}
declare function ConversationTurnGroupImpl({ unit, nowMs, apiRetry, context, onFork, onRetry, onFeedbackChange, onEdit, shareSelection, }: ConversationTurnGroupProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationTurnGroup: import("react").MemoExoticComponent<typeof ConversationTurnGroupImpl>;
export {};
//# sourceMappingURL=ConversationTurnGroup.d.ts.map