import { create } from "zustand";
import { shouldExposeE2EStoreBridge } from "../lib/e2eStoreBridge.js";
/**
 * renderer 内存态：File/object URL 不落盘，但 task/composer 切换或局部卸载不会丢失。
 * 上传控制器仍由发起该 operation 的 hook 闭包持有，relay/main 不保存业务状态。
 */
export const useComposerAttachmentUploadStore = create()(() => ({ scopes: {} }));
if (shouldExposeE2EStoreBridge()) {
    // E2E 只暴露当前唯一附件 owner，供 scope 切换用例准备状态；不再把附件塞回旧 Session Store。
    window.__zcodeComposerAttachmentUploadStoreE2E = useComposerAttachmentUploadStore;
}
export function exposeComposerAttachmentScopeKeyForE2E(scopeKey) {
    if (window.__zcodeComposerAttachmentUploadStoreE2E) {
        window.__zcodeCurrentComposerAttachmentScopeKeyE2E = scopeKey;
    }
}
export function readComposerAttachmentScope(scopeKey) {
    return useComposerAttachmentUploadStore.getState().scopes[scopeKey] ?? [];
}
export function updateComposerAttachmentScope(scopeKey, update) {
    useComposerAttachmentUploadStore.setState((state) => {
        const next = update(state.scopes[scopeKey] ?? []);
        if (next.length === 0) {
            const { [scopeKey]: _removed, ...remainingScopes } = state.scopes;
            return { scopes: remainingScopes };
        }
        return {
            scopes: {
                ...state.scopes,
                [scopeKey]: next,
            },
        };
    });
}
//# sourceMappingURL=composerAttachmentUploadStore.js.map