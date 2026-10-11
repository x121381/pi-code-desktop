import { useEffect } from "react";
import useSWR, { useSWRConfig } from "swr";
import { createClientScenesVisibilityRecovery } from "@/hooks/clientScenesVisibilityRecovery.js";
const CLIENT_SCENES_RESOURCE_KEY = "client-scenes";
export const CLIENT_SCENES_DEDUPING_INTERVAL_MS = 10 * 60 * 1000;
const EMPTY_SCENES = [];
const serviceAuthorityIds = new WeakMap();
let nextServiceAuthorityId = 1;
const visibilityAuthorities = new WeakMap();
let visibilityRecovery = null;
function getServiceAuthorityId(service) {
    const existing = serviceAuthorityIds.get(service);
    if (existing !== undefined)
        return existing;
    const next = nextServiceAuthorityId;
    nextServiceAuthorityId += 1;
    serviceAuthorityIds.set(service, next);
    return next;
}
function getVisibilityAuthority(service, cache) {
    let cacheAuthorities = visibilityAuthorities.get(service);
    if (!cacheAuthorities) {
        cacheAuthorities = new WeakMap();
        visibilityAuthorities.set(service, cacheAuthorities);
    }
    const existing = cacheAuthorities.get(cache);
    if (existing)
        return existing;
    const authority = {};
    cacheAuthorities.set(cache, authority);
    return authority;
}
function getClientScenesVisibilityRecovery() {
    if (typeof document === "undefined")
        return null;
    visibilityRecovery ??= createClientScenesVisibilityRecovery(document);
    return visibilityRecovery;
}
export class ClientScenesBusinessError extends Error {
    code;
    responseMessage;
    constructor(code, responseMessage) {
        super(`Client Scenes returned business error ${code}: ${responseMessage}`);
        this.name = "ClientScenesBusinessError";
        this.code = code;
        this.responseMessage = responseMessage;
    }
}
export function isClientScenesBusinessError(error) {
    return error instanceof ClientScenesBusinessError;
}
export function useClientScenesResource(clientScenesService, options = {}) {
    const enabled = options.enabled ?? true;
    const authorityId = getServiceAuthorityId(clientScenesService);
    const { cache } = useSWRConfig();
    const visibilityAuthority = getVisibilityAuthority(clientScenesService, cache);
    const resource = useSWR(enabled ? [CLIENT_SCENES_RESOURCE_KEY, authorityId] : null, async () => {
        const response = await clientScenesService.list();
        if (response.code !== 0) {
            throw new ClientScenesBusinessError(response.code, response.msg);
        }
        return response.data;
    }, {
        dedupingInterval: CLIENT_SCENES_DEDUPING_INTERVAL_MS,
        focusThrottleInterval: CLIENT_SCENES_DEDUPING_INTERVAL_MS,
        keepPreviousData: false,
        refreshInterval: 0,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        shouldRetryOnError: false,
    });
    useEffect(() => {
        if (!enabled)
            return;
        // macOS 点击关闭只 hide BrowserWindow，renderer 与 SWR 缓存不会销毁；
        // 重新 show 时若仍在去重窗口内，内建 focus revalidate 会继续复用旧 Scene。
        // hidden -> visible 必须绕过去重窗口强制重验，同时按 Service/cache authority 合并并发消费方。
        return getClientScenesVisibilityRecovery()?.subscribe(visibilityAuthority, () => {
            void resource.mutate().catch(() => undefined);
        });
    }, [enabled, resource.mutate, visibilityAuthority]);
    return {
        scenes: resource.data ?? EMPTY_SCENES,
        loading: enabled && resource.data === undefined && resource.isLoading,
        revalidating: resource.isValidating,
        error: resource.error,
        revalidate: resource.mutate,
    };
}
//# sourceMappingURL=useClientScenesResource.js.map