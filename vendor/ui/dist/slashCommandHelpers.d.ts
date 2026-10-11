import type { AgentSummary, Locale, SkillSummary, ZCodeSlashCommand } from "@zcode/shared";
import type { PromptInputSuggestionItem } from "./lib/promptInputTriggers.js";
export interface SlashCommandPluginProps {
    container?: HTMLElement | null;
    workspacePath: string;
    workspaceIdentity?: string;
    /** 已有 Session 的 id；null/undefined 表示新建草稿，决定 Skill catalog authority。 */
    sessionId?: string | null;
    disabled?: boolean;
    excludedCommandNames?: readonly string[];
    /**
     * App 层本地命令（如 `/side`）。命令目录仍以 CLI catalog 为权威；这里只允许渲染层
     * 追加"选中即执行 UI 行为"的命令，不参与发送，也不写回 CLI 命令列表。
     */
    appCommands?: readonly AppSlashCommand[];
}
/** App 层斜杠命令：选中即执行 UI 行为（不插入 mention、不发送）。 */
export interface AppSlashCommand {
    /** 命令值（不含 `/`），如 "side"。 */
    value: string;
    /** 本地化描述，直接展示在 `/` 面板。 */
    description: string;
    /** 额外搜索关键词；应同时包含中英文别名，保证两种输入习惯都能搜到。 */
    keywords?: readonly string[];
    /** 选中命令后立即执行的 UI 行为。 */
    run: () => void;
}
export declare function buildAppSlashCommandSuggestions(commands: readonly AppSlashCommand[]): PromptInputSuggestionItem[];
export declare function isAppSlashCommandSuggestion(suggestion: PromptInputSuggestionItem): boolean;
/**
 * `/side` 门禁：草稿态没有父 session 可挂 child，辅助对话自身不允许再开辅助对话，
 * 只读与手机 viewport 与固定入口保持一致地隐藏。
 */
export declare function shouldOfferSideSlashCommand(options: {
    isDraft: boolean;
    selectionSideChat: boolean;
    readOnly: boolean;
    isMobileViewport: boolean;
}): boolean;
export declare function normalizeSlashCommandValue(name: string): string;
export declare function buildSlashSuggestions(commands: ZCodeSlashCommand[]): PromptInputSuggestionItem[];
export declare function buildSubagentSuggestions(agents: Array<Pick<AgentSummary, "id" | "name" | "description" | "path" | "scope" | "source" | "enabled" | "modelSelection">>): PromptInputSuggestionItem[];
export declare function buildSkillSuggestions(skills: Array<Pick<SkillSummary, "id" | "name" | "description" | "path" | "scope" | "pluginName">>, locale?: Locale): PromptInputSuggestionItem[];
export declare function replaceActiveSlashToken(textBeforeCursor: string, textAfterCursor: string, replacementToken: string): {
    cursorOffset: number;
    text: string;
} | null;
export declare function getTextAroundCursor(): {
    textAfterCursor: string;
    textBeforeCursor: string;
} | null;
//# sourceMappingURL=slashCommandHelpers.d.ts.map