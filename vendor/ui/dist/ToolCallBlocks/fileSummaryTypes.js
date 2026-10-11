import { countPatchFileDiffs } from "../lib/patchDiffPreview.js";
export function isPlainRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function readStringField(value, keys) {
    for (const key of keys) {
        const candidate = value[key];
        if (typeof candidate === "string" && candidate.trim().length > 0) {
            return candidate;
        }
    }
    return undefined;
}
export function readUnifiedDiffField(value) {
    if (!isPlainRecord(value)) {
        return undefined;
    }
    return readStringField(value, ["unified_diff", "unifiedDiff", "patch", "diff"]);
}
export function normalizeSingleFilePatch(patch, fileLabel) {
    if (!patch) {
        return undefined;
    }
    const trimmedPatch = patch.trim();
    if (!trimmedPatch) {
        return undefined;
    }
    if (countPatchFileDiffs(trimmedPatch) > 1) {
        // sub-agent 二次编辑同一文件时，工具层有时会把多段 diff 拼在同一个字段返回。
        // PatchDiff 只能解析单文件 patch，直接渲染会抛错并让“点击文件名查看变更”失败。
        // 这里先丢弃多文件 patch，让上层回退到 old/newText 生成的单文件 diff（或文件内容预览）。
        return undefined;
    }
    if (/^---\s+/m.test(trimmedPatch) && /^\+\+\+\s+/m.test(trimmedPatch)) {
        return trimmedPatch;
    }
    if (trimmedPatch.startsWith("@@ ")) {
        const firstHeader = trimmedPatch.match(/^@@\s-(\d+)(?:,(\d+))?\s\+(\d+)(?:,(\d+))?\s@@/m);
        const deletedCount = Number(firstHeader?.[2] ?? firstHeader?.[1] ?? "1");
        const addedCount = Number(firstHeader?.[4] ?? firstHeader?.[3] ?? "1");
        // 工具返回的 unified_diff 经常只有 hunk 片段，没有文件头。
        // 对“新建文件”场景，如果继续补成 --- a/file，PatchDiff 会按普通变更解析，
        // 大整文件新增时更容易把页面拖死。这里根据首个 hunk 判断是否为纯新增，补成 /dev/null 头。
        return [
            deletedCount === 0 && addedCount > 0 ? "--- /dev/null" : `--- a/${fileLabel}`,
            addedCount === 0 && deletedCount > 0 ? "+++ /dev/null" : `+++ b/${fileLabel}`,
            trimmedPatch,
        ].join("\n");
    }
    // apply_patch 原文也可能包含 @@，但它不是标准 unified diff。
    // 不能给这类内容强行补 ---/+++ 头，否则 summary 打开文件时会把畸形 patch 送进 PatchDiff。
    return trimmedPatch;
}
export function readRawToolCallInput(raw) {
    if (!isPlainRecord(raw)) {
        return null;
    }
    if ("rawInput" in raw && raw.rawInput !== undefined) {
        return raw.rawInput;
    }
    // ZCode protocol 的 permission/request payload 按 schema 把工具参数放在 input，
    // 旧 UI 只读兼容输入字段 rawInput，Write/Edit 会退化成整段 JSON 展示而不是文件 diff。
    return "input" in raw ? raw.input : null;
}
export function readStructuredDiffBlock(value) {
    if (!isPlainRecord(value) || value.type !== "diff" || typeof value.newText !== "string") {
        return null;
    }
    return {
        path: typeof value.path === "string" && value.path.trim() ? value.path : undefined,
        oldText: typeof value.oldText === "string"
            ? value.oldText
            : value.oldText == null
                ? ""
                : String(value.oldText),
        newText: value.newText,
    };
}
export function readRawToolCallChanges(raw) {
    if (!isPlainRecord(raw)) {
        return {
            directChanges: null,
            rawInputChanges: null,
            rawOutputChanges: null,
        };
    }
    const rawInputSource = readRawToolCallInput(raw);
    const rawInput = isPlainRecord(rawInputSource) ? rawInputSource : null;
    const rawOutput = isPlainRecord(raw.rawOutput) ? raw.rawOutput : null;
    return {
        directChanges: isPlainRecord(raw.changes) ? raw.changes : null,
        rawInputChanges: rawInput && isPlainRecord(rawInput.changes) ? rawInput.changes : null,
        rawOutputChanges: rawOutput && isPlainRecord(rawOutput.changes) ? rawOutput.changes : null,
    };
}
//# sourceMappingURL=fileSummaryTypes.js.map