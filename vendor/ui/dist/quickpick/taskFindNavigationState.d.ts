export interface TaskFindNavigationState {
    activeIndex: number;
    navigationRequestId: number;
    query: string;
}
export declare function createTaskFindNavigationState(): TaskFindNavigationState;
export declare function changeTaskFindSelection(state: TaskFindNavigationState, query: string, activeIndex: number): TaskFindNavigationState;
export declare function navigateTaskFindSelection(state: TaskFindNavigationState, query: string, activeIndex: number): TaskFindNavigationState;
//# sourceMappingURL=taskFindNavigationState.d.ts.map