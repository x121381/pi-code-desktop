import { type BuiltinModelProviderId, type OAuthProviderId } from "@zcode/shared";
import { type ModelProviderNavGroup } from "./model-provider-section/constants.js";
import { type SettingsModelProviderTarget } from "@/lib/settingsNavigation.js";
export { fuzzyMatch, handleEndpointSuggestionPopoverOpenAutoFocus, resolveEndpointSuggestionOpenRequest, } from "./model-provider-section/utils.js";
export declare function resolveCodingPlanProviderSyncAttemptKey({ activeOAuthProvider, oauthProviderId, providerId, }: {
    activeOAuthProvider: OAuthProviderId | null;
    oauthProviderId: OAuthProviderId;
    providerId: BuiltinModelProviderId;
}): string | null;
export declare function shouldRetryUnchangedCodingPlanProviderSync({ attemptKey, attemptStatus, modeUnchanged, selectedKeyUnchanged, }: {
    attemptKey: string | null;
    attemptStatus: "inFlight" | "succeeded" | "failed" | undefined;
    modeUnchanged: boolean;
    selectedKeyUnchanged: boolean;
}): boolean;
export declare function resolveModelProviderSideSelectionKey(item: ModelProviderNavGroup["items"][number]): string;
/**
 * 模型 Provider 设置只由 SettingsPage 注入 Local Host；这里不接收 workspaceIdentity，
 * 防止远程 workspace 误将 Provider Settings 的读写路由到远端 Environment。
 */
export declare function ModelProviderSection({ workspacePath, connectivityWorkspacePath, connectivityWorkspaceRequired, pendingModelProviderTarget, onConsumePendingModelProviderTarget, }?: {
    workspacePath?: string;
    connectivityWorkspacePath?: string;
    connectivityWorkspaceRequired?: boolean;
    pendingModelProviderTarget?: SettingsModelProviderTarget;
    onConsumePendingModelProviderTarget?: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ModelProviderSection.d.ts.map