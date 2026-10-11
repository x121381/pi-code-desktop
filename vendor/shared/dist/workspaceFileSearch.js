/**
 * Safety-net cap for virtualized display. Large enough to never feel
 * "incomplete" to users, small enough to keep fuzzy-sort and virtualizer
 * memory in check for enormous monorepos.
 */
export const WORKSPACE_FILE_SEARCH_DISPLAY_CAP = 1000;
export function hasWorkspaceFileSearchQuery(query) {
    return query.trim().length > 0;
}
export function mapWorkspaceFileEntriesToSearchCandidates(entries) {
    return entries.map((entry) => {
        // trim 与原打分函数的归一化保持一致（防御首尾空格文件名），严格行为等价。
        const lowercaseRelativePath = entry.relativePath.trim().toLowerCase();
        return {
            id: entry.relativePath,
            name: entry.name,
            path: entry.path,
            relativePath: entry.relativePath,
            type: entry.type,
            lowercaseName: entry.name.trim().toLowerCase(),
            lowercaseRelativePath,
            lowercasePath: entry.path.trim().toLowerCase(),
        };
    });
}
export function scoreWorkspaceFileFuzzyMatch(text, query) {
    const normalizedText = text.trim().toLowerCase();
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedText) {
        return null;
    }
    if (!normalizedQuery) {
        return 0;
    }
    if (normalizedText.startsWith(normalizedQuery)) {
        return normalizedText.length - normalizedQuery.length;
    }
    const substringIndex = normalizedText.indexOf(normalizedQuery);
    if (substringIndex !== -1) {
        return 100 + substringIndex;
    }
    let score = 200;
    let searchStart = 0;
    for (const char of normalizedQuery) {
        const foundIndex = normalizedText.indexOf(char, searchStart);
        if (foundIndex === -1) {
            return null;
        }
        score += foundIndex - searchStart;
        searchStart = foundIndex + 1;
    }
    return score + (normalizedText.length - normalizedQuery.length);
}
/** scoreWorkspaceFileFuzzyMatch 的热路径版本：text/query 均为已归一化（trim+lower）输入。 */
function scoreNormalizedFuzzyMatch(normalizedText, normalizedQuery) {
    if (!normalizedText) {
        return null;
    }
    if (normalizedText.startsWith(normalizedQuery)) {
        return normalizedText.length - normalizedQuery.length;
    }
    const substringIndex = normalizedText.indexOf(normalizedQuery);
    if (substringIndex !== -1) {
        return 100 + substringIndex;
    }
    let score = 200;
    let searchStart = 0;
    for (const char of normalizedQuery) {
        const foundIndex = normalizedText.indexOf(char, searchStart);
        if (foundIndex === -1) {
            return null;
        }
        score += foundIndex - searchStart;
        searchStart = foundIndex + 1;
    }
    return score + (normalizedText.length - normalizedQuery.length);
}
export function getWorkspaceFileSearchCandidateScore(candidate, query) {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
        return 0;
    }
    const nameScore = scoreNormalizedFuzzyMatch(candidate.lowercaseName, normalizedQuery);
    const relativePathScore = scoreNormalizedFuzzyMatch(candidate.lowercaseRelativePath, normalizedQuery);
    const pathScore = scoreNormalizedFuzzyMatch(candidate.lowercasePath, normalizedQuery);
    // relativePath 打分只计 +25 档；更高的 +100 档恒被同一打分的 +25 项压制，属于死代码；
    // keywords 项（+300）保留，覆盖"query 跨目录段子序列命中"的场景。
    const keywordScore = Math.min(relativePathScore !== null ? relativePathScore + 300 : Number.POSITIVE_INFINITY, pathScore !== null ? pathScore + 300 : Number.POSITIVE_INFINITY);
    const bestScore = Math.min(nameScore ?? Number.POSITIVE_INFINITY, relativePathScore !== null ? relativePathScore + 25 : Number.POSITIVE_INFINITY, keywordScore);
    return Number.isFinite(bestScore) ? bestScore : null;
}
function applyWorkspaceFileSearchLimit(items, limit) {
    if (!Number.isFinite(limit)) {
        return items;
    }
    const safeLimit = Math.max(0, Math.trunc(limit ?? 0));
    return items.slice(0, safeLimit);
}
function getDefaultWorkspaceFileSearchPriority(candidate) {
    return candidate.type === "directory" ? 1 : 0;
}
function sortDefaultWorkspaceFileSearchCandidates(candidates) {
    return candidates
        .map((candidate, index) => ({
        candidate,
        index,
        priority: getDefaultWorkspaceFileSearchPriority(candidate),
    }))
        .sort((left, right) => left.priority - right.priority || left.index - right.index)
        .map(({ candidate }) => candidate);
}
function compareScoredWorkspaceFileSearchCandidates(left, right) {
    if (left.score !== right.score) {
        return left.score - right.score;
    }
    if (left.index !== right.index) {
        return left.index - right.index;
    }
    return left.candidate.name.localeCompare(right.candidate.name);
}
/**
 * 大 workspace（数万候选）下 top-K 插入点曾用 findIndex 线性扫，最坏
 * O(候选数 × limit)（65k 候选 × 1000 ≈ 6500 万次比较，实测单键 155ms 同步阻塞
 * 主线程，@ 面板键入时整窗冻结）。compareScoredWorkspaceFileSearchCandidates 按
 * (score, index) 严格全序（index 单次遍历内唯一），二分查找插入点安全，
 * 单次过滤降到 O(n log K)。
 */
function findInsertionIndexByBinarySearch(bestMatches, scored) {
    let low = 0;
    let high = bestMatches.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        const midItem = bestMatches[mid];
        if (midItem !== undefined && compareScoredWorkspaceFileSearchCandidates(scored, midItem) < 0) {
            high = mid;
        }
        else {
            low = mid + 1;
        }
    }
    return low === bestMatches.length ? -1 : low;
}
export function filterWorkspaceFileSearchCandidates(candidates, query, options = {}) {
    const effectiveLimit = options.limit ?? WORKSPACE_FILE_SEARCH_DISPLAY_CAP;
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
        return options.requireQuery
            ? []
            : applyWorkspaceFileSearchLimit(sortDefaultWorkspaceFileSearchCandidates(candidates), effectiveLimit);
    }
    const bestMatches = [];
    for (const [index, candidate] of candidates.entries()) {
        const score = getWorkspaceFileSearchCandidateScore(candidate, normalizedQuery);
        if (score === null) {
            continue;
        }
        const scored = { candidate, index, score };
        // 快速路径：数组按序维护，末尾即当前最差；已满且 scored 不优于末尾时必然落选，
        // 跳过查找与 splice（宽匹配 query 下大多数候选走这条分支）。
        const worst = bestMatches[bestMatches.length - 1];
        if (worst !== undefined &&
            bestMatches.length >= effectiveLimit &&
            compareScoredWorkspaceFileSearchCandidates(scored, worst) >= 0) {
            continue;
        }
        const insertionIndex = findInsertionIndexByBinarySearch(bestMatches, scored);
        if (insertionIndex === -1) {
            if (bestMatches.length < effectiveLimit) {
                bestMatches.push(scored);
            }
            continue;
        }
        bestMatches.splice(insertionIndex, 0, scored);
        if (bestMatches.length > effectiveLimit) {
            bestMatches.pop();
        }
    }
    return bestMatches.map(({ candidate }) => candidate);
}
//# sourceMappingURL=workspaceFileSearch.js.map