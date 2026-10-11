import type { HTMLAttributes, ReactNode } from "react";
import type { CodePreviewSettings } from "@/store/index.js";
export type LightweightDiffLineKind = "added" | "removed" | "context";
export interface LightweightDiffLineParts {
    content: string;
    kind: LightweightDiffLineKind;
    marker: string;
    raw: string;
}
export interface LightweightDiffPreviewProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    codePreviewSettings: Pick<CodePreviewSettings, "fontSizePx" | "showLineNumbers" | "wrapLongLines">;
    lines: readonly string[];
    renderLineContent?: (line: LightweightDiffLineParts, index: number) => ReactNode;
}
export declare function getLightweightDiffLineParts(line: string): LightweightDiffLineParts;
export declare function LightweightDiffPreview({ className, codePreviewSettings, lines, renderLineContent, ...props }: LightweightDiffPreviewProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=lightweight-diff-preview.d.ts.map