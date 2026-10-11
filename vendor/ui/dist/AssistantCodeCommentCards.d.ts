import type { AssistantCodeCommentCard } from "@/lib/assistantCodeComment.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
export declare function AssistantCodeCommentCards({ cards, onOpenCodeViewer, workspaceIdentity, workspacePath, workspaceRemoteSessionId, }: {
    cards: readonly AssistantCodeCommentCard[];
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    workspaceIdentity?: string;
    workspacePath: string;
    workspaceRemoteSessionId?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=AssistantCodeCommentCards.d.ts.map