import { type AssistantFileReference, type AssistantPreviewFileKind, type AssistantPreviewFileSubtitleId } from "@/lib/assistantFileReferences.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
export { extractAssistantFileReferences, hasAssistantPreviewFileChangeCandidates, isAssistantPreviewHtmlPath, } from "@/lib/assistantFileReferences.js";
export type { AssistantFileReference, AssistantPreviewFileKind, } from "@/lib/assistantFileReferences.js";
export declare const ASSISTANT_PREVIEW_CARD_CANDIDATE_LIMIT = 15;
export declare const ASSISTANT_PREVIEW_CARD_VISIBLE_LIMIT = 10;
export interface AssistantPreviewCardsAutoOpenRequest {
    key: string;
    sources: CodeViewerSource[];
}
export type AssistantPreviewCard = {
    id: string;
    type: "website";
    title: string;
    subtitleId: "chat.previewCards.website" | "chat.previewCards.htmlWebsite";
    url: string;
    filePath?: string;
} | {
    id: string;
    type: "markdown";
    kind: "markdown";
    title: string;
    subtitleId: "chat.previewCards.markdown";
    path: string;
} | {
    id: string;
    type: "file";
    kind: Exclude<AssistantPreviewFileKind, "markdown" | "html">;
    title: string;
    subtitleId: Exclude<AssistantPreviewFileSubtitleId, "chat.previewCards.markdown" | "chat.previewCards.htmlWebsite">;
    path: string;
};
export interface AssistantPreviewCardFileStatService {
    checkFilesExist(params: {
        paths: string[];
    }): Promise<Array<{
        path: string;
        exists: boolean;
    }>>;
}
interface AssistantPreviewCardOptions {
    changedFilePaths?: readonly string[];
    homePath?: string;
    suppressWebRemoteCards?: boolean;
}
export declare function isValidAssistantPreviewWebsiteUrl(url: string): boolean;
export declare function shouldOpenAssistantHtmlInBrowser(params: {
    compactForRemoteControl?: boolean;
    path: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
}): boolean;
export declare function buildAssistantPreviewCards(content: string, workspacePath: string, options?: AssistantPreviewCardOptions): AssistantPreviewCard[];
export declare function buildAssistantPreviewCardsFromReferences(content: string, workspacePath: string, references: readonly AssistantFileReference[], options?: AssistantPreviewCardOptions): AssistantPreviewCard[];
export declare function getAssistantPreviewCardFilePath(card: AssistantPreviewCard): string | null;
export declare function requiresAssistantPreviewCardFileStat(card: AssistantPreviewCard): boolean;
//# sourceMappingURL=assistantPreviewCards.d.ts.map