import type { MarkdownSelectionTarget } from "@/lib/conversationSelectionReference.js";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { Theme } from "@/useTheme.js";
interface MarkdownPreviewContentProps {
    content: string;
    sourceKey?: string;
    sourceTitle?: string;
    sourcePath?: string;
    selectionTarget?: MarkdownSelectionTarget;
    workspacePath?: string;
    /** 应用主题（store 耦合剥离）：透传给 markdown 渲染，缺省按 "system" 兜底。 */
    theme?: Theme;
    /** 代码预览设置（store 耦合剥离）：透传给 markdown 渲染，需保持引用稳定。 */
    codePreviewSettings?: CodePreviewSettings;
    onOpenBrowserUrl?: (url: string) => void;
}
export declare function MarkdownPreviewContent({ content, sourceKey, sourceTitle, sourcePath, selectionTarget, workspacePath, theme, codePreviewSettings, onOpenBrowserUrl, }: MarkdownPreviewContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=previewPaneMarkdownContent.d.ts.map