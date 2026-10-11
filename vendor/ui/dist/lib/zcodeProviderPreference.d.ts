import { type ZCodeProvider } from "@zcode/shared";
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
export declare const LAST_SELECTED_AGENT_PROVIDER_STORAGE_KEY = "zcode-last-agent-provider";
export declare function readLastSelectedAgentProvider(storage?: StorageLike | null): ZCodeProvider | null;
export declare function persistLastSelectedAgentProvider(provider: ZCodeProvider, storage?: StorageLike | null): void;
export {};
//# sourceMappingURL=zcodeProviderPreference.d.ts.map