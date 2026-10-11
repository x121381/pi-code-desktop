import { type ReactNode } from "react";
import { type IServiceAccessor } from "@zcode/services";
import { ConversationTelemetrySupervisor } from "@/v4/telemetry/conversationTelemetrySupervisor.js";
interface ConversationTelemetryAttachmentScope {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
/** 窗口/测试销毁边界；生产 page 生命周期结束时不保留 orphan subscription。 */
export declare function disposeConversationTelemetrySupervisors(): void;
/**
 * Root tab 事实源裁决 workspace detach。切 task/切 tab 不会移除 scope；真正关闭最后一个
 * workspace tab 才标记 detached，零引用立即销毁，有存量 pane 则等其 release 后销毁。
 */
export declare function reconcileConversationTelemetryWorkspaceScopes(scopes: readonly ConversationTelemetryAttachmentScope[]): void;
/**
 * 窗口 workspace/service attachment：生命周期高于 pane 和 SessionDataLayer keep-warm。
 * Web/mobile 不创建 supervisor，也不安装 reporter/subscription。
 */
export declare function ConversationTelemetryWorkspaceAttachment({ enabled, foregroundEnabled, services, workspacePath, workspaceIdentity, remoteSessionId, children, }: ConversationTelemetryAttachmentScope & {
    enabled: boolean;
    foregroundEnabled?: boolean;
    services: IServiceAccessor;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** pane 使用自己的 ready service/scope 覆盖 context；Web 根 attachment 为 null 时保持 no-op。 */
export declare function ConversationTelemetryPaneAttachment({ services, scope, children, }: {
    services: IServiceAccessor;
    scope: ConversationTelemetryAttachmentScope;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare function useScopedConversationTelemetrySupervisor(scope: ConversationTelemetryAttachmentScope): ConversationTelemetrySupervisor | null;
export declare function useScopedConversationTelemetryForegroundEnabled(scope: ConversationTelemetryAttachmentScope): boolean;
export {};
//# sourceMappingURL=ConversationTelemetryAttachment.d.ts.map