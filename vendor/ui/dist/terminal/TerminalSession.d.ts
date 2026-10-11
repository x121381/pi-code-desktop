import type { IServiceAccessor } from "@zcode/services";
export declare function TerminalSession({ sessionId, services, cwd, isVisible, isPanelResizing, isWindowsDesktop, onShellLabelChange, onExit, onOpenBrowserUrl, persistentKey, workspaceKey, }: {
    sessionId: string;
    services: IServiceAccessor;
    cwd?: string;
    isVisible: boolean;
    isPanelResizing?: boolean;
    isWindowsDesktop?: boolean;
    onShellLabelChange: (sessionId: string, shellLabel: string | null) => void;
    onExit?: (sessionId: string, exitCode: number) => void;
    onOpenBrowserUrl: (url: string) => void;
    /**
     * 跨组件生命周期的会话复用 key（仅 side pane terminal 用）。
     * 传入后 xterm 实例 + PTY 所有权上移到 sidePaneTerminalSessionRegistry 模块级单例，
     * 组件卸载只 detach DOM、不 dispose；重挂按 key 复用，scrollback 历史跨 workspace 保活。
     * 不传（下侧 terminal）走原 effect 路径，字节级不变。
     */
    persistentKey?: string;
    /**
     * workspace 身份隔离 key（= workspaceIdentity?.trim() || workspacePath）。
     * 仅 persistentKey 路径用：写入 registry entry.workspaceKey，
     * 供 workspace tab 真正关闭时按 workspaceKey 批量回收 PTY（对称下侧 openWorkspaceKeys 回收）。
     * 不传时 fallback 到 cwd。下侧 terminal 不传 persistentKey，此值不生效。
     */
    workspaceKey?: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=TerminalSession.d.ts.map