export function createTaskFindNavigationState() {
    return {
        activeIndex: -1,
        navigationRequestId: 0,
        query: "",
    };
}
export function changeTaskFindSelection(state, query, activeIndex) {
    return {
        activeIndex,
        navigationRequestId: state.navigationRequestId,
        query,
    };
}
export function navigateTaskFindSelection(state, query, activeIndex) {
    // 单命中环绕时 query/index 不变，导航身份必须在状态持有层独立递增。
    // 将三项状态放在同一次转换里，避免 App 的多个 setter 被后续维护拆散。
    return {
        activeIndex,
        navigationRequestId: state.navigationRequestId + 1,
        query,
    };
}
//# sourceMappingURL=taskFindNavigationState.js.map