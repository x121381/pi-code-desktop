import { projectAssistantCodeComments } from "../lib/assistantCodeComment.js";
export function normalizeConversationFindQuery(query) {
    return query.trim().toLocaleLowerCase();
}
function addTargetsForUnit(targets, unit, unitIndex, projectCodeComments) {
    const latestAssistantState = unit.latestAssistantTextRow?.state;
    const projectUnitCodeComments = projectCodeComments &&
        (unit.isRunning ||
            latestAssistantState === "complete" ||
            latestAssistantState === "interrupted");
    for (const row of unit.visibleUserInputs) {
        targets.push(createTarget(unitIndex, row));
    }
    for (const row of unit.assistantTextRows) {
        targets.push({
            ...createTarget(unitIndex, row),
            text: projectUnitCodeComments
                ? projectAssistantCodeComments(row.text, {
                    streaming: row.state === "streaming",
                }).visibleText
                : row.text,
        });
    }
}
function createTarget(unitIndex, row) {
    return {
        unitIndex,
        rowId: row.rowId,
        rowKind: row.kind,
        text: row.text,
    };
}
export function buildConversationFindIndex(units, query, options = {}) {
    const normalizedQuery = normalizeConversationFindQuery(query);
    const targets = [];
    units.forEach((unit, unitIndex) => addTargetsForUnit(targets, unit, unitIndex, options.projectAssistantCodeComments === true));
    if (!normalizedQuery) {
        return {
            query: normalizedQuery,
            matches: [],
            matchCount: 0,
            loadedRowCount: targets.length,
        };
    }
    const matches = [];
    for (const target of targets) {
        const normalizedText = target.text.toLocaleLowerCase();
        let searchStart = 0;
        let rowMatchIndex = 0;
        while (searchStart < normalizedText.length) {
            const matchIndex = normalizedText.indexOf(normalizedQuery, searchStart);
            if (matchIndex === -1) {
                break;
            }
            matches.push({
                globalIndex: matches.length,
                unitIndex: target.unitIndex,
                rowId: target.rowId,
                rowKind: target.rowKind,
                rowMatchIndex,
                start: matchIndex,
                end: matchIndex + normalizedQuery.length,
                sourceText: target.text,
            });
            rowMatchIndex += 1;
            searchStart = matchIndex + normalizedQuery.length;
        }
    }
    return {
        query: normalizedQuery,
        matches,
        matchCount: matches.length,
        loadedRowCount: targets.length,
    };
}
export function getConversationFindMatchKey(match) {
    if (!match) {
        return null;
    }
    return {
        rowId: match.rowId,
        rowKind: match.rowKind,
        rowMatchIndex: match.rowMatchIndex,
    };
}
export function findConversationMatchIndexByKey(index, key) {
    if (!key) {
        return -1;
    }
    return index.matches.findIndex((match) => match.rowId === key.rowId &&
        match.rowKind === key.rowKind &&
        match.rowMatchIndex === key.rowMatchIndex);
}
export function resolveConversationFindActiveIndex(index, preferredIndex) {
    if (index.matchCount === 0) {
        return -1;
    }
    if (preferredIndex >= 0 && preferredIndex < index.matchCount) {
        return preferredIndex;
    }
    return 0;
}
export function resolveConversationFindActiveMatch(index, preferredIndex) {
    const activeIndex = resolveConversationFindActiveIndex(index, preferredIndex);
    return activeIndex >= 0 ? (index.matches[activeIndex] ?? null) : null;
}
function normalizeSearchResultProbeText(text) {
    return text.replace(/^\.{3}/, "").replace(/\.{3}$/, "").replace(/\s+/g, " ").trim();
}
function includesProbe(sourceText, probe) {
    const normalizedSource = normalizeSearchResultProbeText(sourceText).toLocaleLowerCase();
    const normalizedProbe = normalizeSearchResultProbeText(probe).toLocaleLowerCase();
    return normalizedProbe.length > 0 && normalizedSource.includes(normalizedProbe);
}
export function resolveSearchResultHighlightMatch(index, request) {
    if (index.matchCount === 0) {
        return null;
    }
    const snippet = request.snippet?.trim();
    if (snippet) {
        const snippetMatch = index.matches.find((match) => includesProbe(match.sourceText, snippet));
        if (snippetMatch) {
            return snippetMatch;
        }
    }
    const preferredIndex = request.snippetIndex ?? 0;
    return index.matches[preferredIndex] ?? index.matches[0] ?? null;
}
//# sourceMappingURL=conversationFindIndex.js.map