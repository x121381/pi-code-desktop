import type { IBroadcastService } from "./broadcast.js";
/**
 * 广播服务 Node 实现 —— 运行在 host process 中
 *
 * send() 时：
 *   1. 触发本地 emitter（本窗口的 Renderer 通过 RPC event 收到）
 *   2. 通过 parentPort 发给 main 进程（由 BroadcastHub 中转给其他窗口）
 *
 * 收到 main 转发的广播时：
 *   触发本地 emitter → Renderer 通过 RPC event 收到
 *
 * @param parentPort - Electron host process 的 parentPort（Electron.ParentPort）
 *                     传 null 表示无跨窗口能力（如 web server 模式）
 */
export declare function createBroadcastService(parentPort: {
    postMessage(message: unknown): void;
    on(event: "message", listener: (e: {
        data: unknown;
    }) => void): void;
} | null): IBroadcastService;
//# sourceMappingURL=broadcastService.d.ts.map