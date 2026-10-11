export const WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT = "zcode:web-element-context-add-to-chat";
export const WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT = "zcode:web-element-context-remove-from-chat";
const WEB_ELEMENT_CONTEXT_BLOCK_TITLE = "# Web page elements:";
const MAX_MARKDOWN_FIELD_LENGTH = 8_000;
export function createWebElementContextId() {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `web-element-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
export function getWebElementContextWorkspaceKey(workspacePath, workspaceIdentity) {
    return workspaceIdentity?.trim() || workspacePath;
}
export function isWebElementContextAddToChatEvent(event) {
    return (event.type === WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT &&
        "detail" in event &&
        typeof event.detail === "object" &&
        event.detail !== null);
}
export function isWebElementContextRemoveFromChatEvent(event) {
    return (event.type === WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT &&
        "detail" in event &&
        typeof event.detail === "object" &&
        event.detail !== null);
}
export function isWebElementContextPayload(payload) {
    const candidate = payload;
    return (typeof payload === "object" &&
        payload !== null &&
        typeof candidate.workspacePath === "string" &&
        candidate.workspacePath.length > 0 &&
        (candidate.workspaceIdentity === undefined ||
            typeof candidate.workspaceIdentity === "string") &&
        typeof candidate.pageUrl === "string" &&
        candidate.pageUrl.length > 0 &&
        typeof candidate.pageTitle === "string" &&
        typeof candidate.tagName === "string" &&
        candidate.tagName.length > 0 &&
        typeof candidate.capturedAt === "number");
}
function truncateMarkdownValue(value) {
    if (!value) {
        return "";
    }
    const normalized = value.trim();
    return normalized.length > MAX_MARKDOWN_FIELD_LENGTH
        ? `${normalized.slice(0, MAX_MARKDOWN_FIELD_LENGTH)}\n\n[truncated]`
        : normalized;
}
function appendOptionalLine(lines, label, value) {
    const normalized = truncateMarkdownValue(value);
    if (normalized) {
        lines.push(`${label}: ${normalized}`);
    }
}
function formatAttributes(attributes) {
    if (!attributes || Object.keys(attributes).length === 0) {
        return "";
    }
    return Object.entries(attributes)
        .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
        .join(" ");
}
function formatFont(style) {
    if (!style?.fontSize && !style?.fontFamily) {
        return "";
    }
    return [style.fontSize, style.fontFamily].filter(Boolean).join(" ");
}
function buildWebElementContextMarkdown(payload) {
    const lines = [
        "## Element",
        `URL: ${payload.pageUrl}`,
        `Title: ${payload.pageTitle || "(untitled)"}`,
        `Tag: ${payload.tagName.toLowerCase()}`,
    ];
    appendOptionalLine(lines, "Role", payload.role);
    appendOptionalLine(lines, "Accessible name", payload.accessibleName);
    appendOptionalLine(lines, "Selector", payload.selector);
    appendOptionalLine(lines, "XPath", payload.xpath);
    appendOptionalLine(lines, "Attributes", formatAttributes(payload.attributes));
    appendOptionalLine(lines, "Color", payload.style?.color);
    appendOptionalLine(lines, "Background", payload.style?.backgroundColor);
    appendOptionalLine(lines, "Font", formatFont(payload.style));
    appendOptionalLine(lines, "Font weight", payload.style?.fontWeight);
    appendOptionalLine(lines, "Display", payload.style?.display);
    if (payload.rect) {
        lines.push(`Rect: x=${Math.round(payload.rect.x)}, y=${Math.round(payload.rect.y)}, width=${Math.round(payload.rect.width)}, height=${Math.round(payload.rect.height)}`);
    }
    const text = truncateMarkdownValue(payload.text);
    if (text) {
        lines.push("", "Text:", "```", text, "```");
    }
    const nearbyText = truncateMarkdownValue(payload.nearbyText);
    if (nearbyText) {
        lines.push("", "Nearby context:", "```", nearbyText, "```");
    }
    const htmlExcerpt = truncateMarkdownValue(payload.htmlExcerpt);
    if (htmlExcerpt) {
        lines.push("", "HTML excerpt:", "```html", htmlExcerpt, "```");
    }
    return lines.join("\n");
}
export function buildPromptWithWebElementContexts(text, contexts) {
    const content = text.trimEnd();
    if (contexts.length === 0) {
        return content.trim();
    }
    const contextBlock = `${WEB_ELEMENT_CONTEXT_BLOCK_TITLE}\n\n${contexts
        .map((context, index) => buildWebElementContextMarkdown(context).replace("## Element", `## Element ${index + 1}`))
        .join("\n\n")}`;
    return `${content}${content ? "\n\n" : ""}${contextBlock}`.trim();
}
function readField(rawItem, label) {
    const match = new RegExp(`^${label}:\\s*(.*)$`, "m").exec(rawItem);
    return match?.[1]?.trim() ?? "";
}
function readFencedSection(rawItem, label) {
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = new RegExp(`${escapedLabel}:\\s*\\n\`\`\`(?:html)?\\n([\\s\\S]*?)\\n\`\`\``, "m").exec(rawItem);
    return match?.[1]?.trim() ?? "";
}
function parseFontSummary(font) {
    const match = /^([0-9.]+(?:px|rem|em|pt|%))\s+(.+)$/iu.exec(font);
    if (!match) {
        return {
            fontFamily: font,
        };
    }
    const fontSize = match[1];
    const fontFamily = match[2];
    if (!fontSize || !fontFamily) {
        return {
            fontFamily: font,
        };
    }
    return {
        fontSize,
        fontFamily,
    };
}
function readStyleSummary(rawItem) {
    const color = readField(rawItem, "Color");
    const backgroundColor = readField(rawItem, "Background");
    const font = readField(rawItem, "Font");
    const fontWeight = readField(rawItem, "Font weight");
    const display = readField(rawItem, "Display");
    const style = {
        ...(color ? { color } : {}),
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(font ? parseFontSummary(font) : {}),
        ...(fontWeight ? { fontWeight } : {}),
        ...(display ? { display } : {}),
    };
    return Object.keys(style).length > 0 ? style : undefined;
}
function parseElementItem(rawItem, index, workspacePath, workspaceIdentity) {
    const pageUrl = readField(rawItem, "URL");
    const pageTitle = readField(rawItem, "Title");
    const tagName = readField(rawItem, "Tag");
    if (!pageUrl || !tagName) {
        return null;
    }
    return {
        id: `parsed-web-element-${index + 1}-${tagName}`,
        workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        pageUrl,
        pageTitle: pageTitle === "(untitled)" ? "" : pageTitle,
        tagName,
        role: readField(rawItem, "Role") || undefined,
        accessibleName: readField(rawItem, "Accessible name") || undefined,
        selector: readField(rawItem, "Selector") || undefined,
        xpath: readField(rawItem, "XPath") || undefined,
        text: readFencedSection(rawItem, "Text") || undefined,
        nearbyText: readFencedSection(rawItem, "Nearby context") || undefined,
        htmlExcerpt: readFencedSection(rawItem, "HTML excerpt") || undefined,
        style: readStyleSummary(rawItem),
        capturedAt: 0,
    };
}
export function parsePromptWebElementContexts(content, options) {
    const blockMatch = /(?:^|\n\n)# Web page elements:\s*\n\n([\s\S]*?)\s*$/.exec(content);
    if (!blockMatch || blockMatch.index < 0) {
        return {
            visibleContent: content,
            webElementContexts: [],
        };
    }
    const rawBlock = blockMatch[1];
    if (rawBlock === undefined) {
        return {
            visibleContent: content,
            webElementContexts: [],
        };
    }
    const rawItems = rawBlock
        .split(/\n(?=## Element(?:\s+\d+)?\n)/)
        .map((item) => item.trim())
        .filter(Boolean);
    const webElementContexts = rawItems
        .map((item, index) => parseElementItem(item, index, options.workspacePath, options.workspaceIdentity))
        .filter((item) => item !== null);
    if (webElementContexts.length === 0) {
        return {
            visibleContent: content,
            webElementContexts: [],
        };
    }
    return {
        visibleContent: content.slice(0, blockMatch.index).trimEnd(),
        webElementContexts,
    };
}
export function dispatchWebElementContextAddToChat(payload) {
    window.dispatchEvent(new CustomEvent(WEB_ELEMENT_CONTEXT_ADD_TO_CHAT_EVENT, {
        detail: payload,
    }));
}
export function dispatchWebElementContextRemoveFromChat(payload) {
    window.dispatchEvent(new CustomEvent(WEB_ELEMENT_CONTEXT_REMOVE_FROM_CHAT_EVENT, {
        detail: payload,
    }));
}
//# sourceMappingURL=webElementContext.js.map