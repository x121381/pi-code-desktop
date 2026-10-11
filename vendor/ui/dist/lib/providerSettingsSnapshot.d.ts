import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
type ProviderSettingsSnapshotListener = () => void;
export type ProviderSettingsState = {
    status: "loading";
} | {
    status: "ready";
    view: ProviderSettingsView;
} | {
    status: "error";
    error: Error;
};
export interface ProviderSettingsSnapshotConnection {
    readonly ready: Promise<void>;
    reload(): Promise<void>;
    dispose(): void;
}
export declare function getProviderSettingsSnapshot(): ProviderSettingsState;
export declare function subscribeProviderSettingsSnapshot(listener: ProviderSettingsSnapshotListener): () => void;
export declare function reloadProviderSettingsSnapshot(): Promise<void>;
export declare function connectProviderSettingsSnapshot(service: IProviderSettingsService): ProviderSettingsSnapshotConnection;
export declare function resetProviderSettingsSnapshotForTest(): void;
export {};
//# sourceMappingURL=providerSettingsSnapshot.d.ts.map