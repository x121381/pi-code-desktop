export function splitMarkdownFrontmatter(content) {
    const normalized = content.replace(/^\uFEFF/u, "");
    if (!normalized.startsWith("---")) {
        return { body: normalized };
    }
    const lines = normalized.split(/\r?\n/u);
    if (lines[0]?.trim() !== "---")
        return { body: normalized };
    const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
    if (endIndex < 0)
        return { body: normalized };
    return {
        frontmatter: lines.slice(1, endIndex).join("\n"),
        body: lines.slice(endIndex + 1).join("\n"),
    };
}
export function parseAgentFrontmatter(frontmatter) {
    const { bareValueKeys, invalidNestedListKeys, values } = parseLooseFrontmatter(frontmatter);
    if (bareValueKeys.has("tools")) {
        delete values.tools;
    }
    return {
        mcpServers: parseMcpServerNames(values.mcpServers, Object.prototype.hasOwnProperty.call(values, "mcpServers"), bareValueKeys.has("mcpServers"), invalidNestedListKeys.has("mcpServers")),
        values,
    };
}
function parseLooseFrontmatter(frontmatter) {
    const bareValueKeys = new Set();
    const invalidNestedListKeys = new Set();
    const values = {};
    const lines = frontmatter.split(/\r?\n/u);
    let pendingListKey;
    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        if (!line.trim() || line.trimStart().startsWith("#"))
            continue;
        const listMatch = line.match(/^\s*-\s+(.*)$/u);
        if (listMatch && pendingListKey) {
            bareValueKeys.delete(pendingListKey);
            const rawListItem = listMatch[1] ?? "";
            if (pendingListKey === "mcpServers" && isUnquotedMappingValue(rawListItem)) {
                invalidNestedListKeys.add(pendingListKey);
            }
            const existing = Array.isArray(values[pendingListKey])
                ? values[pendingListKey]
                : [];
            values[pendingListKey] = [
                ...existing,
                pendingListKey === "mcpServers"
                    ? parseMcpServerListItem(rawListItem)
                    : parseScalarValue(rawListItem),
            ];
            continue;
        }
        if (pendingListKey && /^\s+/u.test(rawLine)) {
            // 块状 mapping 不是 server-name 列表，不能被空数组吞掉后扩大 child MCP scope。
            invalidNestedListKeys.add(pendingListKey);
            pendingListKey = undefined;
            continue;
        }
        pendingListKey = undefined;
        const keyValue = line.match(/^([A-Za-z][A-Za-z0-9_-]*)\s*:\s*(.*)$/u);
        if (!keyValue)
            continue;
        const key = keyValue[1];
        const rawValue = keyValue[2] ?? "";
        if (rawValue.trim() === "") {
            values[key] = [];
            bareValueKeys.add(key);
            pendingListKey = key;
            continue;
        }
        if (key === "mcpServers" && hasUnquotedInlineMappingItem(rawValue)) {
            invalidNestedListKeys.add(key);
        }
        values[key] = parseScalarValue(rawValue, key === "mcpServers");
    }
    return { bareValueKeys, invalidNestedListKeys, values };
}
function parseMcpServerNames(value, isConfigured, hasBareValue, hasInvalidNestedValue) {
    if (!isConfigured)
        return undefined;
    if (!Array.isArray(value) || hasBareValue || hasInvalidNestedValue)
        return null;
    const names = [];
    for (const item of value) {
        if (typeof item !== "string")
            return null;
        const name = item.trim();
        if (name.length === 0)
            return null;
        names.push(name);
    }
    return names;
}
function hasUnquotedInlineMappingItem(rawValue) {
    const value = stripInlineComment(rawValue.trim());
    if (!value.startsWith("[") || !value.endsWith("]"))
        return false;
    return splitTopLevelList(value.slice(1, -1), true).some(isUnquotedMappingValue);
}
function isUnquotedMappingValue(rawValue) {
    const value = stripInlineComment(rawValue.trim());
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return false;
    }
    return (value.startsWith("{") && value.endsWith("}")) || /^[^:]+:(?:\s|$)/u.test(value);
}
function parseMcpServerListItem(rawValue) {
    const value = stripInlineComment(rawValue.trim());
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return unquoteScalar(value);
    }
    if (value.startsWith("[") && value.endsWith("]"))
        return null;
    if (/^(?:null|~)$/iu.test(value))
        return null;
    if (/^(?:true|false)$/iu.test(value))
        return value.toLowerCase() === "true";
    if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/iu.test(value)) {
        return Number(value);
    }
    return value;
}
function parseScalarValue(rawValue, parseInlineItemScalars = false) {
    const value = stripInlineComment(rawValue.trim());
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    if (/^\d+$/u.test(value))
        return Number(value);
    if (value.startsWith("[") && value.endsWith("]")) {
        return splitTopLevelList(value.slice(1, -1), parseInlineItemScalars, parseInlineItemScalars).map((item) => parseInlineItemScalars
            ? parseMcpServerListItem(item)
            : unquoteScalar(stripInlineComment(item.trim())));
    }
    if (value.startsWith("{") && value.endsWith("}")) {
        try {
            return JSON.parse(value);
        }
        catch {
            return value;
        }
    }
    return unquoteScalar(value);
}
function stripInlineComment(value) {
    let quote;
    for (let index = 0; index < value.length; index += 1) {
        const char = value[index];
        if ((char === '"' || char === "'") && value[index - 1] !== "\\") {
            quote = quote === char ? undefined : (quote ?? char);
        }
        if (!quote && char === "#" && /\s/u.test(value[index - 1] ?? "")) {
            return value.slice(0, index).trimEnd();
        }
    }
    return value;
}
function unquoteScalar(value) {
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    return value;
}
function splitTopLevelList(value, trackContainerDepth = false, preserveEmptyItems = false) {
    const items = [];
    let current = "";
    let quote;
    let braceDepth = 0;
    let bracketDepth = 0;
    let parenDepth = 0;
    for (const char of value) {
        if ((char === '"' || char === "'") && !quote) {
            quote = char;
            current += char;
            continue;
        }
        if (quote === char) {
            quote = undefined;
            current += char;
            continue;
        }
        if (!quote && char === "(")
            parenDepth += 1;
        if (!quote && char === ")")
            parenDepth = Math.max(0, parenDepth - 1);
        if (!quote && trackContainerDepth && char === "{")
            braceDepth += 1;
        if (!quote && trackContainerDepth && char === "}")
            braceDepth = Math.max(0, braceDepth - 1);
        if (!quote && trackContainerDepth && char === "[")
            bracketDepth += 1;
        if (!quote && trackContainerDepth && char === "]")
            bracketDepth = Math.max(0, bracketDepth - 1);
        if (!quote && parenDepth === 0 && braceDepth === 0 && bracketDepth === 0 && char === ",") {
            if (current.trim() || preserveEmptyItems)
                items.push(current.trim());
            current = "";
            continue;
        }
        current += char;
    }
    if (current.trim())
        items.push(current.trim());
    return items;
}
//# sourceMappingURL=subagent-profile-frontmatter.js.map