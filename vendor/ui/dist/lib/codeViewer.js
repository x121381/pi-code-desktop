import { getMediaPreviewFormat } from "@zcode/shared";
import { decodeFilePathUriEscapes, getPathLeaf, isAbsoluteFilePath, joinFilePath, } from "@/lib/path.js";
import { buildUnifiedDiff, extractBeforeAfter, extractStructuredDiff, } from "@/lib/toolDiffPreview.js";
import { isFileContentWriteToolCall, isFileDiffToolCall, resolveToolCallIdentity, } from "@/lib/toolIdentity.js";
export { buildUnifiedDiff } from "@/lib/toolDiffPreview.js";
export const FILE_VIEWER_MAX_TEXT_BYTES = 256 * 1024;
const EXTENSION_TO_LANGUAGE = {
    bash: "bash",
    c: "c",
    cc: "cpp",
    cpp: "cpp",
    css: "css",
    diff: "diff",
    go: "go",
    h: "c",
    htm: "html",
    html: "html",
    java: "java",
    js: "javascript",
    json: "json",
    jsx: "jsx",
    md: "markdown",
    mermaid: "mermaid",
    mmd: "mermaid",
    mjs: "javascript",
    py: "python",
    rb: "ruby",
    rs: "rust",
    sh: "bash",
    sql: "sql",
    svg: "xml",
    text: "log",
    toml: "toml",
    ts: "typescript",
    tsx: "tsx",
    txt: "log",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
};
const IMAGE_EXTENSION_TO_MEDIA_TYPE = {
    apng: "image/apng",
    avif: "image/avif",
    bmp: "image/bmp",
    gif: "image/gif",
    ico: "image/x-icon",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    svg: "image/svg+xml",
    webp: "image/webp",
};
function isRecord(value) {
    return typeof value === "object" && value !== null;
}
function normalizeToolLabel(label, fallbackPath) {
    const trimmedLabel = label.trim();
    if (trimmedLabel) {
        return trimmedLabel;
    }
    if (fallbackPath) {
        return getPathLeaf(fallbackPath);
    }
    return "Tool Preview";
}
function findStringField(value, keys) {
    if (!isRecord(value)) {
        return undefined;
    }
    for (const key of keys) {
        const candidate = value[key];
        if (typeof candidate === "string" && candidate.trim()) {
            return candidate;
        }
    }
    return undefined;
}
function looksLikeDiff(text) {
    return /^(diff --git|--- |\+\+\+ |@@ )/m.test(text);
}
function extractDiffText(value) {
    if (typeof value === "string" && looksLikeDiff(value)) {
        return value;
    }
    return findStringField(value, ["diff", "patch", "unifiedDiff", "unified_diff"]);
}
function extractContentText(value) {
    if (typeof value === "string") {
        return value;
    }
    return findStringField(value, [
        "content",
        "text",
        "fileContent",
        "contents",
        "code",
        "result",
        "value",
    ]);
}
function extractRawPath(value) {
    return findStringField(value, [
        "path",
        "filePath",
        "file_path",
        "filename",
        "targetPath",
        "target_path",
        "targetFile",
        "target_file",
        "file",
    ]);
}
function buildTextPreview(title, path, content) {
    return {
        type: "text",
        title,
        path,
        content,
        language: inferCodeLanguage(path, content),
    };
}
function resolveViewerPath(rawPath, workspacePath) {
    if (!rawPath) {
        return undefined;
    }
    const decodedPath = decodeFilePathUriEscapes(rawPath);
    if (isAbsoluteFilePath(decodedPath)) {
        return decodedPath;
    }
    return joinFilePath(workspacePath, decodedPath);
}
export function inferCodeLanguage(path, contentHint) {
    if (path) {
        const leaf = getPathLeaf(path);
        const extension = leaf.includes(".") ? leaf.split(".").pop()?.toLowerCase() : undefined;
        if (extension && EXTENSION_TO_LANGUAGE[extension]) {
            return EXTENSION_TO_LANGUAGE[extension];
        }
    }
    if (contentHint?.startsWith("#!/")) {
        if (contentHint.includes("python")) {
            return "python";
        }
        if (contentHint.includes("bash") || contentHint.includes("sh")) {
            return "bash";
        }
    }
    if (contentHint && looksLikeDiff(contentHint)) {
        return "diff";
    }
    return "log";
}
export function inferImageMediaType(path) {
    if (!path) {
        return null;
    }
    const leaf = getPathLeaf(path);
    const extension = leaf.includes(".") ? leaf.split(".").pop()?.toLowerCase() : undefined;
    if (!extension) {
        return null;
    }
    return IMAGE_EXTENSION_TO_MEDIA_TYPE[extension] ?? null;
}
export function inferMediaPreview(path) {
    if (!path)
        return null;
    const format = getMediaPreviewFormat(path);
    return format ? { kind: format.kind, mediaType: format.mediaType } : null;
}
export function isImagePreviewPath(path) {
    return inferImageMediaType(path) !== null;
}
export function isPdfPreviewPath(path) {
    if (!path) {
        return false;
    }
    return getPathLeaf(path).toLowerCase().endsWith(".pdf");
}
export function isPptxPreviewPath(path) {
    if (!path) {
        return false;
    }
    return getPathLeaf(path).toLowerCase().endsWith(".pptx");
}
function isUsableDiffFileTarget(target) {
    const trimmedTarget = target?.trim();
    return Boolean(trimmedTarget && trimmedTarget !== "/dev/null");
}
function unquoteDiffPath(path) {
    const trimmedPath = path.trim();
    if (trimmedPath.length >= 2 && trimmedPath.startsWith('"') && trimmedPath.endsWith('"')) {
        return trimmedPath.slice(1, -1);
    }
    return trimmedPath;
}
function stripDiffPathPrefix(path) {
    const unquotedPath = unquoteDiffPath(path);
    if (unquotedPath.startsWith("a/") || unquotedPath.startsWith("b/")) {
        return unquotedPath.slice(2);
    }
    return unquotedPath;
}
function parseDiffHeaderPath(headerValue) {
    const trimmedValue = headerValue.trim();
    if (!trimmedValue) {
        return null;
    }
    if (trimmedValue.startsWith('"')) {
        const quotedPathMatch = trimmedValue.match(/^"((?:\\.|[^"\\])+)"/);
        return quotedPathMatch?.[1] ? stripDiffPathPrefix(quotedPathMatch[1]) : null;
    }
    const pathWithoutTimestamp = trimmedValue.split("\t", 1)[0]?.trim();
    return pathWithoutTimestamp ? stripDiffPathPrefix(pathWithoutTimestamp) : null;
}
function parseDiffGitLinePath(line) {
    const gitPathMatch = line.match(/^diff --git (?:"((?:\\.|[^"\\])*)"|(\S+)) (?:"((?:\\.|[^"\\])*)"|(\S+))$/);
    const nextPath = gitPathMatch?.[3] ?? gitPathMatch?.[4];
    const previousPath = gitPathMatch?.[1] ?? gitPathMatch?.[2];
    const normalizedNextPath = nextPath ? stripDiffPathPrefix(nextPath) : null;
    if (isUsableDiffFileTarget(normalizedNextPath)) {
        return normalizedNextPath;
    }
    const normalizedPreviousPath = previousPath ? stripDiffPathPrefix(previousPath) : null;
    return isUsableDiffFileTarget(normalizedPreviousPath) ? normalizedPreviousPath : null;
}
function getPatchHeaderFileTarget(patch) {
    for (const line of patch.split(/\r?\n/)) {
        const diffGitTarget = parseDiffGitLinePath(line);
        if (diffGitTarget) {
            return diffGitTarget;
        }
        if (line.startsWith("+++ ")) {
            const nextFileTarget = parseDiffHeaderPath(line.slice(4));
            if (isUsableDiffFileTarget(nextFileTarget)) {
                return nextFileTarget;
            }
        }
    }
    for (const line of patch.split(/\r?\n/)) {
        if (!line.startsWith("--- ")) {
            continue;
        }
        const previousFileTarget = parseDiffHeaderPath(line.slice(4));
        if (isUsableDiffFileTarget(previousFileTarget)) {
            return previousFileTarget;
        }
    }
    return null;
}
export function getDiffSourceFileTarget(source) {
    if (isUsableDiffFileTarget(source.path)) {
        return source.path;
    }
    if (source.type === "patch") {
        return getPatchHeaderFileTarget(source.patch);
    }
    return null;
}
export function createDiffSourceFilePreviewSource(source, fallbackWorkspacePath) {
    const fileTarget = getDiffSourceFileTarget(source);
    if (!fileTarget) {
        return null;
    }
    const workspacePath = source.workspacePath ?? fallbackWorkspacePath;
    if (!isAbsoluteFilePath(fileTarget) && !workspacePath) {
        return null;
    }
    const path = resolveViewerPath(fileTarget, workspacePath ?? "");
    if (!path) {
        return null;
    }
    // diff tab 只保存 diff source；打开“原文件预览”时必须保留 workspace scope，
    // 否则远程 workspace 或手机远控会按本地路径边界去读文件。
    return {
        type: "file",
        title: getPathLeaf(path),
        path,
        ...(workspacePath ? { workspacePath } : {}),
        ...(source.workspaceIdentity ? { workspaceIdentity: source.workspaceIdentity } : {}),
        ...(source.workspaceRemoteSessionId
            ? { workspaceRemoteSessionId: source.workspaceRemoteSessionId }
            : {}),
    };
}
export function getToolCallCodePreview(toolCall, workspacePath) {
    // 结构化 diff 是工具结果的显式变更事实，优先于 input/output 中的全文预览。
    const structuredDiff = extractStructuredDiff(toolCall.raw);
    const resolvedPath = resolveViewerPath(structuredDiff?.path ?? extractRawPath(toolCall.input) ?? extractRawPath(toolCall.output), workspacePath);
    const viewerTitle = normalizeToolLabel(toolCall.title ?? toolCall.kind, resolvedPath);
    const identity = resolveToolCallIdentity(toolCall);
    const isDiffTool = isFileDiffToolCall(toolCall, identity);
    const isReadTool = identity.family === "file-read";
    const isWriteTool = isFileContentWriteToolCall(toolCall, identity);
    if (structuredDiff) {
        const patch = buildUnifiedDiff(structuredDiff.oldText, structuredDiff.newText, resolvedPath ? getPathLeaf(resolvedPath) : "preview");
        if (patch) {
            return {
                type: "patch",
                title: viewerTitle,
                path: resolvedPath,
                patch,
            };
        }
        return {
            ...buildTextPreview(viewerTitle, resolvedPath, structuredDiff.newText),
        };
    }
    const explicitPatch = extractDiffText(toolCall.output) ?? extractDiffText(toolCall.input);
    if (explicitPatch) {
        return {
            type: "patch",
            title: viewerTitle,
            path: resolvedPath,
            patch: explicitPatch,
        };
    }
    if (isDiffTool) {
        const beforeAfter = extractBeforeAfter(toolCall.input) ?? extractBeforeAfter(toolCall.output);
        if (beforeAfter) {
            const patch = buildUnifiedDiff(beforeAfter.before, beforeAfter.after, resolvedPath ? getPathLeaf(resolvedPath) : "preview");
            if (patch) {
                return {
                    type: "patch",
                    title: viewerTitle,
                    path: resolvedPath,
                    patch,
                };
            }
            return {
                ...buildTextPreview(viewerTitle, resolvedPath, beforeAfter.after),
            };
        }
    }
    const preferredContent = isReadTool
        ? (extractContentText(toolCall.output) ?? extractContentText(toolCall.input))
        : isWriteTool
            ? (extractContentText(toolCall.input) ?? extractContentText(toolCall.output))
            : (extractContentText(toolCall.output) ?? extractContentText(toolCall.input));
    if (preferredContent) {
        return buildTextPreview(viewerTitle, resolvedPath, preferredContent);
    }
    if (resolvedPath &&
        (isDiffTool || isReadTool || isWriteTool) &&
        isImagePreviewPath(resolvedPath)) {
        return {
            type: "image",
            title: viewerTitle,
            path: resolvedPath,
            mediaType: inferImageMediaType(resolvedPath) ?? "application/octet-stream",
        };
    }
    if (resolvedPath) {
        return {
            type: "file",
            title: viewerTitle,
            path: resolvedPath,
        };
    }
    return null;
}
export function getToolCallCodeContentPreview(toolCall, workspacePath) {
    const structuredDiff = extractStructuredDiff(toolCall.raw);
    const resolvedPath = resolveViewerPath(structuredDiff?.path ?? extractRawPath(toolCall.input) ?? extractRawPath(toolCall.output), workspacePath);
    const viewerTitle = normalizeToolLabel(toolCall.title ?? toolCall.kind, resolvedPath);
    const identity = resolveToolCallIdentity(toolCall);
    const isDiffTool = isFileDiffToolCall(toolCall, identity);
    const isReadTool = identity.family === "file-read";
    const isWriteTool = isFileContentWriteToolCall(toolCall, identity);
    if (structuredDiff) {
        return buildTextPreview(viewerTitle, resolvedPath, structuredDiff.newText);
    }
    if (isDiffTool) {
        const beforeAfter = extractBeforeAfter(toolCall.input) ?? extractBeforeAfter(toolCall.output);
        if (beforeAfter) {
            return buildTextPreview(viewerTitle, resolvedPath, beforeAfter.after);
        }
    }
    const preferredContent = isReadTool
        ? (extractContentText(toolCall.output) ?? extractContentText(toolCall.input))
        : isWriteTool
            ? (extractContentText(toolCall.input) ?? extractContentText(toolCall.output))
            : (extractContentText(toolCall.output) ?? extractContentText(toolCall.input));
    if (!preferredContent) {
        return null;
    }
    return buildTextPreview(viewerTitle, resolvedPath, preferredContent);
}
//# sourceMappingURL=codeViewer.js.map