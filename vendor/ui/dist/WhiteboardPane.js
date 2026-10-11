import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { EraserIcon, ImagePlusIcon, PaletteIcon, PencilIcon, Redo2Icon, Trash2Icon, Undo2Icon, } from "lucide-react";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Button } from "@/components/ui/button.js";
import { Input } from "@/components/ui/input.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { WHITEBOARD_DEFAULT_COLOR, createWhiteboardStroke, dispatchWhiteboardAddToChat, drawWhiteboardDocument, } from "@/lib/whiteboard.js";
import { buildWhiteboardWorkspaceKey } from "@/lib/whiteboard.js";
import { useWhiteboardStore } from "@/store/whiteboardStore.js";
const WHITEBOARD_SWATCHES = ["#111827", "#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"];
export function WhiteboardPane({ workspacePath, workspaceIdentity, boardId, }) {
    const { intl } = useZCodeIntl();
    const workspaceKey = buildWhiteboardWorkspaceKey({ workspacePath, workspaceIdentity });
    const board = useWhiteboardStore((state) => state.workspaces[workspaceKey]?.boardsById[boardId]);
    const renameBoard = useWhiteboardStore((state) => state.renameBoard);
    const addStroke = useWhiteboardStore((state) => state.addStroke);
    const undoStroke = useWhiteboardStore((state) => state.undoStroke);
    const redoStroke = useWhiteboardStore((state) => state.redoStroke);
    const clearBoard = useWhiteboardStore((state) => state.clearBoard);
    const canvasRef = useRef(null);
    const draftStrokeRef = useRef(null);
    const activePointerIdRef = useRef(null);
    const [tool, setTool] = useState("pen");
    const [color, setColor] = useState(WHITEBOARD_DEFAULT_COLOR);
    const [strokeWidth, setStrokeWidth] = useState(5);
    const [nameDraft, setNameDraft] = useState("");
    const renderCanvas = useCallback((draftStroke = draftStrokeRef.current) => {
        if (!board) {
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const pixelRatio = Math.max(1, window.devicePixelRatio || 1);
        const targetWidth = Math.round(board.width * pixelRatio);
        const targetHeight = Math.round(board.height * pixelRatio);
        if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
            canvas.width = targetWidth;
            canvas.height = targetHeight;
        }
        const context = canvas.getContext("2d");
        if (!context) {
            return;
        }
        drawWhiteboardDocument(context, board, {
            draftStroke,
            scale: pixelRatio,
        });
    }, [board]);
    useEffect(() => {
        draftStrokeRef.current = null;
        renderCanvas(null);
    }, [board, renderCanvas]);
    useEffect(() => {
        setNameDraft(board?.name ?? "");
    }, [board?.id, board?.name]);
    const getCanvasPoint = useCallback((event) => {
        if (!board) {
            return null;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) {
            return null;
        }
        return {
            x: Math.min(board.width, Math.max(0, ((event.clientX - rect.left) / rect.width) * board.width)),
            y: Math.min(board.height, Math.max(0, ((event.clientY - rect.top) / rect.height) * board.height)),
        };
    }, [board]);
    const handlePointerDown = useCallback((event) => {
        if (!board || event.button !== 0) {
            return;
        }
        const point = getCanvasPoint(event);
        if (!point) {
            return;
        }
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        activePointerIdRef.current = event.pointerId;
        draftStrokeRef.current = createWhiteboardStroke({
            color,
            points: [point],
            tool,
            width: tool === "eraser" ? Math.max(14, strokeWidth * 3) : strokeWidth,
        });
        renderCanvas();
    }, [board, color, getCanvasPoint, renderCanvas, strokeWidth, tool]);
    const handlePointerMove = useCallback((event) => {
        if (!board || activePointerIdRef.current !== event.pointerId || !draftStrokeRef.current) {
            return;
        }
        const point = getCanvasPoint(event);
        if (!point) {
            return;
        }
        event.preventDefault();
        draftStrokeRef.current = {
            ...draftStrokeRef.current,
            points: [...draftStrokeRef.current.points, point],
        };
        renderCanvas();
    }, [board, getCanvasPoint, renderCanvas]);
    const finishPointerStroke = useCallback((event) => {
        if (activePointerIdRef.current !== event.pointerId) {
            return;
        }
        const stroke = draftStrokeRef.current;
        activePointerIdRef.current = null;
        draftStrokeRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
        if (!stroke || stroke.points.length === 0) {
            renderCanvas(null);
            return;
        }
        addStroke({
            boardId,
            stroke,
            workspaceIdentity,
            workspacePath,
        });
    }, [addStroke, boardId, renderCanvas, workspaceIdentity, workspacePath]);
    if (!board) {
        return (_jsx("div", { className: "flex h-full items-center justify-center bg-panel px-4 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "whiteboard.missing" }) }));
    }
    const canUndo = board.strokes.length > 0;
    const canRedo = board.undoneStrokes.length > 0;
    const addToChatLabel = intl.formatMessage({ id: "whiteboard.addToChat" });
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col bg-panel text-foreground", children: [_jsxs("div", { className: "flex min-h-10 items-center gap-2 border-b border-border px-2", children: [_jsx(Input, { value: nameDraft, onBlur: () => {
                            if (!nameDraft.trim()) {
                                setNameDraft(board.name);
                            }
                        }, onChange: (event) => {
                            const nextName = event.target.value;
                            setNameDraft(nextName);
                            if (!nextName.trim()) {
                                return;
                            }
                            renameBoard({
                                boardId,
                                name: nextName,
                                workspaceIdentity,
                                workspacePath,
                            });
                        }, "aria-label": intl.formatMessage({ id: "whiteboard.nameLabel" }), className: "max-w-48" }), _jsxs("div", { className: "ml-auto flex min-w-0 items-center gap-1", children: [_jsx(ControlHintTooltip, { title: addToChatLabel, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", "aria-label": addToChatLabel, onClick: () => dispatchWhiteboardAddToChat({
                                        boardId,
                                        workspaceIdentity,
                                        workspacePath,
                                    }), children: _jsx(ImagePlusIcon, { className: "size-4" }) }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.tool.pen" }), children: _jsx(Button, { type: "button", variant: tool === "pen" ? "secondary" : "ghost", size: "icon-md", "aria-pressed": tool === "pen", "aria-label": intl.formatMessage({ id: "whiteboard.tool.pen" }), onClick: () => setTool("pen"), children: _jsx(PencilIcon, { className: "size-4" }) }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.tool.eraser" }), children: _jsx(Button, { type: "button", variant: tool === "eraser" ? "secondary" : "ghost", size: "icon-md", "aria-pressed": tool === "eraser", "aria-label": intl.formatMessage({ id: "whiteboard.tool.eraser" }), onClick: () => setTool("eraser"), children: _jsx(EraserIcon, { className: "size-4" }) }) }), _jsx("div", { className: "hidden items-center gap-1 sm:flex", children: WHITEBOARD_SWATCHES.map((swatch) => (_jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.color" }), children: _jsx("button", { type: "button", "aria-label": intl.formatMessage({ id: "whiteboard.color" }), "aria-pressed": color === swatch, onClick: () => setColor(swatch), className: cn("size-5 rounded-full border border-border transition-shadow", color === swatch && "ring-2 ring-brand ring-offset-1 ring-offset-panel"), style: { backgroundColor: swatch } }) }, swatch))) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.strokeWidth" }), children: _jsx("input", { type: "range", min: "2", max: "18", value: strokeWidth, "aria-label": intl.formatMessage({ id: "whiteboard.strokeWidth" }), onChange: (event) => setStrokeWidth(Number(event.target.value)), className: "hidden h-7 w-20 accent-primary md:block" }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.undo" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", disabled: !canUndo, "aria-label": intl.formatMessage({ id: "whiteboard.undo" }), onClick: () => undoStroke({ boardId, workspaceIdentity, workspacePath }), children: _jsx(Undo2Icon, { className: "size-4" }) }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.redo" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", disabled: !canRedo, "aria-label": intl.formatMessage({ id: "whiteboard.redo" }), onClick: () => redoStroke({ boardId, workspaceIdentity, workspacePath }), children: _jsx(Redo2Icon, { className: "size-4" }) }) }), _jsx(ControlHintTooltip, { title: intl.formatMessage({ id: "whiteboard.clear" }), children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-md", disabled: !canUndo, "aria-label": intl.formatMessage({ id: "whiteboard.clear" }), onClick: () => clearBoard({ boardId, workspaceIdentity, workspacePath }), children: _jsx(Trash2Icon, { className: "size-4" }) }) })] })] }), _jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center bg-background-alt p-3", children: _jsxs("div", { className: "relative aspect-[16/10] max-h-full w-full overflow-hidden rounded-lg border border-border bg-white shadow-sm", children: [_jsx("canvas", { ref: canvasRef, className: "h-full w-full touch-none", "aria-label": intl.formatMessage({ id: "whiteboard.canvasLabel" }), onPointerDown: handlePointerDown, onPointerMove: handlePointerMove, onPointerUp: finishPointerStroke, onPointerCancel: finishPointerStroke, onLostPointerCapture: finishPointerStroke }), _jsx("div", { className: "pointer-events-none absolute left-2 top-2 flex size-6 items-center justify-center rounded-full border border-border bg-surface/90 text-foreground-subtle shadow-sm sm:hidden", children: _jsx(PaletteIcon, { className: "size-3.5" }) })] }) })] }));
}
//# sourceMappingURL=WhiteboardPane.js.map