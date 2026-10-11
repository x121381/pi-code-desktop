import { create } from "zustand";
import { logger } from "../logger.js";
export const useAlertDialogStore = create((set, get) => ({
    pendingRequest: undefined,
    requestAlert: (payload) => {
        if (get().pendingRequest) {
            logger.warn("[AlertDialogStore] alert already in progress");
            // 并发请求不会复用已有弹窗；返回 false 让破坏性动作（如重启）保持未确认状态。
            return Promise.resolve(false);
        }
        return new Promise((resolve) => {
            set({
                pendingRequest: {
                    ...payload,
                    resolve,
                },
            });
        });
    },
    settleAlert: (confirmed = true) => {
        const pendingRequest = get().pendingRequest;
        if (!pendingRequest) {
            return;
        }
        set({ pendingRequest: undefined });
        pendingRequest.resolve(confirmed);
    },
}));
//# sourceMappingURL=alertDialogStore.js.map