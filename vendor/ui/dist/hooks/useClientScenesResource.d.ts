import type { ClientSceneConfig, IClientScenesService } from "@zcode/services";
export declare const CLIENT_SCENES_DEDUPING_INTERVAL_MS: number;
export declare class ClientScenesBusinessError extends Error {
    readonly code: number;
    readonly responseMessage: string;
    constructor(code: number, responseMessage: string);
}
export declare function isClientScenesBusinessError(error: unknown): error is ClientScenesBusinessError;
interface UseClientScenesResourceOptions {
    enabled?: boolean;
}
export declare function useClientScenesResource(clientScenesService: IClientScenesService, options?: UseClientScenesResourceOptions): {
    scenes: ClientSceneConfig[];
    loading: boolean;
    revalidating: boolean;
    error: Error | undefined;
    revalidate: import("swr").KeyedMutator<ClientSceneConfig[]>;
};
export {};
//# sourceMappingURL=useClientScenesResource.d.ts.map