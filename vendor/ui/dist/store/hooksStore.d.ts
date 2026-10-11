import type { Hook, HookConfig } from "@zcode/shared";
import type { IHooksService } from "@zcode/services";
interface HooksStoreState {
    workspacePath: string | null;
    workspaceIdentity: string | null;
    loadedWorkspaceKey: string | null;
    hooks: Hook[];
    loading: boolean;
    error: string | null;
    operatingHookId: string | null;
    initialize: (workspacePath: string | undefined, workspaceIdentity: string | undefined, hooksService: IHooksService) => Promise<void>;
    /**
     * refresh 必须显式传入发起时的 target（path/identity/service 三元组）。
     * 旧签名只传 service，load 时才从 store 读 workspace——Trust 等待期间用户从
     * workspace A 切到 B 会形成「A 的 service + B 的 path/identity」，把 B 的列表
     * 污染成 A 的数据。现在三元组在调用点原子捕获，store 状态只用于漂移守卫。
     */
    refresh: (hooksService: IHooksService, target: {
        workspacePath?: string | null;
        workspaceIdentity?: string | null;
    }) => Promise<void>;
    addHook: (config: HookConfig, hooksService: IHooksService) => Promise<void>;
    updateHook: (id: string, config: HookConfig, hooksService: IHooksService) => Promise<void>;
    deleteHook: (id: string, hooksService: IHooksService) => Promise<void>;
    toggleHook: (id: string, enabled: boolean, hooksService: IHooksService) => Promise<void>;
    importHook: (id: string, hooksService: IHooksService) => Promise<void>;
}
export declare const useHooksStore: import("zustand").UseBoundStore<import("zustand").StoreApi<HooksStoreState>>;
export {};
//# sourceMappingURL=hooksStore.d.ts.map