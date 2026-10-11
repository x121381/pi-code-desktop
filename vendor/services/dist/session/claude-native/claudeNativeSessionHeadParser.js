import { deriveSessionTitle } from "#src/session/sessionTitle.js";
import { isObjectRecord, readTrimmedString, } from "#src/session/claude-native/jsonLineRecord.js";
const IDE_OPENED_FILE_TAG_RE = /<ide_opened_file>[\s\S]*?<\/ide_opened_file>/gi;
const COMMAND_TAG_BLOCK_RE = /<(?:local-command|command)-[^>]+>[\s\S]*?<\/(?:local-command|command)-[^>]+>/gi;
function toTimestampMs(value) {
    if (typeof value === "number" && Number.isFinite(value)) {
        if (value > 1_000_000_000_000) {
            return Math.trunc(value);
        }
        if (value > 1_000_000_000) {
            return Math.trunc(value * 1000);
        }
        return undefined;
    }
    if (typeof value !== "string") {
        return undefined;
    }
    const normalized = value.trim();
    if (!normalized) {
        return undefined;
    }
    const numericValue = Number(normalized);
    if (Number.isFinite(numericValue)) {
        return toTimestampMs(numericValue);
    }
    const parsed = Date.parse(normalized);
    return Number.isFinite(parsed) ? parsed : undefined;
}
function readEntryTimestamp(entry) {
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    const request = isObjectRecord(entry.request) ? entry.request : undefined;
    const candidates = [
        entry.timestamp,
        entry.createdAt,
        entry.updatedAt,
        entry.created_at,
        entry.updated_at,
        entry.time,
        message?.timestamp,
        message?.createdAt,
        message?.updatedAt,
        request?.timestamp,
    ];
    for (const candidate of candidates) {
        const timestamp = toTimestampMs(candidate);
        if (timestamp !== undefined) {
            return timestamp;
        }
    }
    return undefined;
}
function readEntryWorkspacePath(entry) {
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    const request = isObjectRecord(entry.request) ? entry.request : undefined;
    return (readTrimmedString(entry.cwd) ??
        readTrimmedString(message?.cwd) ??
        readTrimmedString(request?.cwd));
}
function readEntryModel(entry) {
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    return readTrimmedString(entry.model) ?? readTrimmedString(message?.model);
}
function isClaudeNativeSidechainEntry(entry) {
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    const request = isObjectRecord(entry.request) ? entry.request : undefined;
    return (entry.isSidechain === true || message?.isSidechain === true || request?.isSidechain === true);
}
export function hasClaudeNativeSidechainMarker(entries) {
    return entries.some(isClaudeNativeSidechainEntry);
}
function sanitizeClaudeVisibleText(text) {
    return text
        .replace(IDE_OPENED_FILE_TAG_RE, " ")
        .replace(COMMAND_TAG_BLOCK_RE, " ")
        .replace(/\r\n/g, "\n")
        .trim();
}
function isClaudeNativeNonVisibleAssistantEntry(entry) {
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    return (entry.isApiErrorMessage === true ||
        message?.isApiErrorMessage === true ||
        readEntryModel(entry) === "<synthetic>");
}
function extractTextField(value) {
    if (typeof value === "string") {
        return value;
    }
    if (!isObjectRecord(value)) {
        return "";
    }
    return readTrimmedString(value.text) ?? readTrimmedString(value.content) ?? "";
}
function extractClaudeUserText(entry) {
    if (entry.type !== "user") {
        return null;
    }
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    if (entry.isMeta === true || message?.isMeta === true) {
        return null;
    }
    const content = message?.content ?? (isObjectRecord(entry.request) ? entry.request.prompt : undefined);
    if (typeof content === "string") {
        const normalized = sanitizeClaudeVisibleText(content);
        return normalized.length > 0 ? normalized : null;
    }
    if (!Array.isArray(content)) {
        return null;
    }
    const parts = content
        .flatMap((item) => {
        if (typeof item === "string") {
            const normalized = sanitizeClaudeVisibleText(item);
            return normalized.length > 0 ? [normalized] : [];
        }
        if (!isObjectRecord(item) || item.type === "tool_result") {
            return [];
        }
        const normalized = sanitizeClaudeVisibleText(extractTextField(item));
        return normalized.length > 0 ? [normalized] : [];
    })
        .filter((part) => part.length > 0);
    return parts.length > 0 ? parts.join("\n\n") : null;
}
function extractClaudeAssistantText(entry) {
    if (entry.type !== "assistant") {
        return null;
    }
    const message = isObjectRecord(entry.message) ? entry.message : undefined;
    if (isClaudeNativeNonVisibleAssistantEntry(entry)) {
        return null;
    }
    const content = message?.content;
    if (typeof content === "string") {
        const normalized = sanitizeClaudeVisibleText(content);
        return normalized.length > 0 ? normalized : null;
    }
    if (!Array.isArray(content)) {
        return null;
    }
    const parts = content
        .flatMap((item) => {
        if (typeof item === "string") {
            const normalized = sanitizeClaudeVisibleText(item);
            return normalized.length > 0 ? [normalized] : [];
        }
        if (!isObjectRecord(item) || item.type !== "text") {
            return [];
        }
        const normalized = sanitizeClaudeVisibleText(extractTextField(item));
        return normalized.length > 0 ? [normalized] : [];
    })
        .filter((part) => part.length > 0);
    const text = parts.length > 0 ? parts.join("") : "";
    return text.length > 0 ? text : null;
}
export function extractClaudeNativeSessionHeadInfo(entries) {
    let workspacePath;
    for (const entry of entries) {
        const userText = extractClaudeUserText(entry);
        const assistantText = extractClaudeAssistantText(entry);
        if (!workspacePath && (userText || assistantText)) {
            workspacePath = readEntryWorkspacePath(entry);
        }
        if (!userText) {
            continue;
        }
        return {
            workspacePath,
            previewTitle: deriveSessionTitle(userText, []),
            createdAt: readEntryTimestamp(entry),
        };
    }
    return { workspacePath };
}
//# sourceMappingURL=claudeNativeSessionHeadParser.js.map