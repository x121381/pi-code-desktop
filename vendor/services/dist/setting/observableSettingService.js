/**
 * 为 Host 内的设置服务增加提交后通知，不扩大 Setting RPC 契约。
 * 底层 update 失败时不会发布事件。
 */
export function createObservableSettingService(base) {
    const listeners = new Set();
    return {
        ...base,
        onDidUpdate(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        async update(patch, expectedAccountSettings) {
            if (expectedAccountSettings)
                await base.update(patch, expectedAccountSettings);
            else
                await base.update(patch);
            const keys = Object.freeze(Object.keys(patch));
            if (keys.length === 0)
                return;
            const event = Object.freeze({ keys });
            for (const listener of listeners)
                listener(event);
        },
    };
}
//# sourceMappingURL=observableSettingService.js.map