import { fork as nodeFork } from "node:child_process";
import { mintBrokerSocketPath, probeHelperHealth, } from "@zcode/zcode-cua/broker";
// Contract constants are single-sourced from the producer package: locally re-declared literals here had drifted risk — a rename in the
// producer would silently orphan these. Kept as aliases for existing callers.
import { HELPER_ADDON_ENV, WINDOWS_DEV_CONTROL_PROTOCOL } from "@zcode/zcode-cua/broker/server";
export const CONTROL_PROTOCOL = WINDOWS_DEV_CONTROL_PROTOCOL;
export const ADDON_ENV = HELPER_ADDON_ENV;
export const defaultChildProcess = {
    fork(command, argv, options) {
        const [entryPath, ...args] = argv;
        if (!entryPath)
            throw new Error("Windows Computer Use Helper entry path is required");
        return nodeFork(entryPath, args, { ...options, execPath: command });
    },
};
export const defaultSocketPathFactory = mintBrokerSocketPath;
export const defaultHealthProbe = (socketPath, timeoutMs) => probeHelperHealth(socketPath, { timeoutMs });
export class WindowsCuaChildLifecycle {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    async terminate(generation, context, timeoutMs) {
        if (generation.exitObserved) {
            generation.removeMainListeners();
            return;
        }
        // 先挂 wait listener 再发送 shutdown/kill，避免进程在 signal 的同一同步轮次退出而漏观测。
        const firstExit = this.waitForExit(generation, "first-wait", timeoutMs);
        this.sendShutdown(generation, context);
        if (await firstExit) {
            generation.removeMainListeners();
            return;
        }
        const secondExit = this.waitForExit(generation, "second-wait", timeoutMs);
        this.kill(generation, context);
        if (await secondExit) {
            generation.removeMainListeners();
            return;
        }
        const blocker = new Error("Windows Computer Use Helper termination blocker: child did not exit after kill");
        this.logFailure(generation.id, generation.child.pid, `${context}-termination-blocker`, blocker);
        throw blocker;
    }
    sendShutdown(generation, context) {
        try {
            generation.child.send({ protocol: CONTROL_PROTOCOL, type: "shutdown" });
        }
        catch (error) {
            this.logFailure(generation.id, generation.child.pid, `${context}-send`, error);
        }
    }
    kill(generation, context) {
        try {
            generation.child.kill();
        }
        catch (error) {
            this.logFailure(generation.id, generation.child.pid, `${context}-kill`, error);
        }
    }
    on(child, event, listener, generation, errorClass) {
        try {
            child.on(event, listener);
            return true;
        }
        catch (error) {
            this.logFailure(generation, child.pid, errorClass, error);
            return false;
        }
    }
    off(child, event, listener, generation, errorClass) {
        try {
            child.off(event, listener);
        }
        catch (error) {
            this.logFailure(generation, child.pid, errorClass, error);
        }
    }
    logFailure(generation, pid, errorClass, error) {
        this.logger.warn(undefined, "Windows Computer Use Helper lifecycle failure", {
            generation,
            pid,
            errorClass,
            error: error instanceof Error ? error.name : typeof error,
        });
    }
    waitForExit(generation, errorClass, timeoutMs) {
        if (generation.exitObserved)
            return Promise.resolve(true);
        return new Promise((resolve) => {
            let done = false;
            const finish = (exited) => {
                if (done)
                    return;
                done = true;
                clearTimeout(timer);
                this.off(generation.child, "exit", onExit, generation.id, `${errorClass}-off`);
                resolve(exited);
            };
            const onExit = () => {
                generation.exitObserved = true;
                finish(true);
            };
            const timer = setTimeout(() => finish(false), timeoutMs);
            timer.unref?.();
            if (!this.on(generation.child, "exit", onExit, generation.id, `${errorClass}-on`))
                finish(false);
            // send() 后、临时 listener 注册前 child 可能已经触发主 exit listener；再次读取
            // generation 事实，避免把已退出 H1 错当成超时并留下不存在的 termination blocker。
            else if (generation.exitObserved)
                finish(true);
        });
    }
}
/**
 * Parse a `zcode-cua-windows-dev/v1` control message from the helper child.
 *
 * "transport_ready" means the named pipe is bound and authenticated, while
 * "ready" remains the full health handshake. "error" is the helper's OWN startup-failure
 * report (windowsDevHelperMain.ts sends `{protocol, type:"error", message}`
 * before exiting 1/2) — previously this fell through to null and the host
 * misclassified it as "Invalid Windows Computer Use Helper control message"
 * (malformed-message), discarding the diagnostic string.
 * Any future additive message type parses as "ignore" (forward-compatible)
 * instead of failing the generation.
 */
export function parseReadyMessage(message) {
    if (!message || typeof message !== "object")
        return null;
    const value = message;
    if (value.protocol !== CONTROL_PROTOCOL)
        return "ignore";
    if (value.type === "error") {
        if (typeof value.message !== "string" || value.message.length === 0) {
            return null;
        }
        return { protocol: CONTROL_PROTOCOL, type: "error", message: value.message };
    }
    if (value.type !== "ready" && value.type !== "transport_ready")
        return "ignore";
    if (typeof value.socketPath !== "string" ||
        !value.socketPath ||
        !Number.isInteger(value.pid) ||
        value.pid <= 0)
        return null;
    return {
        protocol: CONTROL_PROTOCOL,
        type: value.type,
        socketPath: value.socketPath,
        pid: value.pid,
    };
}
export function isExactHealthPid(health, childPid) {
    return Number.isInteger(health.pid) && health.pid > 0 && health.pid === childPid;
}
export function asError(error) {
    return error instanceof Error ? error : new Error(String(error));
}
//# sourceMappingURL=windowsCuaHelperHostSupport.js.map