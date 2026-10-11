import { rewardsContextSchema } from "./rewardsEmbedded.js";
/** 此函数经 preload 序列化到网页主世界，不能引用模块外的运行时变量。 */
export function installRewardsPageBridge() {
    // 持久分区可能遗留上次账号；在业务脚本运行前清除，等待本次 App 注入完成。
    const storage = globalThis
        .localStorage;
    for (const key of ["oauth:zai:access_token", "oauth:bigmodel:access_token", "zcodejwttoken"])
        storage.removeItem(key);
    const window = globalThis.window;
    let current = null;
    const listeners = {
        theme: new Set(),
        locale: new Set(),
        auth: new Set(),
    };
    window.addEventListener("zcode-rewards-context", (event) => {
        const next = event.detail;
        if (!next ||
            !["zai-light", "zai-dark"].includes(next.theme) ||
            !["zh-CN", "en-US"].includes(next.locale) ||
            !next.auth ||
            !["ready", "anonymous"].includes(next.auth.status) ||
            ![null, "zai", "bigmodel"].includes(next.auth.provider) ||
            !Number.isSafeInteger(next.auth.revision) ||
            next.auth.revision < 0)
            return;
        const previous = current;
        current = next;
        for (const key of ["theme", "locale", "auth"]) {
            if (JSON.stringify(previous?.[key]) !== JSON.stringify(next[key])) {
                for (const callback of listeners[key])
                    callback(next[key]);
            }
        }
    });
    Object.defineProperty(window, "zcodeBridge", {
        configurable: false,
        writable: false,
        value: {
            // 对象方法不引入 esbuild keepNames 辅助闭包；序列化到主世界后可独立执行。
            getTheme() {
                return current?.theme ?? null;
            },
            getLang() {
                return current?.locale ?? null;
            },
            getAuthState() {
                return current?.auth ?? null;
            },
            onThemeChange(callback) {
                listeners.theme.add(callback);
                return () => listeners.theme.delete(callback);
            },
            onLangChange(callback) {
                listeners.locale.add(callback);
                return () => listeners.locale.delete(callback);
            },
            onAuthChange(callback) {
                listeners.auth.add(callback);
                return () => listeners.auth.delete(callback);
            },
        },
    });
}
export function createRewardsInjectionScript(context, credentials, expectedUrl) {
    const snapshot = rewardsContextSchema.parse(context);
    const values = snapshot.auth.status === "ready"
        ? {
            [`oauth:${snapshot.auth.provider}:access_token`]: credentials.oauth?.trim() || null,
            zcodejwttoken: credentials.jwt?.trim() || null,
        }
        : {};
    return `(() => {
    ${expectedUrl ? `if (window.location.href !== ${JSON.stringify(expectedUrl)}) return;` : ""}
    for (const key of ["oauth:zai:access_token", "oauth:bigmodel:access_token", "zcodejwttoken"]) localStorage.removeItem(key);
    for (const [key, value] of Object.entries(${JSON.stringify(values)})) if (value) localStorage.setItem(key, value);
    window.dispatchEvent(new CustomEvent("zcode-rewards-context", { detail: ${JSON.stringify(snapshot)} }));
  })()`;
}
//# sourceMappingURL=rewardsBridge.js.map