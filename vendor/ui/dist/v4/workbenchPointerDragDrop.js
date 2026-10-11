import { resolveWorkbenchDropSide } from "../v4/workbenchDragDrop.js";
const targets = new Set();
let previewedTarget = null;
function clearPreview() {
    previewedTarget?.controller.onPreview(null);
    previewedTarget = null;
}
function resolveTarget(payload, clientX, clientY) {
    for (const target of targets) {
        if (target.controller.canDrop && !target.controller.canDrop(payload)) {
            continue;
        }
        const side = resolveWorkbenchDropSide(target.element.getBoundingClientRect(), clientX, clientY);
        if (side) {
            return { side, target };
        }
    }
    return null;
}
function registerWorkbenchPointerDropTarget(element, controller) {
    const target = { controller, element };
    targets.add(target);
    return () => {
        if (previewedTarget === target) {
            clearPreview();
        }
        targets.delete(target);
    };
}
function updateWorkbenchPointerDrag(payload, clientX, clientY) {
    const resolved = resolveTarget(payload, clientX, clientY);
    if (!resolved) {
        clearPreview();
        return false;
    }
    if (previewedTarget !== resolved.target) {
        clearPreview();
        previewedTarget = resolved.target;
    }
    resolved.target.controller.onPreview(resolved.side);
    return true;
}
function finishWorkbenchPointerDrag(payload, clientX, clientY) {
    const resolved = resolveTarget(payload, clientX, clientY);
    clearPreview();
    if (!resolved) {
        return false;
    }
    resolved.target.controller.onDrop(resolved.side, payload);
    return true;
}
function cancelWorkbenchPointerDrag() {
    clearPreview();
}
export { cancelWorkbenchPointerDrag, finishWorkbenchPointerDrag, registerWorkbenchPointerDropTarget, updateWorkbenchPointerDrag, };
//# sourceMappingURL=workbenchPointerDragDrop.js.map