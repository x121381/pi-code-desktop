import type { Hook } from "@zcode/shared";
/** 与 HooksList 行内 Trust 按钮保持同一判定，避免风险提示形成第二套审核状态。 */
export declare function requiresWorkspaceHookTrust(hook: Hook): boolean;
export declare function hasWorkspaceHooksRequiringReview(hooks: readonly Hook[]): boolean;
export declare function shouldShowWorkspaceHookTrustNotice({ hooks, loadedWorkspaceKey, rpcReady, targetWorkspaceKey, }: {
    hooks: readonly Hook[];
    loadedWorkspaceKey: string | null;
    rpcReady: boolean;
    targetWorkspaceKey: string | null;
}): boolean;
/** 仅展示当前 scope 的风险说明；审核、导航与开关交互仍由既有组件负责。 */
export declare function WorkspaceHookTrustNotice({ hooks }: {
    hooks: readonly Hook[];
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkspaceHookTrustNotice.d.ts.map