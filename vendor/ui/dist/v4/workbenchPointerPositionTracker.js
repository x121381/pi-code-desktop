function readPointerPosition(event) {
    if (!("clientX" in event) || !("clientY" in event)) {
        return null;
    }
    const { clientX, clientY } = event;
    return typeof clientX === "number" && typeof clientY === "number"
        ? { x: clientX, y: clientY }
        : null;
}
function createWorkbenchPointerPositionTracker(ownerDocument, activatorEvent) {
    const initialPosition = readPointerPosition(activatorEvent);
    if (!initialPosition) {
        return null;
    }
    let position = initialPosition;
    let disposed = false;
    const stopObserving = () => {
        if (disposed) {
            return;
        }
        disposed = true;
        ownerDocument.removeEventListener("pointermove", handlePointerMove, true);
        ownerDocument.removeEventListener("pointerup", handlePointerUp, true);
        ownerDocument.removeEventListener("pointercancel", handlePointerCancel, true);
    };
    const handlePointerMove = (event) => {
        position = { x: event.clientX, y: event.clientY };
    };
    const handlePointerUp = (event) => {
        position = { x: event.clientX, y: event.clientY };
        stopObserving();
    };
    const handlePointerCancel = () => {
        stopObserving();
    };
    ownerDocument.addEventListener("pointermove", handlePointerMove, true);
    ownerDocument.addEventListener("pointerup", handlePointerUp, true);
    ownerDocument.addEventListener("pointercancel", handlePointerCancel, true);
    return {
        dispose: stopObserving,
        getPosition: () => position,
    };
}
export { createWorkbenchPointerPositionTracker };
//# sourceMappingURL=workbenchPointerPositionTracker.js.map