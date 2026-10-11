import type { IServiceAccessor } from "@zcode/services";
export declare function SidePaneTerminalPane({ services, sessionId, workspaceKey, cwd, isVisible, isWindowsDesktop, onOpenBrowserUrl, }: {
    services: IServiceAccessor;
    /**
     * 保活：sessionId 复用 tab.id（跨 workspace 稳定），同时作为 TerminalSession 的 persistentKey。
     * 让 xterm+PTY 所有权进 sidePaneTerminalSessionRegistry 模块级单例，
     * 组件卸载只 detach、不 dispose；重挂按 key 复用，scrollback 跨 workspace 保活。
     */
    sessionId: string;
    /**
     * workspace 身份隔离 key（= workspaceIdentity?.trim() || workspacePath）。
     * 写入 registry entry.workspaceKey，workspace tab 关闭时按此批量回收 PTY。
     */
    workspaceKey?: string;
    cwd?: string;
    isVisible: boolean;
    isWindowsDesktop?: boolean;
    onOpenBrowserUrl: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SidePaneTerminalPane.d.ts.map