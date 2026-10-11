import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { createAgentStateId, parseSubagentMarkdownSelection, formatSubagentMarkdownModel, } from "@zcode/shared";
const VALID_COLORS = new Set([
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "cyan",
]);
const VALID_PERMISSION_MODES = new Set([
    "acceptEdits",
    "auto",
    "bypassPermissions",
    "default",
    "dontAsk",
    "plan",
]);
export function parseSubagentMarkdown(input) {
    const parsed = splitMarkdownFrontmatter(input.content);
    if (!parsed.frontmatter) {
        return {
            diagnostic: {
                code: "agent_missing_frontmatter",
                message: `Agent Markdown must include frontmatter: ${input.path}`,
                path: input.path,
            },
        };
    }
    // runtime 使用 loose frontmatter 语义；Settings 也按同一语义读取，
    // 避免 CLI 已加载的 profile 因为不是严格 YAML 而在 GUI 中消失。
    const frontmatter = parseRuntimeCompatibleFrontmatter(parsed.frontmatter);
    const name = scalarString(frontmatter.name);
    const description = scalarString(frontmatter.description)?.replace(/\\n/gu, "\n");
    if (!name) {
        return missingRequiredDiagnostic("name", input.path);
    }
    if (!description) {
        return missingRequiredDiagnostic("description", input.path);
    }
    const source = input.scope === "built-in" ? "built-in" : "user";
    const modelSelection = parseSubagentMarkdownSelection(frontmatter);
    const color = normalizeEnum(frontmatter.color, VALID_COLORS);
    const permissionMode = normalizeEnum(frontmatter.permissionMode, VALID_PERMISSION_MODES);
    const maxTurns = normalizePositiveInteger(frontmatter.maxTurns);
    const tools = parseToolSpecList(frontmatter.tools);
    const disallowedTools = parseToolSpecList(frontmatter.disallowedTools);
    const skills = parseStringList(frontmatter.skills);
    const background = parseOptionalBoolean(frontmatter.background);
    const injectAgentsMd = parseOptionalBoolean(frontmatter.injectAgentsMd);
    const mcpServers = Array.isArray(frontmatter.mcpServers) ? frontmatter.mcpServers : undefined;
    return {
        agent: {
            id: createAgentStateId({ name, scope: input.scope, source }),
            name,
            description,
            systemPrompt: parsed.body.trim(),
            ...(color ? { color } : {}),
            ...(modelSelection ? { modelSelection } : {}),
            ...(tools ? { tools } : {}),
            ...(disallowedTools ? { disallowedTools } : {}),
            ...(skills ? { skills } : {}),
            ...(permissionMode ? { permissionMode } : {}),
            ...(maxTurns ? { maxTurns } : {}),
            ...(background !== undefined ? { background } : {}),
            ...(injectAgentsMd !== undefined ? { injectAgentsMd } : {}),
            ...(mcpServers ? { mcpServers } : {}),
            path: input.path,
            scope: input.scope,
            source,
            enabled: true,
            // workspace scope 曾一并标为只读，导致 .zcode/agents 下的 profile 在设置页
            // 既不能编辑/删除，又因 groupAgentsByScope 的兜底分支被显示在“内置”分组里。
            // 只有内置 agent 是真正不可编辑的；插件 agent 由 discoverPluginAgents 显式覆盖为只读。
            readOnly: input.scope === "built-in",
        },
    };
}
export function serializeSubagentMarkdown(config) {
    const frontmatterLines = [
        `name: "${escapeYamlString(config.name)}"`,
        `description: "${escapeYamlString(config.description)}"`,
    ];
    appendScalar(frontmatterLines, "color", config.color);
    if (config.modelSelection) {
        appendScalar(frontmatterLines, "model", formatSubagentMarkdownModel(config.modelSelection));
        appendScalar(frontmatterLines, "thoughtLevel", config.modelSelection.options?.reasoningLevel);
    }
    appendList(frontmatterLines, "tools", config.tools);
    appendList(frontmatterLines, "disallowedTools", config.disallowedTools);
    appendList(frontmatterLines, "skills", config.skills);
    appendScalar(frontmatterLines, "permissionMode", config.permissionMode);
    if (config.maxTurns !== undefined) {
        frontmatterLines.push(`maxTurns: ${config.maxTurns}`);
    }
    if (config.background !== undefined) {
        frontmatterLines.push(`background: ${config.background ? "true" : "false"}`);
    }
    if (config.injectAgentsMd !== undefined) {
        frontmatterLines.push(`injectAgentsMd: ${config.injectAgentsMd ? "true" : "false"}`);
    }
    appendUnknownList(frontmatterLines, "mcpServers", config.mcpServers);
    return `---\n${frontmatterLines.join("\n")}\n---\n${formatBody(config.systemPrompt)}`;
}
function splitMarkdownFrontmatter(content) {
    const normalized = content.replace(/^\uFEFF/u, "").replace(/\r\n/g, "\n");
    if (!normalized.startsWith("---")) {
        return { body: normalized };
    }
    const lines = normalized.split("\n");
    if (lines[0]?.trim() !== "---") {
        return { body: normalized };
    }
    const endIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
    if (endIndex < 0) {
        return { body: normalized };
    }
    return {
        frontmatter: lines.slice(1, endIndex).join("\n"),
        body: lines.slice(endIndex + 1).join("\n"),
    };
}
function parseRuntimeCompatibleFrontmatter(frontmatter) {
    const looseValues = parseLooseFrontmatter(frontmatter);
    let yamlValues = {};
    try {
        const rawFrontmatter = parseYaml(frontmatter);
        yamlValues = isObjectRecord(rawFrontmatter) ? rawFrontmatter : {};
    }
    catch {
        yamlValues = {};
    }
    return {
        ...yamlValues,
        ...looseValues,
        ...(Array.isArray(yamlValues.mcpServers) ? { mcpServers: yamlValues.mcpServers } : {}),
    };
}
function parseLooseFrontmatter(frontmatter) {
    const values = {};
    const lines = frontmatter.split(/\r?\n/u);
    let pendingListKey;
    for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        if (!line.trim() || line.trimStart().startsWith("#"))
            continue;
        const listMatch = line.match(/^\s*-\s+(.*)$/u);
        if (listMatch && pendingListKey) {
            const existing = Array.isArray(values[pendingListKey])
                ? values[pendingListKey]
                : [];
            values[pendingListKey] = [...existing, parseScalarValue(listMatch[1] ?? "")];
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
            pendingListKey = key;
            continue;
        }
        values[key] = parseScalarValue(rawValue);
    }
    return values;
}
function parseScalarValue(rawValue) {
    const value = stripInlineComment(rawValue.trim());
    if (value === "true")
        return true;
    if (value === "false")
        return false;
    if (/^\d+$/u.test(value))
        return Number(value);
    if (value.startsWith("[") && value.endsWith("]")) {
        return splitTopLevelList(value.slice(1, -1)).map((item) => unquoteScalar(stripInlineComment(item.trim())));
    }
    if (value.startsWith("{") && value.endsWith("}")) {
        try {
            return JSON.parse(value);
        }
        catch {
            // Runtime-compatible loose frontmatter 对非法 inline mapping 保留原字符串；
            // 下游严格 ModelSelection schema 会拒绝它，而不是让整个 agent 文件消失。
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
function splitTopLevelList(value) {
    const items = [];
    let current = "";
    let quote;
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
        if (!quote && parenDepth === 0 && char === ",") {
            if (current.trim())
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
function unquoteScalar(value) {
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
        return value.slice(1, -1);
    }
    return value;
}
function missingRequiredDiagnostic(field, path) {
    return {
        diagnostic: {
            code: "agent_missing_required_frontmatter",
            message: `Agent frontmatter must include ${field}: ${path}`,
            path,
        },
    };
}
function scalarString(value) {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}
function normalizeEnum(value, valid) {
    const raw = scalarString(value);
    return raw && valid.has(raw) ? raw : undefined;
}
function parseOptionalBoolean(value) {
    if (typeof value === "boolean")
        return value;
    if (typeof value === "string") {
        if (value.toLowerCase() === "true")
            return true;
        if (value.toLowerCase() === "false")
            return false;
    }
    return undefined;
}
function normalizePositiveInteger(value) {
    if (typeof value === "number" && Number.isInteger(value) && value > 0)
        return value;
    if (typeof value === "string" && /^\d+$/u.test(value)) {
        const parsed = Number(value);
        return parsed > 0 ? parsed : undefined;
    }
    return undefined;
}
function parseStringList(value) {
    if (Array.isArray(value)) {
        return nonEmptyList(value.filter((item) => typeof item === "string").map((item) => item.trim()));
    }
    if (typeof value !== "string")
        return undefined;
    return nonEmptyList(value
        .split(/[,\s]+/u)
        .map((item) => item.trim())
        .filter(Boolean));
}
function parseToolSpecList(value) {
    if (Array.isArray(value)) {
        return nonEmptyList(value.filter((item) => typeof item === "string").map((item) => item.trim()));
    }
    if (typeof value !== "string")
        return undefined;
    const result = [];
    let current = "";
    let parenDepth = 0;
    for (const char of value) {
        if (char === "(")
            parenDepth += 1;
        if (char === ")")
            parenDepth = Math.max(0, parenDepth - 1);
        if (parenDepth === 0 && (char === "," || /\s/u.test(char))) {
            if (current.trim())
                result.push(current.trim());
            current = "";
            continue;
        }
        current += char;
    }
    if (current.trim())
        result.push(current.trim());
    return nonEmptyList(result);
}
function nonEmptyList(values) {
    const filtered = values.filter((item) => item.length > 0);
    return filtered.length > 0 ? filtered : undefined;
}
function appendScalar(lines, key, value) {
    if (value === undefined || value.length === 0)
        return;
    lines.push(`${key}: ${formatYamlScalar(value)}`);
}
function appendList(lines, key, values) {
    if (!values || values.length === 0)
        return;
    lines.push(`${key}:`);
    for (const value of values) {
        lines.push(`  - ${formatYamlScalar(value)}`);
    }
}
function appendUnknownList(lines, key, values) {
    if (!values || values.length === 0)
        return;
    if (isStringArray(values)) {
        appendList(lines, key, values);
        return;
    }
    // GUI 当前还没有 mcpServers 的结构化表单，但保存会重写整个
    // frontmatter；对象数组必须按 YAML 结构写回，避免编辑其他字段时清空 MCP 配置。
    const serialized = stringifyYaml({ [key]: values }, { lineWidth: 0 }).trimEnd();
    lines.push(...serialized.split("\n"));
}
function isStringArray(values) {
    return values.every((value) => typeof value === "string");
}
function formatYamlScalar(value) {
    // `*` 和包含 `: ` 的工具 pattern 在 YAML plain scalar 中会被当作
    // alias/map，必须 quote 后再写入，保证保存出的 Markdown 可被 parser 重新读取。
    if (isSafePlainYamlScalar(value)) {
        return value;
    }
    return `"${escapeYamlString(value)}"`;
}
function isSafePlainYamlScalar(value) {
    if (value.length === 0 || value.trim() !== value)
        return false;
    if (/^(?:false|null|true|~)$/iu.test(value))
        return false;
    if (/^[-+]?(?:\d+|\d*\.\d+)(?:e[-+]?\d+)?$/iu.test(value))
        return false;
    if (/^[*?:,[\]{}&!|>'"%@`-]/u.test(value))
        return false;
    if (value.includes("#") || /:\s/u.test(value))
        return false;
    return /^[A-Za-z0-9_./@*][A-Za-z0-9_./@*\s()-]*$/u.test(value);
}
function escapeYamlString(value) {
    return value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}
function formatBody(systemPrompt) {
    const body = systemPrompt.trim();
    return body.length > 0 ? `\n${body}\n` : "\n";
}
function isObjectRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=subagentMarkdown.js.map