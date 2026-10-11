import { buildTaskWorkspaceKey } from "@/lib/taskQueryCache.js";
function taskKey(task) {
    return `${buildTaskWorkspaceKey(task.workspacePath, task.workspaceIdentity)}\u0000${task.taskId}`;
}
export { taskKey };
//# sourceMappingURL=ids.js.map