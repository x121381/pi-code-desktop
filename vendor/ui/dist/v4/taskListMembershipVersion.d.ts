/** task row 或 membership mutation 后调用：通知所有 sessions-index 派生列表重新拉取左表。 */
export declare function bumpTaskListMembershipVersion(): void;
export declare function subscribeTaskListMembershipVersion(listener: () => void): () => void;
export declare function getTaskListMembershipVersion(): number;
interface MembershipBumpEventLike {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId?: string;
    reason: string;
    taskMeta?: {
        updatedAt: number;
        unreadAt?: number;
    };
}
export declare function bumpTaskListMembershipVersionForWorkspaceEvent(event: MembershipBumpEventLike): void;
/** React 绑定：版本号变化触发重渲染（subscribe/get 是模块级函数，引用稳定）。 */
export declare function useTaskListMembershipVersion(): number;
export {};
//# sourceMappingURL=taskListMembershipVersion.d.ts.map