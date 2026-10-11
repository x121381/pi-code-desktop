interface TaskWorkbenchDragPreviewParams {
    clientX: number;
    clientY: number;
    dataTransfer: Pick<DataTransfer, "setDragImage">;
    source: HTMLElement;
}
declare function createTaskWorkbenchDragPreview({ clientX, clientY, dataTransfer, source, }: TaskWorkbenchDragPreviewParams): () => void;
export { createTaskWorkbenchDragPreview };
//# sourceMappingURL=taskWorkbenchDragPreview.d.ts.map