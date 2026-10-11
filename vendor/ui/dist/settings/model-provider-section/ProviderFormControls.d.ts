import type { ProviderSettingsFormModel } from "@/lib/providerSettingsFormTypes.js";
import type { ModelConnectivityResult } from "@zcode/shared";
import type { ModelConfigResolution, ProviderConfigObject } from "@zcode/provider";
export declare function ModelRowInput({ model, providerId, providerName, providerEnabled, providerAccess, inputTestId, deleteTestId, onCommit, onResolveDraft, settingsRevision, onDelete, onEnabledChange, onTest, }: {
    model: ProviderSettingsFormModel;
    providerId: string;
    providerName?: string;
    providerEnabled?: boolean;
    providerAccess?: ProviderConfigObject["access"];
    inputTestId?: string;
    deleteTestId?: string;
    onCommit: (model: ProviderSettingsFormModel, basedOnRevision: number) => void | Promise<void>;
    onResolveDraft?: (nextModelId: string, personalConfig: ProviderSettingsFormModel["personalConfig"]) => Promise<ModelConfigResolution>;
    settingsRevision?: number;
    onDelete?: () => void;
    onEnabledChange?: (enabled: boolean) => void;
    onTest?: (model: string) => Promise<ModelConnectivityResult>;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ProviderFormControls.d.ts.map