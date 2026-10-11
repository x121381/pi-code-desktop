import type { HTMLAttributes } from "react";
import type { Theme } from "@/useTheme.js";
export interface MermaidBlockProps extends HTMLAttributes<HTMLDivElement> {
    code: string;
    /**
     * 应用主题（store 耦合剥离）：由调用方从上层状态传入。
     * 默认 "system" 跟随操作系统，供旧调用点/待删代码兜底。
     */
    theme?: Theme;
    onOpenPreview?: () => void;
    onPreviewSvgChange?: (svg: string | null) => void;
}
export declare function MermaidBlock({ code, className, theme, onOpenPreview, onPreviewSvgChange, ...props }: MermaidBlockProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=mermaid-block.d.ts.map