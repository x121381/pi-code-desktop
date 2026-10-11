import { ALL_BOT_WORKSPACES, } from "@zcode/shared";
export function getWorkspaceKey(workspacePath, workspaceIdentity) {
    return workspaceIdentity?.trim() || workspacePath;
}
export function getWorkspaceLabel(workspacePath) {
    return workspacePath.split(/[\\/]/u).filter(Boolean).at(-1) ?? workspacePath;
}
export function createWorkspaceRef(workspacePath, workspaceIdentity) {
    const id = getWorkspaceKey(workspacePath, workspaceIdentity);
    return {
        id,
        label: getWorkspaceLabel(workspacePath),
        workspacePath,
        workspaceIdentity,
    };
}
function isAllWorkspacesAllowed(allowedWorkspaces) {
    return allowedWorkspaces.length === 0 || allowedWorkspaces.includes(ALL_BOT_WORKSPACES);
}
export function normalizeAllowedWorkspaces(allowedWorkspaces) {
    const workspaceIds = allowedWorkspaces.map((item) => item.trim()).filter(Boolean);
    if (isAllWorkspacesAllowed(workspaceIds)) {
        return [ALL_BOT_WORKSPACES];
    }
    return [...new Set(workspaceIds)];
}
export function isWorkspaceAllowed(workspaceId, allowedWorkspaces) {
    return isAllWorkspacesAllowed(allowedWorkspaces) || allowedWorkspaces.includes(workspaceId);
}
export function filterAllowedWorkspaces(workspaces, allowedWorkspaces) {
    return isAllWorkspacesAllowed(allowedWorkspaces)
        ? workspaces
        : workspaces.filter((workspace) => allowedWorkspaces.includes(workspace.id));
}
function resolveCanonicalWorkspaceId(value, workspaces) {
    const trimmed = value?.trim();
    if (!trimmed) {
        return undefined;
    }
    const samePathWorkspaces = workspaces.filter((workspace) => workspace.workspacePath === trimmed);
    const exactWorkspace = workspaces.find((workspace) => workspace.id === trimmed);
    if (exactWorkspace) {
        const identityCandidates = samePathWorkspaces.filter((workspace) => workspace.workspaceIdentity);
        if (!exactWorkspace.workspaceIdentity && identityCandidates.length === 1) {
            return identityCandidates[0].id;
        }
        return exactWorkspace.id;
    }
    return samePathWorkspaces.length === 1 ? samePathWorkspaces[0].id : trimmed;
}
export function normalizeConfiguredAllowedWorkspaces(allowedWorkspaces, workspaces) {
    const normalized = normalizeAllowedWorkspaces(allowedWorkspaces);
    if (isAllWorkspacesAllowed(normalized)) {
        return [ALL_BOT_WORKSPACES];
    }
    return [
        ...new Set(normalized.map((workspaceId) => resolveCanonicalWorkspaceId(workspaceId, workspaces) ?? workspaceId)),
    ];
}
export function firstAllowedWorkspace(workspaceRefs, bot) {
    const allowedWorkspaces = filterAllowedWorkspaces(workspaceRefs, bot.allowedWorkspaces);
    return allowedWorkspaces[0] ?? null;
}
function normalizeText(value) {
    return value.trim().toLowerCase();
}
export function resolveWorkspaceByValue(workspaceRefs, value, allowedIds) {
    const trimmed = value.trim();
    const index = Number.parseInt(trimmed, 10);
    const workspaces = filterAllowedWorkspaces(workspaceRefs, allowedIds);
    if (Number.isFinite(index) && index > 0) {
        return workspaces[index - 1] ?? null;
    }
    const normalized = normalizeText(trimmed);
    return (workspaces.find((workspace) => normalizeText(workspace.id) === normalized ||
        normalizeText(workspace.label) === normalized ||
        workspace.workspacePath === trimmed ||
        getWorkspaceKey(workspace.workspacePath, workspace.workspaceIdentity) === trimmed) ?? null);
}
//# sourceMappingURL=workspaceHelpers.js.map