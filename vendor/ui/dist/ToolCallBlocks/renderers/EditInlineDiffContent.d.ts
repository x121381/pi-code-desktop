import { buildHighlightedLightweightDiffCode, getHighlightedLightweightDiffLine } from "@/components/ui/highlighted-lightweight-diff-preview.js";
import { type PatchCodeViewerSource } from "@/lib/codeViewer.js";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { Theme } from "@/useTheme.js";
export { buildHighlightedLightweightDiffCode as buildInlineDiffHighlightCode, getHighlightedLightweightDiffLine as getInlineDiffHighlightLine, };
export declare const EditInlineDiffContent: import("react").MemoExoticComponent<({ preview, theme, codePreviewSettings, }: {
    preview: PatchCodeViewerSource;
    /**
     * 应用主题（store 耦合剥离）：决定 diff 高亮取 light/dark 主题。
     * 由调用方（tool call 渲染上下文）传入；默认 "system" 跟随操作系统兜底。
     */
    theme?: Theme;
    /** 代码预览设置（store 耦合剥离）：由调用方传入，需保持引用稳定。 */
    codePreviewSettings?: CodePreviewSettings;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=EditInlineDiffContent.d.ts.map