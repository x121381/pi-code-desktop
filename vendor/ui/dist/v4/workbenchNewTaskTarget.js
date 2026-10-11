import { effectiveFocusedPaneId, V4_PRIMARY_PANE_ID, } from "../v4/paneLayoutStore.js";
import { selectWorkbenchGroupPaneBinding } from "../v4/workbenchGroupStore.js";
function targetFromScope(scope) {
    return {
        workspacePath: scope.workspacePath,
        ...(scope.workspaceIdentity?.trim() ? { workspaceIdentity: scope.workspaceIdentity } : {}),
    };
}
export function resolveWorkbenchNewTaskTarget({ activeWorkspacePath, activeWorkspaceIdentity, activeGroup, paneLayout, }) {
    if (activeGroup) {
        const binding = selectWorkbenchGroupPaneBinding(activeGroup, activeGroup.focusedPaneId);
        if (binding) {
            return targetFromScope(binding.workspaceScope);
        }
    }
    const focusedPaneId = effectiveFocusedPaneId(paneLayout);
    if (focusedPaneId !== V4_PRIMARY_PANE_ID) {
        const binding = paneLayout.panes[focusedPaneId];
        if (binding) {
            return targetFromScope(binding.workspaceScope);
        }
    }
    return activeWorkspacePath
        ? {
            workspacePath: activeWorkspacePath,
            ...(activeWorkspaceIdentity?.trim() ? { workspaceIdentity: activeWorkspaceIdentity } : {}),
        }
        : null;
}
//# sourceMappingURL=workbenchNewTaskTarget.js.map