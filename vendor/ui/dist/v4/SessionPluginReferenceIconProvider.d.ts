import { type ReactNode } from "react";
interface SessionPluginReferenceIconProviderProps {
    children: ReactNode;
    enabled: boolean;
    remoteSessionId?: string | null;
    sessionId: string | null;
    workspaceIdentity?: string;
    workspacePath: string;
}
/**
 * 已发送 Plugin chip 的惰性 Session-authority 图标边界。
 *
 * 把 catalog hook 直接挂在 SessionPane 后，即使 disabled 也会先解析
 * workspace services，导致所有无 Plugin 引用的会话产生额外依赖与请求。拆成子组件后，
 * 只有确实含 plugin:// 用户消息且 Session snapshot 就绪时才挂载数据 hook。
 */
export declare function SessionPluginReferenceIconBoundary({ children, enabled, remoteSessionId, sessionId, workspaceIdentity, workspacePath, }: SessionPluginReferenceIconProviderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SessionPluginReferenceIconProvider.d.ts.map