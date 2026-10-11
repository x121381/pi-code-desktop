import type { ConversationRowRenderContext } from "@/v4/conversationRowContext.js";
import type { WorkflowTurnCompletion } from "@/v4/workflowTurnCompletion.js";
/**
 * 完成卡的落位：把解析出的完成事实接上
 * 宿主回调与产物取数。回调的存在即门控（照 `ConversationWorkflowDigests`）：⤢ 要
 * `onOpenWorkflowRun` + sessionId + 联接到的 `toolCallId`；瓦片与药丸要 `onOpenWorkflowArtifact`
 * + sessionId（不需要 toolCallId，与通知行同一条门）。
 *
 * 产物清单**以通知载荷为底**（随通知持久化，冷恢复也在），会话在场时再经既有的产物 hook 补
 * 字节数 / 出处 / 看板 spec / 交付物旗子，并给交付物的框挂预览。没有会话上下文的宿主（静态渲染、
 * 回放）画的是只有字形的冷态卡——同一张卡，少一层。
 */
export declare function ConversationWorkflowCompletion({ completion, context, turnKey, }: {
    completion: WorkflowTurnCompletion;
    context: ConversationRowRenderContext;
    turnKey: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationWorkflowCompletion.d.ts.map