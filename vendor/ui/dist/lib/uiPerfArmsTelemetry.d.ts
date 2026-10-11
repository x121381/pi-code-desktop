import { type IPlatformService, type LaunchMarks } from "@zcode/shared";
export declare const UI_PERF_ARMS_GROUP = "ui_perf";
export declare const UI_PERF_EVENT_LAUNCH_TO_INPUT = "perf_ui_launch_to_input";
export declare const UI_PERF_EVENT_LAUNCH_ELECTRON_INIT = "perf_ui_launch_electron_init_ms";
export declare const UI_PERF_EVENT_LAUNCH_APP_READY = "perf_ui_launch_app_ready_ms";
export declare const UI_PERF_EVENT_LAUNCH_WINDOW = "perf_ui_launch_window_ms";
export declare const UI_PERF_EVENT_LAUNCH_RENDERER_LOAD = "perf_ui_launch_renderer_load_ms";
export declare const UI_PERF_EVENT_LAUNCH_REACT_COMMIT = "perf_ui_launch_react_commit_ms";
export declare const UI_PERF_EVENT_LAUNCH_STARTUP_GATE = "perf_ui_launch_startup_gate_ms";
export declare const LAUNCH_TO_INPUT_SANITY_MAX_MS = 300000;
export declare const UI_PERF_EVENT_FIRST_TOKEN = "perf_ui_first_token";
export declare const UI_PERF_EVENT_MESSAGE_COMPLETE = "perf_ui_message_complete";
export declare const UI_PERF_EVENT_TURN_BREAKDOWN = "perf_ui_turn_breakdown";
export declare const UI_PERF_EVENT_TOOL_CALL_DETAIL = "perf_ui_tool_call_detail";
export declare const UI_PERF_EVENT_STREAM_STALL = "perf_ui_stream_stall";
export declare const STREAM_STALL_REPORT_THRESHOLD_MS = 3000;
type ArmsReporter = Pick<IPlatformService, "reportArmsCustomEvent">;
export declare function setUiPerfArmsReporter(reporter: ArmsReporter | null): void;
export declare function clearUiPerfArmsReporterForTest(): void;
interface LaunchToInputTimings {
    marks: LaunchMarks;
    /** renderer/src/main.tsx 模块顶部 Date.now()（T4） */
    rendererStart: number;
    /** zcode-react-startup-ready 触发时 Date.now()（T5） */
    reactCommit: number;
    /** 启动门禁清除、输入框可用时 Date.now()（T6） */
    inputReady: number;
    /** 同一次启动的关联键 */
    sessionId: string;
}
export declare function reportUiLaunchToInput(timings: LaunchToInputTimings): void;
export declare function reportUiFirstToken(params: {
    ttftMs: number;
    model?: string;
    talkId?: string;
    messageId?: string;
}): void;
export declare function reportUiMessageComplete(params: {
    durationMs: number;
    result: string;
    model?: string;
    talkId?: string;
    messageId?: string;
}): void;
export declare function reportUiTurnBreakdown(params: {
    durationMs: number;
    result: string;
    model?: string;
    talkId?: string;
    messageId?: string;
    ttftMs?: number;
    waitingMs?: number;
    toolCallTotal?: number;
    toolCallFailed?: number;
    agentStepCount?: number;
    retryCount?: number;
    fileChangeCount?: number;
    generatedCodeLines?: number;
}): void;
export declare function reportUiToolCallDetail(params: {
    toolName?: string;
    status: string;
    talkId?: string;
    messageId?: string;
    toolCallId?: string;
    parentToolCallId?: string;
    childToolCallId?: string;
    childSessionId?: string;
    agentId?: string;
    agentType?: string;
    totalMs?: number;
    permissionWaitMs?: number;
    commandRunMs?: number;
    firstOutputMs?: number;
    noOutputMs?: number;
    exitCode?: number;
    timedOut?: boolean;
    outputBytes?: number;
    commandCategory?: string;
    commandName?: string;
    commandCount?: number;
    commandStatus?: string;
    fsReadMs?: number;
    fsWriteMs?: number;
    patchMatchMs?: number;
    fileCount?: number;
    totalBytes?: number;
    maxFileBytes?: number;
    hunkCount?: number;
    matchAttempts?: number;
    workspaceKind?: string;
}): void;
export declare function recordStreamChunkArrival(taskId: string, options?: {
    waitingTool?: boolean;
    /** tracker 可用 workspace-scoped 内部 key；上报仍保持真实 talk_id。 */
    talkId?: string;
    messageId?: string;
    model?: string;
    chunkType?: "message" | "thought" | "unknown";
    now?: number;
}): void;
export declare function clearStreamStallTracking(taskId: string): void;
export declare const UI_PERF_EVENT_INPUT_LAG = "perf_ui_input_lag";
export declare const INPUT_LAG_REPORT_THRESHOLD_MS = 500;
export declare const INPUT_LAG_SANITY_MAX_MS = 5000;
export declare function shouldReportInputLag(args: {
    lagMs: number;
    isProgrammatic: boolean;
    isComposing: boolean;
}): boolean;
export declare function recordInputLag(params: {
    lagMs: number;
    textLength: number;
    isProgrammatic: boolean;
    isComposing: boolean;
    taskId?: string;
}): void;
export {};
//# sourceMappingURL=uiPerfArmsTelemetry.d.ts.map