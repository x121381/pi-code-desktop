import { create } from "zustand";
export const useEmbeddedBrowserPermissionStore = create((set) => ({
    prompts: [],
    // 同 requestId 的推送是列表热更新（蓝牙扫描/USB 枚举连续 fire），替换而非追加。
    receivePrompt: (event) => set((state) => ({
        prompts: state.prompts.some((prompt) => prompt.requestId === event.requestId)
            ? state.prompts.map((prompt) => (prompt.requestId === event.requestId ? event : prompt))
            : [...state.prompts, event],
    })),
    dropPrompt: (requestId) => set((state) => ({ prompts: state.prompts.filter((prompt) => prompt.requestId !== requestId) })),
}));
//# sourceMappingURL=embeddedBrowserPermissionStore.js.map