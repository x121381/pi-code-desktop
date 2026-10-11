import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import { type AssistantPreviewCard, type AssistantPreviewCardsAutoOpenRequest } from "@/lib/assistantPreviewCards.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
export interface AssistantPreviewCardValidationResult {
    visibleCards: AssistantPreviewCard[];
    settled: boolean;
}
export declare function buildAssistantPreviewCardFileSource(card: Extract<AssistantPreviewCard, {
    type: "markdown" | "file";
}>, scope: {
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}): CodeViewerSource;
export declare function buildAssistantPreviewPptxAutoOpenRequest(visibleCards: readonly AssistantPreviewCard[], baseKey: string, scope: {
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}): AssistantPreviewCardsAutoOpenRequest | null;
interface AssistantPreviewCardsProps {
    cards: AssistantPreviewCard[];
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    onOpenBrowserUrl?: (url: string) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    /** Desktop 完成态生成产物：批量打开本轮已通过校验的 PPTX。 */
    autoOpenPptxKey?: string;
    onAutoOpenPptx?: (request: AssistantPreviewCardsAutoOpenRequest) => void;
    compactForRemoteControl?: boolean;
}
export declare function shouldRenderAssistantPreviewCardAsFile(card: AssistantPreviewCard, scope: {
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    compactForRemoteControl?: boolean;
}): boolean;
export declare function useAssistantPreviewCardValidation(cards: AssistantPreviewCard[], scope?: {
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}): AssistantPreviewCardValidationResult;
export declare function AssistantPreviewCards({ cards, workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenBrowserUrl, onOpenFileLink, onOpenCodeViewer, autoOpenPptxKey, onAutoOpenPptx, compactForRemoteControl, }: AssistantPreviewCardsProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=AssistantPreviewCards.d.ts.map