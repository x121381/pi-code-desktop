import { type LexicalNode, type RangeSelection } from "lexical";
/** 编辑器文本用于光标；业务输出显式读取 canonical，不能覆写 TextNode 文本语义。 */
export declare function $getPromptMarkdown(node?: LexicalNode): string;
/** 与 Lexical RangeSelection 的段落/端点规则一致，仅将实际选中的 token 换为 canonical。 */
export declare function $getPromptSelectionMarkdown(selection: RangeSelection): string;
/** 剪切与复制都将相交 token 视为整体，但不能扩张仅触碰边界的选区。 */
export declare function $getAtomicPromptSelection(selection: RangeSelection): RangeSelection;
//# sourceMappingURL=promptSerialization.d.ts.map