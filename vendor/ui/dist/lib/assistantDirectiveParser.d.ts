export interface ParsedAssistantDirective {
    end: number;
    name: string;
    parameters: Readonly<Record<string, string>> | null;
    raw: string;
    start: number;
}
export type AssistantTextRange = readonly [start: number, end: number];
export interface AssistantDirectiveSyntaxOptions {
    allowSmartQuotes?: boolean;
    allowSingleColon?: boolean;
    allowTripleColon?: boolean;
}
export interface AssistantDirectivePrefixOptions {
    minimumSingleColonPrefixLength?: number;
    singleColonDirectiveNames?: readonly string[];
    tripleColonDirectiveNames?: readonly string[];
}
export declare function extractAssistantDirectives(content: string, directiveName: string, options?: AssistantDirectiveSyntaxOptions): ParsedAssistantDirective[];
export declare function findMarkdownCodeRanges(content: string): AssistantTextRange[];
export declare function overlapsAssistantTextRanges(start: number, end: number, ranges: readonly AssistantTextRange[]): boolean;
export declare function findUnclosedAssistantDirectiveStart(content: string, directiveName: string, protectedRanges?: readonly AssistantTextRange[], options?: AssistantDirectiveSyntaxOptions & {
    isParameterPrefix?: (source: string) => boolean;
}): number | null;
/**
 * 流式尾部可能刚开始输出特化 directive 时，先把仍然匹配协议名称前缀的内容暂存。
 * 只检查文末连续尾部，且跳过 Markdown 代码范围；一旦前缀分叉，返回 null 让正文照常显示。
 */
export declare function findAssistantDirectivePrefixStart(content: string, directiveNames: readonly string[], protectedRanges?: readonly AssistantTextRange[], options?: AssistantDirectivePrefixOptions): number | null;
//# sourceMappingURL=assistantDirectiveParser.d.ts.map