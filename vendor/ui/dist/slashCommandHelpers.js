/**
 * slashCommandHelpers — 纯函数辅助工具，供 SlashCommandPlugin.tsx 使用
 */
import { $getRoot, $getSelection, $isRangeSelection, $isTextNode } from "lexical";
import { mapSubagentsToMentionItemsForTest } from "./mentions/providers/subagentsMentionProvider.js";
import { mapSkillsToMentionItemsForTest } from "./mentions/providers/skillsMentionProvider.js";
import { extractActivePromptInputTrigger, getActivePromptInputTokenTailLength, } from "./lib/promptInputTriggers.js";
const APP_SLASH_SUGGESTION_ID_PREFIX = "app-slash:";
export function buildAppSlashCommandSuggestions(commands) {
    return commands.flatMap((command) => {
        const value = normalizeSlashCommandValue(command.value);
        if (!value) {
            return [];
        }
        return [
            {
                id: `${APP_SLASH_SUGGESTION_ID_PREFIX}${value}`,
                trigger: "/",
                value,
                label: `/${value}`,
                description: command.description,
                keywords: [...new Set([value, command.description, ...(command.keywords ?? [])])],
            },
        ];
    });
}
export function isAppSlashCommandSuggestion(suggestion) {
    return suggestion.id.startsWith(APP_SLASH_SUGGESTION_ID_PREFIX);
}
/**
 * `/side` 门禁：草稿态没有父 session 可挂 child，辅助对话自身不允许再开辅助对话，
 * 只读与手机 viewport 与固定入口保持一致地隐藏。
 */
export function shouldOfferSideSlashCommand(options) {
    return (!options.isDraft && !options.selectionSideChat && !options.readOnly && !options.isMobileViewport);
}
export function normalizeSlashCommandValue(name) {
    // ZCode Agent 在远端可能直接返回 "/init" 作为命令名。
    // UI 的 value 需要去掉前导斜杠，否则插入 markdown 时会变成 "//init"，并影响 / 面板匹配。
    return name.trim().replace(/^\/+/, "");
}
export function buildSlashSuggestions(commands) {
    return commands.flatMap((command) => {
        const value = normalizeSlashCommandValue(command.name);
        // UI 曾同时维护内建白名单、GLM `/goal` fallback 和 v4 追加目录，
        // CLI catalog 丢失时仍会显示部分命令，掩盖 `/init` 与自定义命令缺失。命令发现
        // 统一以 CLI protocol catalog 为权威，UI 不再追加命令或维护内建白名单。
        if (!value) {
            return [];
        }
        return [
            {
                id: `slash:${value}`,
                trigger: "/",
                value,
                label: command.inputHint?.trim() || `/${value}`,
                description: command.description,
                keywords: [...new Set([value, command.name, command.description, command.inputHint ?? ""])],
            },
        ];
    });
}
export function buildSubagentSuggestions(agents) {
    return mapSubagentsToMentionItemsForTest(agents).map((item) => mapSubagentMentionItemToSuggestion(item));
}
export function buildSkillSuggestions(skills, locale) {
    return mapSkillsToMentionItemsForTest(skills, locale).map((item) => ({
        id: item.id,
        trigger: "/",
        value: item.value,
        label: `$${item.value}`,
        description: item.description,
        keywords: [...new Set([...(item.keywords ?? []), "skill", "skills", item.value])],
        data: item.data,
    }));
}
function mapSubagentMentionItemToSuggestion(item) {
    return {
        id: item.id,
        trigger: "/",
        value: item.value,
        label: item.label,
        description: item.description,
        keywords: [...new Set([...(item.keywords ?? []), "subagent", "agent"])],
        data: item.data,
    };
}
export function replaceActiveSlashToken(textBeforeCursor, textAfterCursor, replacementToken) {
    const activeTrigger = extractActivePromptInputTrigger(textBeforeCursor);
    if (!activeTrigger || activeTrigger.trigger !== "/") {
        return null;
    }
    const tokenStart = textBeforeCursor.length - activeTrigger.query.length - 1;
    const tailLength = getActivePromptInputTokenTailLength(activeTrigger, textAfterCursor, replacementToken);
    const prefix = textBeforeCursor.slice(0, tokenStart);
    const suffix = textAfterCursor.slice(tailLength);
    return {
        cursorOffset: prefix.length + replacementToken.length + 1,
        text: `${prefix}${replacementToken} ${suffix}`,
    };
}
export function getTextAroundCursor() {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return null;
    }
    const anchor = selection.anchor;
    if (anchor.type !== "text") {
        return {
            textAfterCursor: "",
            textBeforeCursor: $getRoot().getTextContent(),
        };
    }
    const node = anchor.getNode();
    if (!$isTextNode(node)) {
        return null;
    }
    const textContent = node.getTextContent();
    return {
        textAfterCursor: textContent.slice(anchor.offset),
        textBeforeCursor: textContent.slice(0, anchor.offset),
    };
}
//# sourceMappingURL=slashCommandHelpers.js.map