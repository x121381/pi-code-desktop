function sortByWorkspaceKey(entries) {
    return [...entries].sort((left, right) => left.workspaceKey.localeCompare(right.workspaceKey));
}
export function buildWorkspaceTaskListVersionSignature(entries) {
    return JSON.stringify([...entries].sort(([left], [right]) => left.localeCompare(right)));
}
export function buildWorkspaceRemoteSessionSignature(entries) {
    return sortByWorkspaceKey(entries)
        .map((entry) => `${entry.workspaceKey}:${entry.remoteSessionId ?? "base"}:${entry.ready}`)
        .join("|");
}
export function areTaskListItemsEquivalent(left, right) {
    if (left.length !== right.length) {
        return false;
    }
    return left.every((leftTask, index) => {
        const rightTask = right[index];
        return Boolean(rightTask &&
            leftTask.taskId === rightTask.taskId &&
            leftTask.title === rightTask.title &&
            leftTask.updatedAt === rightTask.updatedAt &&
            leftTask.createdAt === rightTask.createdAt &&
            leftTask.status === rightTask.status &&
            leftTask.unreadAt === rightTask.unreadAt &&
            leftTask.provider === rightTask.provider &&
            leftTask.model === rightTask.model);
    });
}
//# sourceMappingURL=workspaceTaskListRefreshSignatures.js.map