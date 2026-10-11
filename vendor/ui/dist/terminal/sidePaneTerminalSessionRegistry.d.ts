import type { FitAddon } from "@xterm/addon-fit";
import type { ITheme, Terminal as XTerm } from "@xterm/xterm";
/**
 * 一个 side pane terminal 会话的常驻资源。
 *
 * - term/fitAddon：xterm 实例（含 scrollback 历史）+ fit 插件，跨 workspace 复用同一实例。
 * - terminalId：terminalService 分配的 PTY id（根级共享 service，本地 workspace 共用 baseServices）。
 * - hostEl：term.open 的常驻容器。它在 stashDiv（隐藏暂存）和实际渲染容器之间物理移动，
 *           xterm DOM 子树随它一起移动，term 实例和 scrollback 不变。
 * - dispose：真回收（关 tab 时调）——杀 PTY + 销 xterm + 释放订阅。由 TerminalSession 创建方注入，
 *            registry 本身不依赖 terminalService（service 走依赖注入，不在这里硬编码）。
 */
export interface SidePaneTerminalSessionEntry {
    key: string;
    term: XTerm;
    fitAddon: FitAddon;
    terminalId: string;
    cwd: string;
    /**
     * 该 terminal 所属的 workspaceKey（= workspaceIdentity?.trim() || workspacePath）。
     * 仅用于 workspace tab 真正关闭时按 workspaceKey 批量回收（对称下侧 openWorkspaceKeys 回收）。
     * 切 workspace 不会触发回收，只有该 workspace 从 openWorkspaceKeys 移除才回收。
     */
    workspaceKey: string;
    hostEl: HTMLDivElement;
    /**
     * terminalService.create() 返回的终端 profile theme（用户终端配置的颜色）。
     * Bug 背景：原实现只写组件局部 terminalProfileThemeRef，组件卸载后 ref 销毁；
     * 重挂时新组件 ref 被重置为 undefined，复用 observer 用 undefined 合并出基础主题，丢掉 profile theme。
     * 所有权上移到 entry，让 profile theme 与 term/PTY 同一常驻所有者，跨组件生命周期复用不丢。
     */
    profileTheme?: ITheme;
    /** 真 dispose：杀 PTY + 销 xterm + 释放订阅 + 移除 hostEl。由创建方（TerminalSession persistentKey 路径）注入。 */
    dispose: () => void;
}
/**
 * side pane terminal session 模块级单例。
 *
 * 不直接 new XTerm / 调 terminalService——资源创建由 TerminalSession 的 persistentKey 路径完成，
 * 再 register 进来。registry 只负责「存取 + DOM 移动 + 回收」，保持与服务层解耦。
 */
export declare const sidePaneTerminalSessionRegistry: {
    has(key: string): boolean;
    get(key: string): SidePaneTerminalSessionEntry | undefined;
    /** TerminalSession persistentKey 路径首次创建资源后，把 entry 存入 registry 常驻。 */
    register(key: string, entry: SidePaneTerminalSessionEntry): void;
    /**
     * 把 entry.hostEl 物理移动到 host 容器（attach）。
     * xterm 的 .xterm DOM 子树随 hostEl 一起移动，term 实例不变；移动后调用方负责 fitAddon.fit() 恢复尺寸。
     */
    attachDom(key: string, host: HTMLElement): void;
    /**
     * 把 entry.hostEl 移回 stashDiv（detach）。
     * 组件卸载时调——不 dispose term/PTY/订阅，资源留在 registry 供下次重挂复用。
     */
    detachDom(key: string): void;
    /** 显式关闭 side pane terminal tab 时调：真 dispose（杀 PTY + 销 xterm + 释放订阅）。 */
    release(key: string): void;
    /**
     * 批量回收（workspace tab 关闭时按 workspaceKey 过滤）。
     * 对称下侧 Terminal.tsx 的 openWorkspaceKeys 回收逻辑。
     */
    releaseByPredicate(pred: (entry: SidePaneTerminalSessionEntry) => boolean): void;
    /** 测试专用：清空所有 session 并移除 stashDiv。 */
    clearForTest(): void;
};
//# sourceMappingURL=sidePaneTerminalSessionRegistry.d.ts.map