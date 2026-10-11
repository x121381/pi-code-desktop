import type { BundledTheme, ThemedToken } from "shiki";
export interface TokenizedCode {
    tokens: ThemedToken[][];
    fg: string;
    bg: string;
}
export declare function shouldUseSyntaxHighlighting(language: string): boolean;
export declare const createRawCodeTokens: (code: string) => TokenizedCode;
export declare const highlightCode: (code: string, language: string, theme?: BundledTheme, callback?: (result: TokenizedCode) => void) => TokenizedCode | null;
//# sourceMappingURL=shikiHighlighter.d.ts.map