export type TaskLifecycleEventType = "archived" | "deleted";
export interface TaskLifecycleEvent {
    type: TaskLifecycleEventType;
    taskId: string;
    workspaceKey: string;
}
type TaskLifecycleListener = (event: TaskLifecycleEvent) => void;
export declare function subscribeTaskLifecycle(listener: TaskLifecycleListener): () => void;
export declare function notifyTaskLifecycle(event: TaskLifecycleEvent): void;
export {};
//# sourceMappingURL=taskLifecycleEvents.d.ts.map