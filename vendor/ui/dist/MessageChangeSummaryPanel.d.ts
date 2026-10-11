import type { ZCodePersistedFileChange, ZCodeTaskChangeSummary, ZCodeTurnFileState } from "@zcode/shared";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
export { buildChangeSummaryDiffViewerSource, buildChangeSummaryFilePreviewSource, openChangeSummaryDiffViewer, } from "@/messageChangeSummaryPreview.js";
interface MessageChangeSummaryPanelProps {
    summary: ZCodeTaskChangeSummary;
    workspacePath: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    changeDetails?: ZCodePersistedFileChange | null;
    readonlyDiffPatchesByPath?: ReadonlyMap<string, string>;
    fileState?: ZCodeTurnFileState;
    messageId?: string;
    compactForRemoteControl?: boolean;
    animationDelayMs?: number;
    onToggleFiles?: () => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}
export declare function MessageChangeSummaryPanel({ summary, workspacePath, workspaceIdentity, workspaceRemoteSessionId, changeDetails, readonlyDiffPatchesByPath, fileState, messageId, compactForRemoteControl, animationDelayMs, onToggleFiles, onOpenCodeViewer, }: MessageChangeSummaryPanelProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MessageChangeSummaryPanel.d.ts.map