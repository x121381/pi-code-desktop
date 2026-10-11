const WORKSPACE_PATH_OPEN_REQUEST_EVENT = "zcode:workspace-path-open-request";
export function selectWorkspacePathFileService(target, workspaceFileService, baseFileService) {
    return target.serviceScope === "base-local" ? baseFileService : workspaceFileService;
}
export function shouldFallbackWorkspacePathToCodeViewer(target) {
    return target.serviceScope !== "base-local";
}
export function requestWorkspacePathOpen(target) {
    window.dispatchEvent(new CustomEvent(WORKSPACE_PATH_OPEN_REQUEST_EVENT, {
        detail: target,
    }));
}
export function addWorkspacePathOpenRequestListener(listener) {
    const handleRequest = (event) => {
        const target = event.detail;
        if (!target || typeof target.path !== "string")
            return;
        listener(target);
    };
    window.addEventListener(WORKSPACE_PATH_OPEN_REQUEST_EVENT, handleRequest);
    return () => window.removeEventListener(WORKSPACE_PATH_OPEN_REQUEST_EVENT, handleRequest);
}
//# sourceMappingURL=workspacePathNavigation.js.map