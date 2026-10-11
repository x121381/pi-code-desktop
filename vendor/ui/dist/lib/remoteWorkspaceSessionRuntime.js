import { getWorkspaceDisplayedTaskState } from "@/store/zcodeSessionStore.js";
function isRunningRuntimeStatus(status) {
    return status === "creating" || status === "restoring" || status === "streaming";
}
function shouldTreatPersistedRunningTaskAsRunning(workspaceState, taskId) {
    const runtimeState = workspaceState.taskRuntimeByTaskId[taskId];
    if (!runtimeState) {
        return true;
    }
    // task meta cache 可能晚于 stream terminal event 刷新，仍短暂保留 running。
    // 如果本地 runtime 已有明确非运行态，断连收口不能再被滞后的 meta running 覆盖成 failed。
    return isRunningRuntimeStatus(runtimeState.status);
}
function collectRemoteWorkspaceRunningTaskIds(workspaceState) {
    const taskIds = new Set();
    if (workspaceState.activeTaskId &&
        isRunningRuntimeStatus(getWorkspaceDisplayedTaskState(workspaceState).taskStatus)) {
        taskIds.add(workspaceState.activeTaskId);
    }
    for (const [taskId, runtimeState] of Object.entries(workspaceState.taskRuntimeByTaskId)) {
        if (isRunningRuntimeStatus(runtimeState.status)) {
            taskIds.add(taskId);
        }
    }
    for (const task of workspaceState.taskListCache ?? []) {
        if (task.status === "running" &&
            shouldTreatPersistedRunningTaskAsRunning(workspaceState, task.taskId)) {
            taskIds.add(task.taskId);
        }
    }
    for (const task of Object.values(workspaceState.optimisticTaskListByTaskId)) {
        if (task.status === "running" &&
            shouldTreatPersistedRunningTaskAsRunning(workspaceState, task.taskId)) {
            taskIds.add(task.taskId);
        }
    }
    return [...taskIds];
}
export function markRemoteWorkspaceRunningTasksFailed({ tabs, getWorkspaceState, setTaskRuntimeState, reason, }) {
    const markedTaskKeys = new Set();
    for (const tab of tabs) {
        const workspaceState = getWorkspaceState(tab.workspacePath, tab.workspaceIdentity);
        const workspaceKey = tab.workspaceIdentity?.trim() || tab.workspacePath;
        for (const taskId of collectRemoteWorkspaceRunningTaskIds(workspaceState)) {
            const taskKey = `${workspaceKey}\0${taskId}`;
            if (markedTaskKeys.has(taskKey)) {
                continue;
            }
            markedTaskKeys.add(taskKey);
            // SSH 半开断连时远端 task_error 可能到不了 renderer，
            // 仅清 remoteSessionId 会让任务列表继续按 running/streaming 显示 loading。
            // 这里只收口本地 UI runtime，不写远端 snapshot；重连后仍以远端持久状态为准。
            setTaskRuntimeState(tab.workspacePath, taskId, "failed", reason, tab.workspaceIdentity);
        }
    }
    return markedTaskKeys.size;
}
//# sourceMappingURL=remoteWorkspaceSessionRuntime.js.map