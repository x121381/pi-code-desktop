import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CircleAlert } from "lucide-react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
/** 与 HooksList 行内 Trust 按钮保持同一判定，避免风险提示形成第二套审核状态。 */
export function requiresWorkspaceHookTrust(hook) {
    return Boolean(hook.workspaceHook) && hook.workspaceHook?.trustState !== "trusted_persistent";
}
export function hasWorkspaceHooksRequiringReview(hooks) {
    return hooks.some(requiresWorkspaceHookTrust);
}
export function shouldShowWorkspaceHookTrustNotice({ hooks, loadedWorkspaceKey, rpcReady, targetWorkspaceKey, }) {
    // hooksStore 是单例，切换 workspace 后连接阶段仍可能保留上一个
    // workspace 的 hooks。只有当前 target 已就绪且快照 key 对得上时才允许显示安全提示，
    // 避免把 A 的风险归因到正在连接的 B。
    return (rpcReady &&
        targetWorkspaceKey !== null &&
        loadedWorkspaceKey === targetWorkspaceKey &&
        hasWorkspaceHooksRequiringReview(hooks));
}
/** 仅展示当前 scope 的风险说明；审核、导航与开关交互仍由既有组件负责。 */
export function WorkspaceHookTrustNotice({ hooks }) {
    const { intl } = useZCodeIntl();
    if (!hasWorkspaceHooksRequiringReview(hooks))
        return null;
    return (_jsxs("div", { role: "note", "data-testid": "workspace-hook-trust-notice", className: "flex w-full items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-ui-base text-foreground", children: [_jsx(CircleAlert, { className: "mt-0.5 size-4 shrink-0 text-warning", "aria-hidden": "true" }), _jsx("p", { className: "min-w-0", children: intl.formatMessage({ id: "settings.hooks.review.notice" }) })] }));
}
//# sourceMappingURL=WorkspaceHookTrustNotice.js.map