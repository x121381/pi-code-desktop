import { create } from "zustand";
import { logger } from "../logger.js";
export const useConfirmDialogStore = create((set, get) => ({
    pendingRequest: undefined,
    requestConfirmation: async (payload) => (await get().requestChoice(payload)) === "confirm",
    requestChoice: (payload) => {
        if (get().pendingRequest) {
            logger.warn("[ConfirmDialogStore] confirmation already in progress");
            return Promise.resolve("dismiss");
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
    settleConfirmation: (confirmed) => get().settleChoice(confirmed ? "confirm" : "cancel"),
    settleChoice: (choice) => {
        const pendingRequest = get().pendingRequest;
        if (!pendingRequest) {
            return;
        }
        set({ pendingRequest: undefined });
        pendingRequest.resolve(choice);
    },
}));
//# sourceMappingURL=confirmDialogStore.js.map