import { downloadZCodeBuiltinRelease } from "@zcode/provider-node";
/** Services 仅注入既有网络装配；URL、预算与 Release 校验由 provider-node 唯一实现。 */
export async function fetchZCodeBuiltinRemoteRelease(options) {
    return downloadZCodeBuiltinRelease({
        endpointOrigin: options.endpointOrigin,
        appVersion: options.appVersion,
        platform: options.platform,
        signal: options.signal,
        request: (url, init) => options.apiClient.request(url, init),
    });
}
//# sourceMappingURL=zcodeBuiltinRemoteConfig.js.map