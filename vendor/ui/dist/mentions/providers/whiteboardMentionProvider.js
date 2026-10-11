import { useMemo } from "react";
import { buildWhiteboardWorkspaceKey } from "@/lib/whiteboard.js";
import { filterMentionItemsWithOptions } from "@/mentions/mentionSearch.js";
import { useWhiteboardStore } from "@/store/whiteboardStore.js";
function mapWhiteboardsToMentionItems(boards) {
    return boards.map((board) => ({
        id: `whiteboard:${board.id}`,
        category: "whiteboards",
        label: board.name,
        description: `${board.strokes.length}`,
        value: board.id,
        markdown: `@${board.name}`,
        keywords: [board.name, board.id],
        data: {
            boardId: board.id,
            kind: "whiteboard",
        },
    }));
}
export function useWhiteboardMentionProvider(workspacePath, workspaceIdentity, query, enabled, emptyText, title) {
    const workspaceKey = buildWhiteboardWorkspaceKey({ workspacePath, workspaceIdentity });
    const workspaceState = useWhiteboardStore((state) => state.workspaces[workspaceKey]);
    const boards = useMemo(() => {
        return (workspaceState?.boardIds
            .map((boardId) => workspaceState.boardsById[boardId])
            .filter((board) => Boolean(board)) ?? []);
    }, [workspaceState]);
    const items = useMemo(() => enabled
        ? filterMentionItemsWithOptions(mapWhiteboardsToMentionItems(boards), query, {
            requireQuery: false,
        })
        : [], [boards, enabled, query]);
    return {
        items,
        loading: false,
        error: null,
        emptyText,
        title,
    };
}
//# sourceMappingURL=whiteboardMentionProvider.js.map