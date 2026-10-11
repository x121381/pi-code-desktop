import { type ApiClient } from "@zcode/shared";
export declare class AccountProviderApiClient {
    readonly apiClient: ApiClient;
    constructor(apiClient: ApiClient);
    fetchRemoteData<T>(url: string, init: RequestInit): Promise<T | null>;
}
//# sourceMappingURL=accountProviderApiClient.d.ts.map