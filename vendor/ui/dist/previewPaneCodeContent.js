import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "./components/lib/utils.js";
import { MermaidBlock } from "./components/ai-elements/mermaid-block.js";
import { CodeViewer } from "./components/ui/code-viewer.js";
import { isMermaidLanguage } from "./lib/mermaidLanguage.js";
export function CodeContent({ code, language, codePreviewSettings, codeTheme, theme, wrapLongLines, firstLineNumber, comments, topComment, topCommentShowRange, topCommentNotice, focusedRange, focusRequestId, enableLineSelection = false, enableGutterUtility = false, labels, onSubmitCodeComment, onDeleteCodeComment, onScroll, scrollContainerRef, className, }) {
    if (isMermaidLanguage(language)) {
        return (_jsx("div", { ref: scrollContainerRef, className: cn("h-full w-full overflow-auto bg-background p-4", className), onScroll: onScroll, children: _jsx(MermaidBlock, { code: code, theme: theme, className: "min-h-full rounded-xl border border-border" }) }));
    }
    return (_jsx(CodeViewer, { code: code, language: language, showLineNumbers: codePreviewSettings.showLineNumbers, theme: codeTheme, wrapLongLines: wrapLongLines, fontSizePx: codePreviewSettings.fontSizePx, firstLineNumber: firstLineNumber, comments: comments, topComment: topComment, topCommentShowRange: topCommentShowRange, topCommentNotice: topCommentNotice, focusedRange: focusedRange, focusRequestId: focusRequestId, enableLineSelection: enableLineSelection, enableGutterUtility: enableGutterUtility, labels: labels, onSubmitCodeComment: onSubmitCodeComment, onDeleteCodeComment: onDeleteCodeComment, onScroll: onScroll, scrollContainerRef: scrollContainerRef, className: className }));
}
//# sourceMappingURL=previewPaneCodeContent.js.map