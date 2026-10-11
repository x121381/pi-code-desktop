export function buildChangeSummaryDiffViewerSource({ patch, path, snapshot, relativePath, workspacePath, workspaceIdentity, workspaceRemoteSessionId, }) {
    const workspaceScope = {
        ...(workspacePath ? { workspacePath } : {}),
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}),
    };
    if (patch) {
        return {
            type: "patch",
            title: relativePath,
            path: path ?? snapshot?.path,
            patch,
            ...workspaceScope,
        };
    }
    if (!snapshot) {
        return undefined;
    }
    return {
        type: "multi-file-diff",
        title: relativePath,
        path: snapshot.path,
        beforeContent: snapshot.beforeContent ?? "",
        afterContent: snapshot.afterContent,
        ...workspaceScope,
    };
}
export function buildChangeSummaryFilePreviewSource(input) {
    const { path, relativePath, workspacePath, workspaceIdentity, workspaceRemoteSessionId } = input;
    return {
        type: "file",
        title: relativePath,
        path,
        workspacePath,
        ...(workspaceIdentity ? { workspaceIdentity } : {}),
        ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}),
    };
}
export function openChangeSummaryDiffViewer(source, onOpenCodeViewer) {
    if (!source || !onOpenCodeViewer) {
        return false;
    }
    onOpenCodeViewer(source);
    return true;
}
//# sourceMappingURL=messageChangeSummaryPreview.js.map