import { Button } from "../ui/button.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select.js";
import type { ComponentProps, HTMLAttributes } from "react";
import type { BundledTheme } from "shiki";
import type { Theme } from "@/useTheme.js";
type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
    code: string;
    language: string;
    enableSyntaxHighlighting?: boolean;
    showLineNumbers?: boolean;
    theme?: BundledTheme;
    /**
     * 应用主题（store 耦合剥离）：仅透传给 Mermaid 渲染分支；
     * `theme` 已被 shiki 高亮主题占用，故另起名 appTheme。缺省时 Mermaid 按 "system" 兜底。
     */
    appTheme?: Theme;
    wrapLongLines?: boolean;
    fontSizePx?: number;
    renderMermaid?: boolean;
    /** 正文独立限高，避免滚动时把 Header 的复制/换行按钮一起卷走。 */
    contentClassName?: string;
    /**
     * 行定位透传（CodeViewer 已实现滚动+高亮，CodeBlock 也一并暴露）：
     * focusedRange 高亮行区间，focusRequestId 变化时触发滚动到该区间。
     */
    focusedRange?: {
        startLine: number;
        endLine: number;
    } | null;
    focusRequestId?: string;
    /** 行号着警示色的行（透传 CodeViewer `markedLines`），编译反馈卡标出被诊断指到的行。 */
    markedLines?: readonly number[];
};
export declare const CodeBlockContainer: ({ className, language, style, ...props }: HTMLAttributes<HTMLDivElement> & {
    language: string;
}) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockHeaderProps = HTMLAttributes<HTMLDivElement> & {
    showWrapButton?: boolean;
    displayFile?: string;
    language?: string;
};
export declare const CodeBlockHeader: ({ children, className, displayFile, language, showWrapButton, ...props }: CodeBlockHeaderProps) => import("react/jsx-runtime").JSX.Element;
export declare const CodeBlockTitle: ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element;
export declare const CodeBlockFilename: ({ children, className, ...props }: HTMLAttributes<HTMLSpanElement>) => import("react/jsx-runtime").JSX.Element;
export declare const CodeBlockActions: ({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) => import("react/jsx-runtime").JSX.Element;
export declare const CodeBlock: ({ code, enableSyntaxHighlighting, language, showLineNumbers, theme, appTheme, wrapLongLines, fontSizePx, renderMermaid, focusedRange, focusRequestId, markedLines, className, children, contentClassName, ...props }: CodeBlockProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockWrapButtonProps = ComponentProps<typeof Button>;
export declare const CodeBlockWrapButton: ({ "aria-label": ariaLabel, children, className, onClick, title, ...props }: CodeBlockWrapButtonProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockMermaidPreviewButtonProps = ComponentProps<typeof Button>;
export declare const CodeBlockMermaidPreviewButton: ({ "aria-label": ariaLabel, children, className, onClick, title, ...props }: CodeBlockMermaidPreviewButtonProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
    onCopy?: () => void;
    onError?: (error: Error) => void;
    timeout?: number;
};
export declare const CodeBlockCopyButton: ({ "aria-label": ariaLabel, onCopy, onError, title, timeout, children, className, ...props }: CodeBlockCopyButtonProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockLanguageSelectorProps = ComponentProps<typeof Select>;
export declare const CodeBlockLanguageSelector: (props: CodeBlockLanguageSelectorProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockLanguageSelectorTriggerProps = ComponentProps<typeof SelectTrigger>;
export declare const CodeBlockLanguageSelectorTrigger: ({ className, ...props }: CodeBlockLanguageSelectorTriggerProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockLanguageSelectorValueProps = ComponentProps<typeof SelectValue>;
export declare const CodeBlockLanguageSelectorValue: (props: CodeBlockLanguageSelectorValueProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockLanguageSelectorContentProps = ComponentProps<typeof SelectContent>;
export declare const CodeBlockLanguageSelectorContent: ({ align, ...props }: CodeBlockLanguageSelectorContentProps) => import("react/jsx-runtime").JSX.Element;
export type CodeBlockLanguageSelectorItemProps = ComponentProps<typeof SelectItem>;
export declare const CodeBlockLanguageSelectorItem: (props: CodeBlockLanguageSelectorItemProps) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=code-block.d.ts.map