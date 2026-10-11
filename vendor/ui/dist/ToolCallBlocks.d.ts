import { type ReactNode } from "react";
import type { TaskChatToolCallTreeNode } from "@/lib/toolCallTree.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import { type ToolCallBlockRenderContext } from "@/ToolCallBlocks/shared.js";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { ConversationCuaGroupEvent } from "@/v4/conversationCuaGroups.js";
export declare function isAgentToolCall(toolCall: TaskChatToolCallTreeNode["toolCall"]): boolean;
declare function ToolCallBlockComponent({ toolCallNode, depth, workspacePath, theme, codePreviewSettings, showIcon, cuaAppIconClassName, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, onOpenAutomationsMain, onOpenPlanDetail, pluginUi: providedPluginUi, onOpenWorkflowRun, onResumeWorkflowRun, onOpenWorkflowActor, onOpenWorkflowWorkspace, onOpenWorkflowArtifact, workflowRun, workflowDraft, onLoadFullToolCallFields, suppressSourceLabel, showTodoToolCalls, disableSummaryContentAnimation, animateDiffCountOnMount, agentSummaryAction, authoritativeAgentType, streamingEntranceActive, streamingEntranceKeyPrefix, cuaGroupEvents, renderCuaAssistantMessage, renderCuaReasoning, }: {
    toolCallNode: TaskChatToolCallTreeNode;
    depth?: number;
    workspacePath: string;
    /** 应用主题（store 耦合剥离）：由宿主（v4 SessionPane 等）传入，缺省按 "system" 兜底。 */
    theme?: ToolCallBlockRenderContext["theme"];
    /** 代码预览设置（store 耦合剥离）：由宿主传入并保持引用稳定。 */
    codePreviewSettings?: ToolCallBlockRenderContext["codePreviewSettings"];
    showIcon?: boolean;
    cuaAppIconClassName?: ToolCallBlockRenderContext["cuaAppIconClassName"];
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenAutomationsMain?: (automationId?: string) => void;
    onOpenPlanDetail?: ToolCallBlockRenderContext["onOpenPlanDetail"];
    pluginUi?: ToolCallBlockRenderContext["pluginUi"];
    onOpenWorkflowRun?: ToolCallBlockRenderContext["onOpenWorkflowRun"];
    /** 工具卡页脚的 Resume；与 workflowRun 同样不向子工具卡透传。 */
    onResumeWorkflowRun?: ToolCallBlockRenderContext["onResumeWorkflowRun"];
    /** 药丸 → 子代理 transcript；同样不向子工具卡透传。 */
    onOpenWorkflowActor?: ToolCallBlockRenderContext["onOpenWorkflowActor"];
    /** 脚本药丸 → 脚本 transcript；同样不向子工具卡透传。 */
    onOpenWorkflowWorkspace?: ToolCallBlockRenderContext["onOpenWorkflowWorkspace"];
    /** 产物药丸 → 产物 tab；同样不向子工具卡透传。 */
    onOpenWorkflowArtifact?: ToolCallBlockRenderContext["onOpenWorkflowArtifact"];
    /**
     * 该工具调用联接到的 workflow run 摘要（宿主按 toolCallId 从 workflowRuns 投影解析）。
     * 刻意**不**向子工具卡透传：摘要是按 toolCallId 联接出来的，把父卡的 run 摘要传给
     * 一个不同 toolCallId 的子卡，画出来的就是别人的运行态。
     */
    workflowRun?: ToolCallBlockRenderContext["workflowRun"];
    /** 编译反馈的草稿位置（宿主按 toolCallId 从行窗口联接）；同 workflowRun，不向子工具卡透传。 */
    workflowDraft?: ToolCallBlockRenderContext["workflowDraft"];
    onLoadFullToolCallFields?: (toolId: string) => Promise<boolean | void> | boolean | void;
    suppressSourceLabel?: boolean;
    showTodoToolCalls?: boolean;
    disableSummaryContentAnimation?: boolean;
    animateDiffCountOnMount?: boolean;
    agentSummaryAction?: ToolCallBlockRenderContext["agentSummaryAction"];
    authoritativeAgentType?: ToolCallBlockRenderContext["authoritativeAgentType"];
    streamingEntranceActive?: boolean;
    streamingEntranceKeyPrefix?: string;
    cuaGroupEvents?: readonly ConversationCuaGroupEvent[];
    renderCuaAssistantMessage?: (event: Extract<ConversationCuaGroupEvent, {
        kind: "assistantMessage";
    }>) => ReactNode;
    renderCuaReasoning?: (event: Extract<ConversationCuaGroupEvent, {
        kind: "reasoning";
    }>) => ReactNode;
}): import("react/jsx-runtime").JSX.Element | null;
export declare const ToolCallBlock: import("react").MemoExoticComponent<typeof ToolCallBlockComponent>;
export {};
//# sourceMappingURL=ToolCallBlocks.d.ts.map