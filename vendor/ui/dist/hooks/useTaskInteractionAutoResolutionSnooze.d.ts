export interface TaskInteractionAutoResolutionTarget {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sessionId: string;
}
/**
 * 侧栏 task 可能来自本地、远端、timeline 或 pinned 列表；暂停命令必须按 workspace identity
 * 找到原 host，不能因为当前激活 tab 不同而发到当前窗口的 service。
 */
export declare function useTaskInteractionAutoResolutionSnooze(target: TaskInteractionAutoResolutionTarget): (interactionId: string) => Promise<boolean>;
//# sourceMappingURL=useTaskInteractionAutoResolutionSnooze.d.ts.map