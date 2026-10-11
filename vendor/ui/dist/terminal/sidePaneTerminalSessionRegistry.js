// sidePaneTerminalSessionRegistry —— side pane terminal 跨 workspace 会话保活的模块级单例。
//
// 如果 xterm、PTY 与订阅由 TerminalSession 组件持有，切换 workspace 触发的卸载
// 就会关闭进程并丢失历史。由模块级 registry 持有这些资源，组件只负责挂载显示，
// 可以让终端会话跨 workspace 切换继续存活。
//
// 修复思路（对称下侧思想，但形态不同）：
//   把 side pane terminal 的 xterm 实例 + PTY 关联**所有权上移到这个模块级单例**，
//   脱离 TerminalSession 组件 effect 生命周期。组件任意卸载/重挂都不动 xterm/PTY，
//   重挂时按 persistentKey(=tab.id) 取回 entry，把 hostEl 物理移回容器即可。
//
// 不与下侧 terminal 共享 session。
// 仅 SidePaneTerminalPane 通过 TerminalSession 的 persistentKey prop 接入；下侧不传 persistentKey，
// 走 TerminalSession 原 effect 路径，与 registry 完全无关。
import { uiMemoryDiagnosticsRegistry } from "@/lib/memoryDiagnostics.js";
// 模块级状态：跨 workspace、跨 React 组件树常驻。
const sessions = new Map();
// 内存诊断计数器：常驻 xterm 实例数无上限，先落日志。
uiMemoryDiagnosticsRegistry.register("xterm", () => ({ sessions: sessions.size }));
// 隐藏暂存容器：存放 detached 的 hostEl，避免被 React 卸载渲染容器时连带销毁 xterm DOM。
let stashDiv = null;
function getStashDiv() {
    // 兼容：SSR/web 测试环境可能没有 document。
    if (typeof document === "undefined")
        return null;
    if (!stashDiv) {
        stashDiv = document.createElement("div");
        stashDiv.style.display = "none";
        stashDiv.setAttribute("data-side-pane-terminal-stash", "");
        document.body.appendChild(stashDiv);
    }
    return stashDiv;
}
function releaseEntry(key) {
    const entry = sessions.get(key);
    if (!entry)
        return;
    sessions.delete(key);
    try {
        entry.dispose();
    }
    catch (error) {
        // Bug 说明：dispose 内部杀 PTY/销 xterm，理论上不应抛；但即使抛也不能阻塞关 tab 流程，
        // 否则单个 terminal release 异常会卡住整批关闭（关闭其他/全部）。吞掉打日志，对称下侧容错。
        // 风险：PTY 可能残留，由 terminalService disposeAll 在 host 退出时兜底回收。
        if (typeof console !== "undefined") {
            // eslint-disable-next-line no-console
            console.warn("[sidePaneTerminalSessionRegistry] release dispose failed", error);
        }
    }
    entry.hostEl.remove();
}
/**
 * side pane terminal session 模块级单例。
 *
 * 不直接 new XTerm / 调 terminalService——资源创建由 TerminalSession 的 persistentKey 路径完成，
 * 再 register 进来。registry 只负责「存取 + DOM 移动 + 回收」，保持与服务层解耦。
 */
export const sidePaneTerminalSessionRegistry = {
    has(key) {
        return sessions.has(key);
    },
    get(key) {
        return sessions.get(key);
    },
    /** TerminalSession persistentKey 路径首次创建资源后，把 entry 存入 registry 常驻。 */
    register(key, entry) {
        sessions.set(key, entry);
    },
    /**
     * 把 entry.hostEl 物理移动到 host 容器（attach）。
     * xterm 的 .xterm DOM 子树随 hostEl 一起移动，term 实例不变；移动后调用方负责 fitAddon.fit() 恢复尺寸。
     */
    attachDom(key, host) {
        const entry = sessions.get(key);
        if (!entry)
            return;
        if (entry.hostEl.parentElement === host)
            return;
        host.appendChild(entry.hostEl);
    },
    /**
     * 把 entry.hostEl 移回 stashDiv（detach）。
     * 组件卸载时调——不 dispose term/PTY/订阅，资源留在 registry 供下次重挂复用。
     */
    detachDom(key) {
        const entry = sessions.get(key);
        if (!entry)
            return;
        const stash = getStashDiv();
        if (!stash)
            return;
        if (entry.hostEl.parentElement === stash)
            return;
        stash.appendChild(entry.hostEl);
    },
    /** 显式关闭 side pane terminal tab 时调：真 dispose（杀 PTY + 销 xterm + 释放订阅）。 */
    release(key) {
        releaseEntry(key);
    },
    /**
     * 批量回收（workspace tab 关闭时按 workspaceKey 过滤）。
     * 对称下侧 Terminal.tsx 的 openWorkspaceKeys 回收逻辑。
     */
    releaseByPredicate(pred) {
        for (const [key, entry] of sessions) {
            if (pred(entry)) {
                releaseEntry(key);
            }
        }
    },
    /** 测试专用：清空所有 session 并移除 stashDiv。 */
    clearForTest() {
        for (const key of Array.from(sessions.keys())) {
            releaseEntry(key);
        }
        sessions.clear();
        if (stashDiv && typeof document !== "undefined") {
            stashDiv.remove();
            stashDiv = null;
        }
    },
};
//# sourceMappingURL=sidePaneTerminalSessionRegistry.js.map