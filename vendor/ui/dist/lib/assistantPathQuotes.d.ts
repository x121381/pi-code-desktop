export declare function isBalancedAssistantPathQuotePair(opening: string, closing: string): boolean;
export declare function isAssistantPathQuoteCharacter(character: string | undefined): boolean;
/**
 * 仅去掉文件路径外围成对引号；不匹配时保留原文，避免把异常模型输出
 * 或文件名中的引号静默改写成另一个路径。
 */
export declare function stripBalancedAssistantPathQuotes(value: string): string;
//# sourceMappingURL=assistantPathQuotes.d.ts.map