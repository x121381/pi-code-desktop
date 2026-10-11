import { type ReactNode } from "react";
import { type ProviderSettingsFormProvider, type ProviderSettingsFormModel } from "@/lib/providerSettingsFormTypes.js";
import type { ModelConnectivityResult } from "@zcode/shared";
import { type SavePersonalModelDraftInput } from "@zcode/provider";
export type ProviderNameEditKeyAction = "commit" | "cancel";
export type ProviderDraftCleanupAction = "commit" | "skip-delete";
export declare const PROVIDER_TEXT_INPUT_IDLE_SAVE_MS = 1200;
export declare function shouldApplyProviderSaveCompletion(currentRevision: number, completedRevision: number): boolean;
export declare function resolveProviderDraftCleanupAction({ deleteRequested, }: {
    deleteRequested: boolean;
}): ProviderDraftCleanupAction;
export declare function runProviderDeleteWithDraftCleanupGuard({ deleteRequestedRef, onDelete, }: {
    deleteRequestedRef: {
        current: boolean;
    };
    onDelete?: () => void | Promise<void>;
}): void;
export declare function resolveProviderNameEditKeyAction(event: {
    key: string;
    compositionActive?: boolean;
    isComposing?: boolean;
    nativeEvent?: {
        isComposing?: boolean;
    };
}): ProviderNameEditKeyAction | null;
export declare function InlineEditableProviderCard({ provider, onSave, onAddPersonalModel, onSavePersonalModelDraft, onSetPersonalModelEnabled, onDeletePersonalModel, onDelete, onTestModel, onReorderModelIds, readOnlyEndpoints, presetApiKeyUrl, onOpenPresetApiKey, statusSection, nameEditable, headerVisible, headerActionsVisible, settingsRevision, }: {
    provider: ProviderSettingsFormProvider;
    onSave: (config: ProviderSettingsFormProvider) => void | Promise<void>;
    onAddPersonalModel?: (providerId: string, modelId: string, config: ProviderSettingsFormModel["personalConfig"], useRecommendedConfig?: boolean) => Promise<unknown>;
    onSavePersonalModelDraft?: (input: SavePersonalModelDraftInput) => Promise<unknown>;
    onSetPersonalModelEnabled?: (providerId: string, modelId: string, enabled: boolean) => Promise<unknown>;
    onDeletePersonalModel?: (providerId: string, modelId: string) => Promise<unknown>;
    onDelete?: () => void | Promise<void>;
    onTestModel?: (providerId: string, modelId: string) => Promise<ModelConnectivityResult>;
    onReorderModelIds?: (modelIds: string[]) => Promise<void>;
    readOnlyEndpoints?: boolean;
    presetApiKeyUrl?: string;
    onOpenPresetApiKey?: () => void;
    statusSection?: ReactNode;
    nameEditable?: boolean;
    headerVisible?: boolean;
    headerActionsVisible?: boolean;
    settingsRevision?: number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=InlineEditableProviderCard.d.ts.map