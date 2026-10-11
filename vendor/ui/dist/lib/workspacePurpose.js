export function getWorkspacePurpose(target) {
    return target.workspacePurpose === "conversation"
        ? "conversation"
        : "project";
}
export function partitionWorkspaceTabsByPurpose(workspaceTabs) {
    const conversationWorkspaceTabs = [];
    const projectWorkspaceTabs = [];
    for (const tab of workspaceTabs) {
        if (getWorkspacePurpose(tab) === "conversation") {
            conversationWorkspaceTabs.push(tab);
        }
        else {
            projectWorkspaceTabs.push(tab);
        }
    }
    return {
        allTaskWorkspaceTabs: workspaceTabs,
        conversationWorkspaceTabs,
        projectWorkspaceTabs,
    };
}
//# sourceMappingURL=workspacePurpose.js.map