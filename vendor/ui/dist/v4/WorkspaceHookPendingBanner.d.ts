/**
 * 软门禁 dismiss store：轻量模块级 Map。
 * 幂等 key = sessionId + bundleDigest；bundle 变化后提示条重新出现。
 * 不落盘——刷新或重载后重新提示，符合「用户应该知道」的产品语义。
 */
declare class WorkspaceHookPendingDismissStore {
    private dismissed;
    /** 标记某个 session+bundle 组合已 dismiss */
    dismiss(sessionId: string, bundleDigest: string): void;
    /** 查询是否已 dismiss */
    isDismissed(sessionId: string, bundleDigest: string): boolean;
    /** 清空全部 dismiss 记录（测试用） */
    clear(): void;
    private key;
}
export declare const workspaceHookPendingDismissStore: WorkspaceHookPendingDismissStore;
export interface WorkspaceHookAdmissionInfo {
    pendingCount: number;
    bundleDigest: string;
    workspaceIdentity?: string;
}
export interface WorkspaceHookPendingBannerProps {
    sessionId: string;
    workspacePath: string;
    workspaceIdentity?: string;
    admission: WorkspaceHookAdmissionInfo | null;
}
/**
 * 软门禁常驻提示条。
 *
 * 当 snapshot.workspaceHookAdmission.pendingCount > 0 时显示，提供 [去审核] 与 [忽略]。
 * - [去审核]：打开设置页 Hooks 分区 + 发送 requestWorkspaceHookReview 命令。
 *   命令发送失败不阻断导航（容错，logger 记 warn）。
 * - [忽略]：renderer 本地 dismiss，幂等 key = sessionId + bundleDigest。
 */
export declare const WorkspaceHookPendingBanner: import("react").MemoExoticComponent<({ sessionId, workspacePath, workspaceIdentity, admission, }: WorkspaceHookPendingBannerProps) => import("react/jsx-runtime").JSX.Element | null>;
export {};
//# sourceMappingURL=WorkspaceHookPendingBanner.d.ts.map