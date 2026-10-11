import { logger } from "@/logger.js";
function storageKey(sessionId, dismissKey) {
    return `${sessionId}\u0000${dismissKey}`;
}
/** Renderer 生命周期内的 session-scoped dismissal；不持久化、不跨客户端同步。 */
export function createSessionQuotaBannerDismissalStore(maxEntries = 256) {
    const capacity = Math.max(1, Math.trunc(maxEntries));
    const entries = new Map();
    const listeners = new Set();
    let version = 0;
    const emit = () => {
        version += 1;
        for (const listener of listeners)
            listener();
    };
    return {
        dismiss(sessionId, dismissKey) {
            const normalizedSessionId = sessionId.trim();
            if (!normalizedSessionId || !dismissKey)
                return;
            const key = storageKey(normalizedSessionId, dismissKey);
            if (entries.has(key))
                return;
            entries.set(key, true);
            while (entries.size > capacity) {
                const oldest = entries.keys().next();
                if (oldest.done)
                    break;
                entries.delete(oldest.value);
            }
            logger.debug("session quota banner dismissed", {
                dismissKey,
                sessionId: normalizedSessionId,
            });
            emit();
        },
        getSnapshot: () => version,
        isDismissed(sessionId, dismissKey) {
            const normalizedSessionId = sessionId.trim();
            return Boolean(normalizedSessionId &&
                dismissKey &&
                entries.has(storageKey(normalizedSessionId, dismissKey)));
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
    };
}
export const sessionQuotaBannerDismissalStore = createSessionQuotaBannerDismissalStore();
//# sourceMappingURL=sessionQuotaBannerDismissalStore.js.map