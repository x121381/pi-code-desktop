import { isPptxElementReferenceInWorkspaceScope, } from "@/lib/pptxElementReference.js";
import { isWorkspaceFilePathInside } from "@/workspace-file-tree/model.js";
function createPptxReferencePreviewNavigation(reference) {
    const requestId = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `pptx-preview-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
        requestId,
        pageIndex: reference.slideIndex,
        expectedSourceFingerprint: reference.sourceFingerprint,
    };
}
export function createPptxElementReferencePreviewSource(reference, scope) {
    if (!isPptxElementReferenceInWorkspaceScope(reference, scope) ||
        !isWorkspaceFilePathInside(reference.workspacePath, reference.sourcePath)) {
        return null;
    }
    return {
        type: "pptx",
        title: reference.sourceTitle,
        path: reference.sourcePath,
        workspacePath: reference.workspacePath,
        ...(reference.workspaceIdentity
            ? { workspaceIdentity: reference.workspaceIdentity }
            : {}),
        ...(reference.remoteSessionId
            ? { workspaceRemoteSessionId: reference.remoteSessionId }
            : {}),
        referenceNavigation: createPptxReferencePreviewNavigation(reference),
    };
}
//# sourceMappingURL=pptxElementReferencePreview.js.map