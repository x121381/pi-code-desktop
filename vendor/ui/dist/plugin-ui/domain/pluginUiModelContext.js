import { formatPluginDisplayName } from "./pluginDisplayName.js";
export const PLUGIN_UI_MODEL_CONTEXT_BLOCK_TITLE = "# Plugin context:";
/** 单条上下文文本上限；超出截断并追加省略号，避免插件把整页塞进 prompt。 */
export const PLUGIN_UI_MODEL_CONTEXT_MAX_CHARS = 16 * 1024;
const ITEM_HEADER = /^## Plugin (\S+) \(([^)]+)\)\s*$/m;
function truncateText(text) {
    return text.length > PLUGIN_UI_MODEL_CONTEXT_MAX_CHARS
        ? `${text.slice(0, PLUGIN_UI_MODEL_CONTEXT_MAX_CHARS)}…`
        : text;
}
function buildItem(context) {
    const lines = [
        `## Plugin ${context.pluginId} (${context.toolCallId})`,
        "",
        truncateText(context.text),
    ];
    if (context.structuredContent !== undefined) {
        lines.push("", "```json", JSON.stringify(context.structuredContent, null, 2), "```");
    }
    return lines.join("\n");
}
export function buildPromptWithPluginUiContexts(text, contexts) {
    const content = text.trimEnd();
    if (contexts.length === 0)
        return content.trim();
    const block = `${PLUGIN_UI_MODEL_CONTEXT_BLOCK_TITLE}\n\n${contexts.map(buildItem).join("\n\n")}`;
    return `${content}${content ? "\n\n" : ""}${block}`.trim();
}
function parseItem(raw, index) {
    const header = ITEM_HEADER.exec(raw);
    if (!header)
        return null;
    const pluginId = header[1] ?? "";
    const toolCallId = header[2] ?? "";
    if (!pluginId || !toolCallId)
        return null;
    let body = raw.slice(header.index + header[0].length).trim();
    let structuredContent;
    const fence = /\n?```json\n([\s\S]*?)\n```\s*$/.exec(body);
    if (fence) {
        try {
            structuredContent = JSON.parse(fence[1] ?? "");
            body = body.slice(0, fence.index).trim();
        }
        catch {
            // 非法 JSON 当作正文保留。
        }
    }
    return {
        id: `plugin-ui-context:${toolCallId}:${index}`,
        sessionId: "",
        pluginId,
        toolCallId,
        text: body,
        ...(structuredContent !== undefined ? { structuredContent } : {}),
    };
}
/** 只识别 prompt 尾块；与其它四类上下文一样，序列化顺序与解析顺序严格相反。 */
export function parsePromptPluginUiContexts(content) {
    const match = /(?:^|\n\n)# Plugin context:\s*\n\n([\s\S]*?)\s*$/.exec(content);
    if (!match || match[1] === undefined)
        return { visibleContent: content, pluginUiContexts: [] };
    const items = match[1]
        .split(/\n(?=## Plugin \S+ \([^)]+\)\s*\n)/)
        .map((item) => item.trim())
        .filter(Boolean)
        .map(parseItem)
        .filter((item) => item !== null);
    if (items.length === 0)
        return { visibleContent: content, pluginUiContexts: [] };
    return {
        visibleContent: content.slice(0, match.index).trimEnd(),
        pluginUiContexts: items,
    };
}
export function formatPluginUiContextLabel(context) {
    return formatPluginDisplayName(context.pluginId);
}
//# sourceMappingURL=pluginUiModelContext.js.map