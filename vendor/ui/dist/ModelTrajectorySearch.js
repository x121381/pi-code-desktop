import { createContext } from "react";
import { trajectoryToolCallInputs, trajectoryToolMetadata, trajectoryToolOutputs, } from "@/ModelTrajectoryToolPayload.js";
export const TrajectorySearchRevealContext = createContext(null);
export function buildTrajectorySearchIndex(items, query) {
    const normalizedQuery = normalizeTrajectorySearchText(query).text.trim();
    if (!normalizedQuery)
        return { query: "", matches: [] };
    const matches = [];
    for (const target of buildSearchTargets(items)) {
        const sourceMatches = findTrajectoryTextMatches(target.text, normalizedQuery);
        sourceMatches.forEach(({ sourceStart, sourceEnd }, fieldMatchIndex) => {
            matches.push({
                ...target,
                key: `${target.expansionKey}:${target.field}:${fieldMatchIndex}:${sourceStart}`,
                fieldMatchIndex,
                sourceStart,
                sourceEnd,
                sourceText: target.text,
            });
        });
    }
    return { query: normalizedQuery, matches };
}
function buildSearchTargets(items) {
    return items.flatMap((item, callIndex) => {
        const targets = item.inputMessages.flatMap((message, messageIndex) => messageTargets(item.key, callIndex, `${item.key}:input:${messageIndex}`, message));
        const response = item.record.response;
        if (!response)
            return targets;
        if (response.reasoningText) {
            targets.push(contentTarget(item.key, callIndex, `${item.key}:output:reasoning`, response.reasoningText));
        }
        if (response.text) {
            targets.push(contentTarget(item.key, callIndex, `${item.key}:output:message`, response.text));
        }
        response.toolCalls.forEach((toolCall, toolCallIndex) => {
            targets.push(...messageTargets(item.key, callIndex, `${item.key}:output:${toolCall.kind}:${toolCallIndex}`, { role: "assistant", parts: [toolCall] }));
        });
        return targets;
    });
}
function messageTargets(callKey, callIndex, expansionKey, message) {
    const metadata = trajectoryToolMetadata(message);
    const content = message.parts.some((part) => part.kind === "tool-result")
        ? trajectoryToolOutputs(message).join("\n\n")
        : message.parts.some((part) => part.kind === "tool-call")
            ? trajectoryToolCallInputs(message).join("\n\n")
            : message.parts
                .flatMap((part) => ("text" in part && typeof part.text === "string" ? [part.text] : []))
                .join("\n\n");
    return [
        ...(content ? [contentTarget(callKey, callIndex, expansionKey, content)] : []),
        ...(metadata.names
            ? [{ callKey, callIndex, expansionKey, field: "tool-name", text: metadata.names }]
            : []),
        ...(metadata.ids
            ? [{ callKey, callIndex, expansionKey, field: "tool-id", text: metadata.ids }]
            : []),
    ];
}
function contentTarget(callKey, callIndex, expansionKey, text) {
    return { callKey, callIndex, expansionKey, field: "content", text };
}
export function findTrajectoryTextMatches(source, normalizedQuery) {
    const normalizedSource = normalizeTrajectorySearchText(source);
    const matches = [];
    let searchStart = 0;
    while (searchStart < normalizedSource.text.length) {
        const matchStart = normalizedSource.text.indexOf(normalizedQuery, searchStart);
        if (matchStart === -1)
            break;
        const matchEnd = matchStart + normalizedQuery.length;
        const sourceStart = normalizedSource.starts[matchStart] ?? 0;
        matches.push({
            sourceStart,
            sourceEnd: normalizedSource.ends[matchEnd - 1] ?? sourceStart,
        });
        searchStart = matchEnd;
    }
    return matches;
}
export function normalizeTrajectorySearchText(source) {
    let text = "";
    const starts = [];
    const ends = [];
    let inWhitespace = false;
    for (let index = 0; index < source.length; index += 1) {
        const character = source[index] ?? "";
        if (/\s/.test(character)) {
            if (!inWhitespace) {
                text += " ";
                starts.push(index);
                ends.push(index + 1);
                inWhitespace = true;
            }
            else {
                ends[ends.length - 1] = index + 1;
            }
            continue;
        }
        inWhitespace = false;
        const normalizedCharacter = character.toLocaleLowerCase();
        text += normalizedCharacter;
        for (let offset = 0; offset < normalizedCharacter.length; offset += 1) {
            starts.push(index);
            ends.push(index + 1);
        }
    }
    return { text, starts, ends };
}
//# sourceMappingURL=ModelTrajectorySearch.js.map