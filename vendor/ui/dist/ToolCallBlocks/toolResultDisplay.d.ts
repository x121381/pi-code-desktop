import { type ToolCallEvalWorkflowSnippetDisplay, type ToolCallGetWorkflowRunDisplay, type ToolCallListModelsDisplay, type ToolCallListWorkflowRunsDisplay, type ToolCallResumeWorkflowRunDisplay, type ToolCallSavedWorkflowListDisplay } from "@zcode/shared/zcode-protocol-v4";
export interface LocalAgentMessageToolResultDisplay {
    kind: "local_agent_message";
    status: "success" | "failed";
    error?: string;
    message?: string;
}
export interface TaskStopToolResultDisplay {
    kind: "task_stop";
    taskId: string;
    taskType: string;
    command?: string;
    message: string;
    truncated?: boolean;
}
export interface TaskOutputToolResultDisplay {
    kind: "task_output";
    retrievalStatus: "success" | "not_ready" | "timeout";
    taskStatus?: string;
    output?: string;
    truncated?: true;
}
export interface RespondToCoordinatorToolResultDisplay {
    kind: "respond_to_coordinator";
    status: "success" | "failed";
}
export interface CuaToolResultDisplay {
    kind: "cua";
    schemaVersion: 1;
    toolName: string;
    status: "success" | "failed";
    structuredContent?: string;
    text?: string;
    errorCode?: string;
    suggestedAction?: string;
    media?: Array<{
        mimeType: string;
        data?: string;
        artifactUri?: string;
    }>;
    truncated?: boolean;
    targetApp?: {
        schemaVersion: 1;
        displayName?: string;
        iconLocators: Array<{
            kind: "darwin-bundle-id";
            value: string;
        } | {
            kind: "windows-executable-path";
            value: string;
        } | {
            kind: "windows-aumid";
            value: string;
        }>;
    };
}
export type ToolResultDisplay = LocalAgentMessageToolResultDisplay | TaskStopToolResultDisplay | TaskOutputToolResultDisplay | RespondToCoordinatorToolResultDisplay | CuaToolResultDisplay | ToolCallGetWorkflowRunDisplay | ToolCallListWorkflowRunsDisplay | ToolCallEvalWorkflowSnippetDisplay | ToolCallSavedWorkflowListDisplay | ToolCallListModelsDisplay | ToolCallResumeWorkflowRunDisplay;
export declare function readToolResultDisplay(raw: unknown): ToolResultDisplay | undefined;
//# sourceMappingURL=toolResultDisplay.d.ts.map