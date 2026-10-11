import type { ProviderSettingsFormProvider } from "@/lib/providerSettingsFormTypes.js";
import type { ModelConnectivityResult } from "@zcode/shared";
import type { ProviderSettingsView } from "@zcode/services";
import type { ProviderOrderView } from "@/lib/modelProviderOrdering.js";
export declare function useModelProviders(target: {
    workspacePath: string;
    workspaceIdentity?: string;
    /** 本地 Provider Settings 的连通性测试使用的本地 cwd；不复用远程激活路径。 */
    connectivityWorkspacePath?: string;
    /** 远程激活时没有本地 cwd 必须 fail-closed，不能回退到远程 workspacePath。 */
    connectivityWorkspaceRequired?: boolean;
    /** 没有本地 workspace 时展示给用户的本地化错误文案。 */
    connectivityUnavailableMessage?: string;
}): {
    modelProviders: ProviderSettingsFormProvider[];
    providerTemplates: readonly import("@zcode/provider").ProviderSettingsTemplateView[];
    displayOrder: ProviderOrderView;
    reorderableProviderIds: ReadonlySet<string> | undefined;
    loading: boolean;
    loadError: Error | null;
    reload: () => void;
    refreshing: boolean;
    refresh: () => Promise<void>;
    saveProvider: (provider: ProviderSettingsFormProvider) => Promise<ProviderSettingsFormProvider[]>;
    createPersonalProvider: (input?: Parameters<(input?: Parameters<import("@zcode/provider").ProviderSettingsFacade["createPersonalProvider"]>[0]) => Promise<import("@zcode/provider").ProviderSettingsCreationResult>>[0]) => Promise<import("@zcode/provider").ProviderSettingsCreationResult>;
    addPersonalModel: (providerId: string, modelId: string, config: ProviderSettingsFormProvider["models"][number]["personalConfig"], useRecommendedConfig?: boolean) => Promise<ProviderSettingsView>;
    savePersonalModelDraft: (input: Parameters<(input: import("@zcode/provider").SavePersonalModelDraftInput) => Promise<ProviderSettingsView>>[0]) => Promise<ProviderSettingsView>;
    setPersonalModelEnabled: (providerId: string, modelId: string, enabled: boolean) => Promise<ProviderSettingsView>;
    deletePersonalModel: (providerId: string, modelId: string) => Promise<ProviderSettingsView>;
    deleteProvider: (id: string) => Promise<void>;
    reorderProviderModels: (providerId: string, modelIds: readonly string[]) => Promise<void>;
    saveDisplayOrder: (state: ProviderOrderView) => Promise<void>;
    testModelConnectivity: (providerId: string, modelId: string) => Promise<ModelConnectivityResult>;
    providerSettingsView: ProviderSettingsView | null;
};
//# sourceMappingURL=useModelProviders.d.ts.map