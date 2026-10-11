import { type MarkdownFileLinkResolveOptions } from "@/lib/markdownFileLink.js";
export type AssistantPreviewFileKind = "markdown" | "html" | "docx" | "xlsx" | "pptx" | "pdf" | "video" | "audio";
export type AssistantPreviewFileSubtitleId = "chat.previewCards.markdown" | "chat.previewCards.htmlWebsite" | "chat.previewCards.docx" | "chat.previewCards.xlsx" | "chat.previewCards.pptx" | "chat.previewCards.pdf" | "chat.previewCards.video" | "chat.previewCards.audio";
export interface AssistantPreviewFileTypeDefinition {
    extensions: readonly string[];
    kind: AssistantPreviewFileKind;
    subtitleId: AssistantPreviewFileSubtitleId;
}
export interface AssistantFileReference {
    end: number;
    kind: AssistantPreviewFileKind;
    path: string;
    raw: string;
    start: number;
}
export type AssistantFilePathResolveOptions = MarkdownFileLinkResolveOptions;
export declare function cleanAssistantFilePathCandidate(candidate: string): string;
export declare function getAssistantPreviewFileTypeDefinition(path: string): AssistantPreviewFileTypeDefinition | null;
export declare function isAssistantPreviewHtmlPath(path: string): boolean;
export declare function parseAssistantFileUrlPath(url: string): string | null;
export declare function resolveAssistantRawFilePath(workspacePath: string, rawPath: string, options?: AssistantFilePathResolveOptions): string | null;
export declare function extractAssistantFileReferences(content: string, workspacePath: string, options?: AssistantFilePathResolveOptions): AssistantFileReference[];
export declare function hasAssistantPreviewFileChangeCandidates(content: string, workspacePath: string, options?: AssistantFilePathResolveOptions): boolean;
//# sourceMappingURL=assistantFileReferences.d.ts.map