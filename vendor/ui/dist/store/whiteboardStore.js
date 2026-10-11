import { create } from "zustand";
import { buildWhiteboardWorkspaceKey, createWhiteboardDocument, } from "@/lib/whiteboard.js";
import { shouldExposeE2EStoreBridge } from "@/lib/e2eStoreBridge.js";
function getWorkspaceState(state, workspaceKey) {
    return state.workspaces[workspaceKey] ?? { boardIds: [], boardsById: {} };
}
function updateBoard(state, params) {
    const workspaceKey = buildWhiteboardWorkspaceKey(params);
    const workspaceState = getWorkspaceState(state, workspaceKey);
    const board = workspaceState.boardsById[params.boardId];
    if (!board) {
        return { workspaces: state.workspaces };
    }
    return {
        workspaces: {
            ...state.workspaces,
            [workspaceKey]: {
                ...workspaceState,
                boardsById: {
                    ...workspaceState.boardsById,
                    [params.boardId]: params.updater(board),
                },
            },
        },
    };
}
export const useWhiteboardStore = create()((set, get) => ({
    workspaces: {},
    createBoard: (params) => {
        const workspaceKey = buildWhiteboardWorkspaceKey(params);
        const workspaceState = getWorkspaceState(get(), workspaceKey);
        const board = createWhiteboardDocument({
            defaultNamePrefix: params.defaultNamePrefix,
            existingNames: workspaceState.boardIds.map((boardId) => workspaceState.boardsById[boardId]?.name ?? ""),
        });
        set((state) => {
            const currentWorkspaceState = getWorkspaceState(state, workspaceKey);
            return {
                workspaces: {
                    ...state.workspaces,
                    [workspaceKey]: {
                        boardIds: [...currentWorkspaceState.boardIds, board.id],
                        boardsById: {
                            ...currentWorkspaceState.boardsById,
                            [board.id]: board,
                        },
                    },
                },
            };
        });
        return board;
    },
    renameBoard: (params) => {
        const name = params.name.trim();
        if (!name) {
            return;
        }
        set((state) => updateBoard(state, {
            ...params,
            updater: (board) => ({
                ...board,
                name,
                updatedAt: Date.now(),
            }),
        }));
    },
    addStroke: (params) => {
        set((state) => updateBoard(state, {
            ...params,
            updater: (board) => ({
                ...board,
                strokes: [...board.strokes, params.stroke],
                undoneStrokes: [],
                updatedAt: Date.now(),
            }),
        }));
    },
    undoStroke: (params) => {
        set((state) => updateBoard(state, {
            ...params,
            updater: (board) => {
                const stroke = board.strokes.at(-1);
                if (!stroke) {
                    return board;
                }
                return {
                    ...board,
                    strokes: board.strokes.slice(0, -1),
                    undoneStrokes: [...board.undoneStrokes, stroke],
                    updatedAt: Date.now(),
                };
            },
        }));
    },
    redoStroke: (params) => {
        set((state) => updateBoard(state, {
            ...params,
            updater: (board) => {
                const stroke = board.undoneStrokes.at(-1);
                if (!stroke) {
                    return board;
                }
                return {
                    ...board,
                    strokes: [...board.strokes, stroke],
                    undoneStrokes: board.undoneStrokes.slice(0, -1),
                    updatedAt: Date.now(),
                };
            },
        }));
    },
    clearBoard: (params) => {
        set((state) => updateBoard(state, {
            ...params,
            updater: (board) => ({
                ...board,
                strokes: [],
                undoneStrokes: [],
                updatedAt: Date.now(),
            }),
        }));
    },
    getBoard: (params) => {
        const workspaceKey = buildWhiteboardWorkspaceKey(params);
        return get().workspaces[workspaceKey]?.boardsById[params.boardId] ?? null;
    },
}));
if (shouldExposeE2EStoreBridge()) {
    // E2E 诊断入口必须由 WDIO 显式打开，不能复用 ZCODE_ENV=test，避免产品测试环境暴露可变全局 store。
    window.__whiteboardStoreE2E = useWhiteboardStore;
}
//# sourceMappingURL=whiteboardStore.js.map