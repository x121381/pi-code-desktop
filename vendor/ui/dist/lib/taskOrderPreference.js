const TASK_ORDER_STORAGE_KEY_PREFIX = "zcode-task-order:";
function getBrowserStorage() {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        return window.localStorage;
    }
    catch {
        return null;
    }
}
function getTaskOrderStorageKey(workspacePath) {
    return `${TASK_ORDER_STORAGE_KEY_PREFIX}${workspacePath}`;
}
function normalizeTaskOrder(taskIds) {
    const seen = new Set();
    return taskIds.filter((taskId) => {
        if (typeof taskId !== "string" || taskId.length === 0 || seen.has(taskId)) {
            return false;
        }
        seen.add(taskId);
        return true;
    });
}
export function readTaskOrder(workspacePath, storage = getBrowserStorage()) {
    const rawValue = storage?.getItem(getTaskOrderStorageKey(workspacePath));
    if (!rawValue) {
        return [];
    }
    try {
        const parsed = JSON.parse(rawValue);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return normalizeTaskOrder(parsed);
    }
    catch {
        return [];
    }
}
export function persistTaskOrder(workspacePath, taskIds, storage = getBrowserStorage()) {
    storage?.setItem(getTaskOrderStorageKey(workspacePath), JSON.stringify(normalizeTaskOrder(taskIds)));
}
export function pruneTaskOrder(taskOrder, tasks) {
    const taskIds = new Set(tasks.map((task) => task.taskId));
    return normalizeTaskOrder(taskOrder).filter((taskId) => taskIds.has(taskId));
}
export function sortTasksByOrder(tasks, taskOrder) {
    const normalizedTaskOrder = normalizeTaskOrder(taskOrder);
    const orderedIndexByTaskId = new Map(normalizedTaskOrder.map((taskId, index) => [taskId, index]));
    return [...tasks].sort((left, right) => {
        const leftIndex = orderedIndexByTaskId.get(left.taskId);
        const rightIndex = orderedIndexByTaskId.get(right.taskId);
        if (leftIndex == null && rightIndex == null) {
            return right.updatedAt - left.updatedAt;
        }
        // 新出现、还没被手动排过序的任务优先放在前面，避免被历史自定义顺序完全埋住。
        if (leftIndex == null) {
            return -1;
        }
        if (rightIndex == null) {
            return 1;
        }
        return leftIndex - rightIndex;
    });
}
//# sourceMappingURL=taskOrderPreference.js.map