"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebRemoteControlVersionGuard = createWebRemoteControlVersionGuard;
/** 只管理当前手机连接的版本校验；资源路由由服务端处理。 */
function createWebRemoteControlVersionGuard(options) {
    let generation = 0;
    let disposed = false;
    let pendingUrl;
    let navigated = false;
    let inFlight;
    const confirm = () => {
        if (disposed || navigated || !pendingUrl)
            return;
        navigated = true;
        options.navigate(pendingUrl);
    };
    const invalidate = () => {
        generation += 1;
        inFlight = undefined;
    };
    return {
        isBlocked: () => pendingUrl !== undefined,
        confirm,
        invalidate,
        dispose() {
            disposed = true;
            invalidate();
        },
        check() {
            if (disposed || pendingUrl)
                return Promise.resolve(undefined);
            if (inFlight)
                return inFlight;
            const requestGeneration = generation;
            const request = Promise.resolve()
                .then(() => options.requestBootstrap())
                .then((result) => {
                // 重连可能让旧响应晚于新连接返回，不能用旧桌面的版本导航或初始化业务。
                if (disposed || requestGeneration !== generation)
                    return undefined;
                const version = result.desktopAppVersion?.trim();
                if (!version)
                    return result;
                const url = new URL(options.getUrl());
                if (url.pathname.replace(/\/+$/, "") !== "/remote/v4")
                    return result;
                if (url.searchParams.get("app_version") === version)
                    return result;
                url.searchParams.set("app_version", version);
                pendingUrl = url.toString();
                if (options.isPageReady())
                    options.onMismatch(version);
                else
                    confirm();
                return undefined;
            })
                .catch((error) => {
                if (disposed || requestGeneration !== generation)
                    return undefined;
                throw error;
            })
                .finally(() => {
                if (inFlight === request)
                    inFlight = undefined;
            });
            inFlight = request;
            return request;
        },
    };
}
//# sourceMappingURL=webRemoteControlVersion.js.map