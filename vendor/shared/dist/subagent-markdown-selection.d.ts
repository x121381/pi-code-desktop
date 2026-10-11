import { type ModelSelection } from "./model-selection.js";
/** Markdown 的正式字段始终为字符串 model + thoughtLevel；不解释中间态字段。 */
export declare function parseSubagentMarkdownSelection(frontmatter: Record<string, unknown>): ModelSelection | undefined;
/** 普通 ID 保持可读；分隔符或 custom: 前缀会与解析格式冲突，须用既有编码无损保存。 */
export declare function formatSubagentMarkdownModel(selection: ModelSelection): string;
/** 只替换 frontmatter 单行 model 的 Provider 值，不重建 YAML、正文或无关格式。 */
export declare function migrateSubagentMarkdownProvider(content: string): string;
//# sourceMappingURL=subagent-markdown-selection.d.ts.map