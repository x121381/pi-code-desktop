import type { BundledLanguage, BundledTheme } from "shiki";
import type { Ref, UIEventHandler } from "react";
import type { CodeCommentLabels } from "@/components/ui/code-viewer.js";
import type { CodePreviewSettings } from "@/store/index.js";
import type { CodeCommentPreview, CodeCommentRange } from "@/lib/codeCommentContext.js";
import type { Theme } from "@/useTheme.js";
interface CodeContentProps {
    code: string;
    language: BundledLanguage;
    codePreviewSettings: CodePreviewSettings;
    codeTheme: BundledTheme;
    /** 应用主题（store 耦合剥离）：透传给 Mermaid 预览，缺省按 "system" 兜底。 */
    theme?: Theme;
    wrapLongLines: boolean;
    firstLineNumber?: number;
    comments?: readonly CodeCommentPreview[];
    topComment?: CodeCommentPreview | null;
    topCommentShowRange?: boolean;
    topCommentNotice?: string;
    focusedRange?: CodeCommentRange | null;
    focusRequestId?: string;
    enableLineSelection?: boolean;
    enableGutterUtility?: boolean;
    labels?: Partial<CodeCommentLabels>;
    onSubmitCodeComment?: (params: {
        range: CodeCommentRange;
        selectedText: string;
        comment: string;
    }) => void;
    onDeleteCodeComment?: (commentId: string) => void;
    onScroll?: UIEventHandler<HTMLDivElement>;
    scrollContainerRef?: Ref<HTMLDivElement>;
    className?: string;
}
export declare function CodeContent({ code, language, codePreviewSettings, codeTheme, theme, wrapLongLines, firstLineNumber, comments, topComment, topCommentShowRange, topCommentNotice, focusedRange, focusRequestId, enableLineSelection, enableGutterUtility, labels, onSubmitCodeComment, onDeleteCodeComment, onScroll, scrollContainerRef, className, }: CodeContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=previewPaneCodeContent.d.ts.map