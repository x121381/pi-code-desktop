import type { PaneSplitSide } from "@/v4/paneLayoutTree.js";
import type { WorkbenchSessionDragPayload } from "@/v4/workbenchDragDrop.js";
interface WorkbenchPointerDropTargetController {
    canDrop?: (payload: WorkbenchSessionDragPayload) => boolean;
    onDrop: (side: PaneSplitSide, payload: WorkbenchSessionDragPayload) => void;
    onPreview: (side: PaneSplitSide | null) => void;
}
declare function registerWorkbenchPointerDropTarget(element: HTMLElement, controller: WorkbenchPointerDropTargetController): () => void;
declare function updateWorkbenchPointerDrag(payload: WorkbenchSessionDragPayload, clientX: number, clientY: number): boolean;
declare function finishWorkbenchPointerDrag(payload: WorkbenchSessionDragPayload, clientX: number, clientY: number): boolean;
declare function cancelWorkbenchPointerDrag(): void;
export { cancelWorkbenchPointerDrag, finishWorkbenchPointerDrag, registerWorkbenchPointerDropTarget, updateWorkbenchPointerDrag, };
//# sourceMappingURL=workbenchPointerDragDrop.d.ts.map