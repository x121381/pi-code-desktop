import type { MentionItem } from "./mentionTypes.js";
export declare function buildFileMentionMarkdown(relativePath: string, label: string, kind?: "file" | "directory"): string;
export declare function buildSkillMentionMarkdown(label: string, skillPath?: string): string;
export declare function buildSubagentMentionMarkdown(label: string): string;
export declare function buildSessionMentionMarkdown(sessionId: string, label?: string): string;
export declare function buildPluginMentionMarkdown(label: string, pluginId: string): string;
export declare function buildMentionMarkdown(item: Pick<MentionItem, "category" | "data" | "label" | "value">): string;
export declare function renderMentionMarkdownAsPlainText(content: string): string;
type MentionTextPart = {
    type: "text";
    text: string;
} | {
    type: "file";
    label: string;
} | {
    type: "directory";
    label: string;
} | {
    type: "skill";
    label: string;
} | {
    type: "command";
    label: string;
} | {
    type: "subagent";
    label: string;
} | {
    type: "session";
    label: string;
} | {
    type: "plugin";
    label: string;
    pluginId?: string;
};
/**
 * 将技能 slug（如 code-review）格式化为聊天气泡中的可读标题（Code Review）。
 * 已是包含空格的短语时原样返回，避免破坏用户自定义展示名。
 */
export declare function formatSkillMentionDisplayLabel(label: string): string;
export declare function parseMentionMarkdown(content: string): MentionTextPart[];
export {};
//# sourceMappingURL=mentionMarkdown.d.ts.map