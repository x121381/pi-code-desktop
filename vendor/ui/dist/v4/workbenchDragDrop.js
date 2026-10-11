export const WORKBENCH_SESSION_DRAG_MIME = "application/x-zcode-session";
let activeWorkbenchSessionDragPayload = null;
export function serializeWorkbenchSessionDragPayload(payload) {
    return JSON.stringify(payload);
}
export function setActiveWorkbenchSessionDragPayload(payload) {
    activeWorkbenchSessionDragPayload = payload;
}
export function clearActiveWorkbenchSessionDragPayload() {
    activeWorkbenchSessionDragPayload = null;
}
function dataTransferHasType(dataTransfer) {
    return Array.from(dataTransfer.types ?? []).includes(WORKBENCH_SESSION_DRAG_MIME);
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function parseWorkbenchSessionDragPayload(dataTransfer) {
    if (!dataTransferHasType(dataTransfer)) {
        return null;
    }
    try {
        const raw = dataTransfer.getData(WORKBENCH_SESSION_DRAG_MIME);
        if (!raw) {
            return activeWorkbenchSessionDragPayload;
        }
        const parsed = JSON.parse(raw);
        if (!isRecord(parsed) ||
            parsed.kind !== "zcode/session" ||
            typeof parsed.workspacePath !== "string" ||
            typeof parsed.sessionId !== "string") {
            return null;
        }
        return {
            kind: "zcode/session",
            workspacePath: parsed.workspacePath,
            workspaceIdentity: typeof parsed.workspaceIdentity === "string" ? parsed.workspaceIdentity : undefined,
            remoteSessionId: typeof parsed.remoteSessionId === "string" ? parsed.remoteSessionId : undefined,
            sessionId: parsed.sessionId,
        };
    }
    catch {
        return null;
    }
}
export function resolveWorkbenchDropSide(rect, clientX, clientY) {
    if (rect.width <= 0 || rect.height <= 0) {
        return null;
    }
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) {
        return null;
    }
    const distances = [
        ["left", x],
        ["right", 1 - x],
        ["up", y],
        ["down", 1 - y],
    ];
    const [side, distance] = distances.reduce((best, candidate) => candidate[1] < best[1] ? candidate : best);
    return distance <= 0.32 ? side : null;
}
//# sourceMappingURL=workbenchDragDrop.js.map