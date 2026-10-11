interface WorkbenchPointerPosition {
    x: number;
    y: number;
}
interface WorkbenchPointerPositionTracker {
    dispose: () => void;
    getPosition: () => WorkbenchPointerPosition;
}
declare function createWorkbenchPointerPositionTracker(ownerDocument: Document, activatorEvent: Event): WorkbenchPointerPositionTracker | null;
export { createWorkbenchPointerPositionTracker, type WorkbenchPointerPositionTracker };
//# sourceMappingURL=workbenchPointerPositionTracker.d.ts.map