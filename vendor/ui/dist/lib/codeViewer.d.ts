import type { BundledLanguage } from "shiki";
import { type MediaPreviewKind } from "@zcode/shared";
import type { TaskChatToolCall as ChatToolCall } from "@/lib/taskChatMessageTypes.js";
import type { CodeViewerWorkspaceScope } from "@/lib/codeViewerWorkspaceScope.js";
export { buildUnifiedDiff } from "@/lib/toolDiffPreview.js";
export declare const FILE_VIEWER_MAX_TEXT_BYTES: number;
export interface FileCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "file";
    title: string;
    path: string;
}
export interface CodeReviewAnchor {
    requestId: string;
    title: string;
    body: string;
    priority?: 0 | 1 | 2 | 3;
    startLine?: number;
    endLine?: number;
}
export interface CodeReviewCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "code-review";
    title: string;
    path: string;
    review: CodeReviewAnchor;
}
export interface TextCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "text";
    title: string;
    path?: string;
    content: string;
    language: BundledLanguage;
}
export interface PatchCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "patch";
    title: string;
    path?: string;
    patch: string;
}
export interface MultiFileDiffCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "multi-file-diff";
    title: string;
    path?: string;
    beforeContent: string;
    afterContent: string;
}
export interface ImageCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "image";
    title: string;
    path: string;
    mediaType: string;
}
export interface MediaCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "media";
    title: string;
    path: string;
    kind: MediaPreviewKind;
    mediaType: string;
    url?: string;
}
export interface PdfCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "pdf";
    title: string;
    path: string;
}
export interface PptxCodeViewerSource extends CodeViewerWorkspaceScope {
    type: "pptx";
    title: string;
    path: string;
    referenceNavigation?: PptxReferencePreviewNavigation;
}
export interface PptxReferencePreviewNavigation {
    requestId: string;
    pageIndex: number;
    expectedSourceFingerprint: string;
}
export type CodeViewerSource = FileCodeViewerSource | CodeReviewCodeViewerSource | TextCodeViewerSource | PatchCodeViewerSource | MultiFileDiffCodeViewerSource | ImageCodeViewerSource | MediaCodeViewerSource | PdfCodeViewerSource | PptxCodeViewerSource;
export declare function inferCodeLanguage(path?: string, contentHint?: string): BundledLanguage;
export declare function inferImageMediaType(path?: string): string | null;
export declare function inferMediaPreview(path?: string): Omit<MediaCodeViewerSource, "type" | "title" | "path"> | null;
export declare function isImagePreviewPath(path?: string): boolean;
export declare function isPdfPreviewPath(path?: string): boolean;
export declare function isPptxPreviewPath(path?: string): boolean;
export declare function getDiffSourceFileTarget(source: PatchCodeViewerSource | MultiFileDiffCodeViewerSource): string | null;
export declare function createDiffSourceFilePreviewSource(source: PatchCodeViewerSource | MultiFileDiffCodeViewerSource, fallbackWorkspacePath?: string): FileCodeViewerSource | null;
export declare function getToolCallCodePreview(toolCall: ChatToolCall, workspacePath: string): CodeViewerSource | null;
export declare function getToolCallCodeContentPreview(toolCall: ChatToolCall, workspacePath: string): TextCodeViewerSource | null;
//# sourceMappingURL=codeViewer.d.ts.map