import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { memo, useState } from "react";
import { Bot, Cable, GoalIcon, MessagesSquare, ScrollText, SquareSlash, WandSparkles, } from "lucide-react";
import { cn } from "@/components/lib/utils.js";
import { FileDisplayInline } from "@/lib/fileDisplay.js";
import { isTrustedPluginIconSource } from "@/lib/pluginIconSource.js";
import { usePluginReferenceIconProjection } from "@/v4/pluginReferenceIconContext.js";
import { getPromptMentionVariantClassName, PROMPT_MENTION_BASE_CLASS_NAME, } from "@/mentions/mentionChip.js";
import { formatSkillMentionDisplayLabel, parseMentionMarkdown, } from "@/mentions/mentionMarkdown.js";
import { parseV4VisibleSlashCommand } from "@/v4/slashCommands.js";
const GOAL_QUERY_TOKEN_PATTERN = /^(\s*)(\/(?:goal|target))(?=\s|$)([\s\S]*)$/i;
const EMPTY_ATTACHMENTS = [];
/**
 * 只解析发送入口会消费的 goal query；普通正文和携带附件的同名文本保持原样。
 * 原因：用户消息展示不能仅凭包含 `/goal` 就重猜 command intent，否则上下文 prompt
 * 在隐藏附加块后会被误画成 goal 控制命令。
 */
export function parseV4UserInputGoalQuery(text, attachments = EMPTY_ATTACHMENTS, contextAttachmentCount = 0) {
    const command = parseV4VisibleSlashCommand(text, attachments, {
        contextAttachmentCount,
    });
    if (!command || command.kind === "compact")
        return null;
    const match = GOAL_QUERY_TOKEN_PATTERN.exec(text);
    if (!match)
        return null;
    return {
        leadingText: match[1] ?? "",
        commandText: match[2] ?? "",
        trailingText: match[3] ?? "",
    };
}
function normalizeCommandMentionLabel(label) {
    return label.trim().replace(/^\/+/, "").toLowerCase();
}
function mentionClassName(category) {
    return cn("mx-0.5 max-w-full", PROMPT_MENTION_BASE_CLASS_NAME, 
    // userInput 正文使用 text-ui-base，与 assistant 消息体保持一致。
    "text-ui-base leading-6", getPromptMentionVariantClassName(category));
}
function V4UserInputMention({ part, authoritativeGoal, pluginIcon, }) {
    if (part.type === "file" || part.type === "directory") {
        return (_jsx("span", { className: mentionClassName("files"), children: _jsx(FileDisplayInline, { path: part.label, options: {
                    className: "inline-flex min-w-0 max-w-full items-center gap-1 align-middle",
                    iconSize: 16,
                    kind: part.type === "directory" ? "directory" : "file",
                    fileNameClassName: "truncate text-ui-base leading-6 font-medium text-current",
                } }) }));
    }
    if (part.type === "skill") {
        return (_jsxs("span", { className: mentionClassName("skills"), children: [_jsx(WandSparkles, { "aria-hidden": "true", className: "size-4 shrink-0" }), formatSkillMentionDisplayLabel(part.label)] }));
    }
    if (part.type === "session") {
        return (_jsxs("span", { className: mentionClassName("sessions"), children: [_jsx(MessagesSquare, { "aria-hidden": "true", className: "size-4 shrink-0" }), part.label] }));
    }
    if (part.type === "plugin") {
        // Plugin 引用在气泡里渲染为 chip：不进 file 分支、不可作外链打开。
        return (_jsxs("span", { className: mentionClassName("plugins"), "data-plugin-mention-id": part.pluginId, children: [_jsx(PluginUserMessageIcon, { src: pluginIcon }), part.label] }));
    }
    if (part.type === "subagent") {
        return (_jsxs("span", { className: mentionClassName("subagents"), children: [_jsx(Bot, { "aria-hidden": "true", className: "size-4 shrink-0", strokeWidth: 1.5 }), part.label] }));
    }
    const commandName = normalizeCommandMentionLabel(part.label);
    if ((commandName === "goal" || commandName === "target") && !authoritativeGoal) {
        // 旧版纯文本嗅探会把带附件的 `/goal` 普通 prompt 也画成控制命令。
        // V4 只允许发送入口确认的首个 goal token 使用特殊 UI，其余情况必须保持用户原文。
        return `/${part.label}`;
    }
    return (_jsxs("span", { ...(authoritativeGoal ? { "data-v4-user-input-command": "goal" } : {}), className: mentionClassName("commands"), children: [commandName === "goal" || commandName === "target" ? (_jsx(GoalIcon, { "aria-hidden": "true", className: "size-4 shrink-0" })) : commandName === "compact" ? (_jsx(ScrollText, { "aria-hidden": "true", className: "size-4 shrink-0" })) : (_jsx(SquareSlash, { "aria-hidden": "true", className: "size-4 shrink-0" })), part.label] }));
}
function PluginUserMessageIcon({ src }) {
    const [failedSrc, setFailedSrc] = useState(null);
    const showImage = isTrustedPluginIconSource(src) && failedSrc !== src;
    if (!showImage) {
        return _jsx(Cable, { "aria-hidden": "true", className: "size-4 shrink-0" });
    }
    return (_jsx("img", { src: src, alt: "", "aria-hidden": "true", draggable: false, "data-plugin-mention-icon": "true", className: "inline-block size-4 shrink-0 rounded-sm object-contain align-middle", onError: () => setFailedSrc(src ?? null) }));
}
export const ConversationUserInputContent = memo(function ConversationUserInputContent({ text, attachments = EMPTY_ATTACHMENTS, contextAttachmentCount = 0, }) {
    const pluginIconProjection = usePluginReferenceIconProjection();
    const goalQuery = parseV4UserInputGoalQuery(text, attachments, contextAttachmentCount);
    const parts = parseMentionMarkdown(text);
    const authoritativeGoalPartIndex = goalQuery
        ? parts.findIndex((part) => part.type === "command" &&
            ["goal", "target"].includes(normalizeCommandMentionLabel(part.label)))
        : -1;
    return (_jsx(_Fragment, { children: parts.map((part, index) => {
            if (part.type === "text") {
                return part.text;
            }
            return (_jsx(V4UserInputMention, { part: part, authoritativeGoal: index === authoritativeGoalPartIndex, pluginIcon: part.type === "plugin" && part.pluginId
                    ? pluginIconProjection?.iconByPluginId.get(part.pluginId)
                    : undefined }, `${part.type}-${index}`));
        }) }));
});
//# sourceMappingURL=ConversationUserInputContent.js.map