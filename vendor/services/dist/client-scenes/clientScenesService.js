import { readApiJson } from "../providers/api/apiJson.js";
import { ZCODE_CLIENT_SCENES_URL } from "../providers/api/apiEndpoints.js";
export function createClientScenesService(dependencies) {
    return {
        list: () => readApiJson(dependencies.apiClient, ZCODE_CLIENT_SCENES_URL, {
            method: "GET",
        }),
    };
}
//# sourceMappingURL=clientScenesService.js.map