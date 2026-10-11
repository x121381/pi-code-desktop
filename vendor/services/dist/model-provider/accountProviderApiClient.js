import {} from "@zcode/shared";
import { readApiJson } from "../providers/api/apiJson.js";
function isSuccessfulRemoteCode(code) {
    if (code === null || code === undefined) {
        return true;
    }
    if (typeof code === "number") {
        return code === 0 || code === 200;
    }
    if (typeof code === "string") {
        return code === "0" || code === "200";
    }
    return false;
}
export class AccountProviderApiClient {
    apiClient;
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    async fetchRemoteData(url, init) {
        const payload = await readApiJson(this.apiClient, url, init);
        // BigModel 部分业务接口成功时返回 code=200，而不是 code=0。
        if (!isSuccessfulRemoteCode(payload.code)) {
            return null;
        }
        return payload.data ?? null;
    }
}
//# sourceMappingURL=accountProviderApiClient.js.map