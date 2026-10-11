import type { InputId, PlanIdentitySnapshot, ZCodeContextCompactionTimelineMeta, ZCodePersistedFileChange, ZCodeProvider, ZCodeStreamEvent, ZCodeUsage } from "@zcode/shared";
interface FinalizePromptTelemetryInput {
    taskId: string;
    status: string;
    finishedAt: number;
    fileChanges?: readonly ZCodePersistedFileChange[];
    usage?: ZCodeUsage;
    errorType?: string;
    errorMsg?: string;
    messageSource?: PromptMessageSource;
    agentComposition?: AgentComposition;
}
/** 独立 background wake 轮的来源：Agent 工具的后台子代理，或 dynamic-workflow run 的通知。 */
export type PromptMessageSource = "background_subagent" | "background_workflow";
/**
 * `message_completion.agent_composition`：本轮消费过哪些 Subagent 结果（fg = 前台、bg = 后台、
 * wf = 动态工作流 run）。八个值 = 三个布尔的组合。
 */
type AgentComposition = "main_only" | "main_plus_fg" | "main_plus_bg" | "main_plus_wf" | "main_plus_fg_bg" | "main_plus_fg_wf" | "main_plus_bg_wf" | "main_plus_fg_bg_wf";
export declare function composeAgentComposition(input: {
    hasForegroundSubagentResult: boolean;
    hasBackgroundSubagentResult: boolean;
    hasWorkflowResult: boolean;
}): AgentComposition;
interface FinalizedPromptTelemetry {
    taskId: string;
    messageId: string;
    eventExtraDetail: Record<string, string>;
}
type AgentStepTelemetryClientMode = "desktop-continuous" | "web-remote-replayable";
export type AgentStepRole = "foreground subagent" | "background subagent" | "workflow subagent";
interface AgentStepSkillMetadata {
    qualifiedName?: string;
    pluginId?: string;
    source?: "agents" | "zcode" | "bundled" | "plugin" | "remote";
}
interface AgentStepToolAttribution {
    agentId?: string;
    agentRole?: AgentStepRole;
    modelName?: string;
    modelProvider?: string;
    providerName?: string;
}
interface FinalizedAgentStepTelemetry {
    taskId: string;
    messageId: string;
    eventExtraDetail: Record<string, string>;
}
export declare function buildPromptTelemetryExtraDetail(params: {
    askMode?: string | null;
    modelName?: string | null;
    provider?: ZCodeProvider;
    selectedSupplierKey?: string | null;
    providerBaseURL?: string | null;
    planIdentitySnapshot?: PlanIdentitySnapshot | null;
}): Record<string, string>;
/**
 * 构建压缩（context compaction）结果埋点字段。
 * 仅在终态（completed/failed/interrupted）返回字段对象，运行态（started/retrying/skipped）返回 null，
 * 调用方据此决定是否上报。成功率由数仓按 status 聚合：completed / (completed + failed + interrupted)。
 * provider/model 维度复用 buildPromptTelemetryExtraDetail，version 由后端 reportEvent 注入。
 */
export declare function buildCompactionTelemetryExtraDetail(params: {
    timeline: ZCodeContextCompactionTimelineMeta;
    provider?: ZCodeProvider;
    /** V4 fact 已从真实模型请求归一化出的 provider；优先于旧 UI supplier 推导。 */
    modelProvider?: string | null;
    modelName?: string | null;
    selectedSupplierKey?: string | null;
}): Record<string, string> | null;
export declare function recordComposerFocus(workspacePath: string, now?: number): void;
export declare function recordComposerTextChange(workspacePath: string, nextText: string, now?: number): void;
export declare function queuePromptTelemetry(input: {
    workspacePath: string;
    taskId: string;
    messageId: string;
    inputId?: InputId;
    sendTime: number;
    extraDetail?: Record<string, string>;
}): {
    input_start_time: string;
    input_first_char_time: string;
    input_send_time: string;
};
export declare function activatePromptTelemetry(taskId: string, messageId: string): void;
/** background child 只复用 agent_step 状态，不创建或上报独立的 message 生命周期。 */
export declare function activateDetachedAgentStepTelemetry(input: {
    taskId: string;
    messageId: string;
    sendTime: number;
    extraDetail?: Record<string, string>;
}): void;
export declare function rekeyQueuedPromptTelemetry(taskId: string, fromMessageId: string, toMessageId: string): void;
export declare function recordPromptModelRequestStarted(taskId: string, event: Extract<ZCodeStreamEvent, {
    type: "task_network_debug_status";
}>, activeInputId?: string): void;
/**
 * 将 Subagent 的真实模型与累计 usage 写入其 Agent step。
 * foreground 使用父 task state，background 使用 detached child state。
 */
export declare function recordSubagentToolAttribution(input: {
    taskId: string;
    toolCallId: string;
    requestIds: string[];
    requestCount: number;
    modelName: string;
    modelProvider: string;
    providerName: string;
    agentId: string;
    agentRole?: AgentStepRole;
    usage?: ZCodeUsage;
}): void;
export declare function recordAgentStepTelemetryEvent(input: {
    taskId: string;
    event: ZCodeStreamEvent;
    activeInputId?: string;
    clientMode?: AgentStepTelemetryClientMode;
    toolAttribution?: AgentStepToolAttribution;
    skillMetadata?: AgentStepSkillMetadata;
    now?: number;
}): FinalizedAgentStepTelemetry[];
export declare function recordPromptFirstToken(taskId: string, now?: number): void;
export declare function getActivePromptModelName(taskId: string): string | undefined;
export declare function getActivePromptMessageId(taskId: string): string | undefined;
export declare function recordPromptTokenUsageDelta(input: {
    taskId: string;
    eventKey: string;
    usage: ZCodeUsage;
    requestId?: string;
    modelName?: string;
    modelProvider?: string;
    providerName?: string;
}): void;
export declare function recordPromptPermissionRequest(input: {
    taskId: string;
    requestId: string;
    toolCallId?: string;
    raw?: unknown;
    now?: number;
}): void;
export declare function recordPromptPermissionResponse(input: {
    taskId: string;
    requestId: string;
    now?: number;
}): void;
export declare function finalizePromptTelemetry(input: FinalizePromptTelemetryInput): FinalizedPromptTelemetry | null;
export declare function resetMessageTelemetryForTest(): void;
/** workspace telemetry attachment 释放时只清自己的内部 task key，不影响其它 workspace。 */
export declare function discardPromptTelemetry(taskId: string): void;
/** 仅丢弃尚未激活的单条 prompt，避免同 session 其它排队消息被一并清空。 */
export declare function discardQueuedPromptTelemetry(taskId: string, messageId: string): void;
export {};
//# sourceMappingURL=messageTelemetry.d.ts.map