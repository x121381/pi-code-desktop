import { type ApiClient } from "@zcode/shared";
import type { IClientConfigService } from "./clientConfig.js";
interface RequestContext {
    endpointOrigin: string;
    appVersion: string;
    platform: string;
}
/** 首期仅公开配置；账户灰度不得通过此实例或缓存复用。 */
export declare function createClientConfigService(dependencies: {
    apiClient: ApiClient;
    resolveRequestContext: () => RequestContext | Promise<RequestContext>;
}): IClientConfigService;
export {};
//# sourceMappingURL=clientConfigService.d.ts.map