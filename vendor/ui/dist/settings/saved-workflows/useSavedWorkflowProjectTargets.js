import { useMemo } from "react";
/**
 * 一个项目组要用到的三套坐标（所有动作都带**本项目**的
 * target）。三者只在是否携带 remoteSessionId 上不同；引用在依赖不变时保持稳定，供 memo / effect 依赖。
 */
export function useSavedWorkflowProjectTargets(project, remoteSessionId) {
    const target = useMemo(() => ({
        workspacePath: project.workspacePath,
        ...(project.workspaceIdentity?.trim()
            ? { workspaceIdentity: project.workspaceIdentity }
            : {}),
        ...(remoteSessionId ? { remoteSessionId } : {}),
    }), [project.workspacePath, project.workspaceIdentity, remoteSessionId]);
    const projectTarget = useMemo(() => ({
        workspacePath: project.workspacePath,
        ...(project.workspaceIdentity ? { workspaceIdentity: project.workspaceIdentity } : {}),
    }), [project.workspacePath, project.workspaceIdentity]);
    const launchTarget = useMemo(() => ({
        workspacePath: project.workspacePath,
        ...(project.workspaceIdentity ? { workspaceIdentity: project.workspaceIdentity } : {}),
        ...(remoteSessionId ? { remoteSessionId } : {}),
    }), [project.workspacePath, project.workspaceIdentity, remoteSessionId]);
    return { target, projectTarget, launchTarget };
}
//# sourceMappingURL=useSavedWorkflowProjectTargets.js.map