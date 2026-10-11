import type { EmbeddedBrowserPermissionPromptEvent } from "@zcode/shared";
/**
 * 内置浏览器权限弹窗队列：main 经 IPC 推送请求，用户操作后由组件回传决策并出队。
 * main 侧已做同 origin+权限去重与 10s 超时，这里只负责渲染期排队。
 */
interface EmbeddedBrowserPermissionState {
    prompts: EmbeddedBrowserPermissionPromptEvent[];
    receivePrompt: (event: EmbeddedBrowserPermissionPromptEvent) => void;
    /** 同一 requestId 被 main 超时结算后，renderer 侧同步出队（下一次推送不受影响）。 */
    dropPrompt: (requestId: string) => void;
}
export declare const useEmbeddedBrowserPermissionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<EmbeddedBrowserPermissionState>>;
export {};
//# sourceMappingURL=embeddedBrowserPermissionStore.d.ts.map