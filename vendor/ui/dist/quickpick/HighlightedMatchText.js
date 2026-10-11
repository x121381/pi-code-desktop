import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
function getQueryParts(query) {
    const seen = new Set();
    return query
        .trim()
        .toLocaleLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .filter((part) => {
        if (seen.has(part)) {
            return false;
        }
        seen.add(part);
        return true;
    });
}
function mergeRanges(ranges) {
    const sortedRanges = [...ranges].sort((left, right) => left.start - right.start || left.end - right.end);
    const mergedRanges = [];
    for (const range of sortedRanges) {
        const lastRange = mergedRanges.at(-1);
        if (!lastRange || range.start > lastRange.end) {
            mergedRanges.push({ ...range });
            continue;
        }
        lastRange.end = Math.max(lastRange.end, range.end);
    }
    return mergedRanges;
}
export function findTextMatchRanges(text, query) {
    const parts = getQueryParts(query);
    if (parts.length === 0 || text.length === 0) {
        return [];
    }
    const normalizedText = text.toLocaleLowerCase();
    const ranges = [];
    for (const part of parts) {
        let searchIndex = 0;
        while (searchIndex < normalizedText.length) {
            const matchIndex = normalizedText.indexOf(part, searchIndex);
            if (matchIndex === -1) {
                break;
            }
            ranges.push({
                start: matchIndex,
                end: matchIndex + part.length,
            });
            searchIndex = matchIndex + part.length;
        }
    }
    return mergeRanges(ranges);
}
export function HighlightedMatchText({ text, query }) {
    const ranges = findTextMatchRanges(text, query);
    if (ranges.length === 0) {
        return _jsx(_Fragment, { children: text });
    }
    const parts = [];
    let cursor = 0;
    ranges.forEach((range, index) => {
        if (cursor < range.start) {
            parts.push(_jsx("span", { children: text.slice(cursor, range.start) }, `plain-${index}`));
        }
        parts.push(_jsx("mark", { className: "rounded-sm bg-accent font-semibold text-foreground", children: text.slice(range.start, range.end) }, `match-${index}`));
        cursor = range.end;
    });
    if (cursor < text.length) {
        parts.push(_jsx("span", { children: text.slice(cursor) }, "plain-end"));
    }
    return _jsx(_Fragment, { children: parts });
}
//# sourceMappingURL=HighlightedMatchText.js.map