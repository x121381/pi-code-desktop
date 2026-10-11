export interface WebRemoteControlTaskReadTarget {
    taskId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    expectedUnreadAt: number;
}
export interface WebRemoteControlTaskReadService {
    setTaskUnread(params: WebRemoteControlTaskReadTarget & {
        unread: false;
    }): Promise<unknown>;
}
export interface WebRemoteControlTaskReadBridge {
    kind: "local" | "remote";
    workspacePath: string;
    workspaceIdentity?: string;
    initialTaskId?: string;
}
export type WebRemoteControlTaskReadResult = {
    ok: true;
} | {
    ok: false;
    error: unknown;
};
/**
 * 手机任务首页的 unreadAt 来自 desktop 快照，不保证存在于当前 Root 的 query cache。
 * 已读写入因此必须直接使用当前 shared-host bridge 的 task service 和精确 workspace identity。
 */
export declare function markWebRemoteControlTaskRead({ service, target, }: {
    service: WebRemoteControlTaskReadService;
    target: WebRemoteControlTaskReadTarget;
}): Promise<WebRemoteControlTaskReadResult>;
export declare function markWebRemoteControlBridgeTaskRead({ bridge, expectedUnreadAt, service, }: {
    bridge: WebRemoteControlTaskReadBridge;
    expectedUnreadAt?: number;
    service: WebRemoteControlTaskReadService;
}): Promise<WebRemoteControlTaskReadResult>;
