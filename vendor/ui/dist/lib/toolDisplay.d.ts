import type { TaskChatToolCall as ChatToolCall } from "@/lib/taskChatMessageTypes.js";
import { type CodeViewerSource, type ImageCodeViewerSource, type PatchCodeViewerSource, type TextCodeViewerSource } from "@/lib/codeViewer.js";
export type ToolInlinePreview = {
    type: "none";
} | {
    type: "text";
    source: TextCodeViewerSource;
} | {
    type: "patch";
    source: PatchCodeViewerSource;
} | {
    type: "image";
    source: ImageCodeViewerSource;
};
export interface ToolPlanResult {
    plan: string;
    planFilePath?: string;
}
export interface ToolDisplayModel {
    inlinePreview: ToolInlinePreview;
    planResult: ToolPlanResult | null;
    viewerSource: CodeViewerSource | null;
    viewerLabelId: "codeViewer.viewCode" | "codeViewer.viewDiff";
    showSummaryFileLink: boolean;
    showInput: boolean;
    showOutput: boolean;
    showKind: boolean;
}
export declare function buildToolDisplayModel(toolCall: ChatToolCall, workspacePath: string): ToolDisplayModel;
//# sourceMappingURL=toolDisplay.d.ts.map