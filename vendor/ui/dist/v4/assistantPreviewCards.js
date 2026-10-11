import { buildAssistantPreviewCards, } from "../lib/assistantPreviewCards.js";
function isPreviewCardTerminalState(state) {
    return state === "complete" || state === "interrupted";
}
export function buildAssistantPreviewCardsForAssistantTextRow({ row, assistantTextRows, latestAssistantTextRow, workspacePath, changedFilePaths, }) {
    if (!latestAssistantTextRow ||
        row.rowId !== latestAssistantTextRow.rowId ||
        !isPreviewCardTerminalState(row.state)) {
        return [];
    }
    const turnText = assistantTextRows
        .map((assistantRow) => assistantRow.text)
        .filter((text) => text.trim().length > 0)
        .join("\n\n");
    return buildAssistantPreviewCards(turnText, workspacePath, {
        changedFilePaths,
    });
}
//# sourceMappingURL=assistantPreviewCards.js.map