import { zcodeProtocolMethods, zcodeRuntimeCapabilitiesSchema } from "@zcode/shared";
const checks = new WeakMap();
/** Host 更新不代表远端 CLI 已更新；旧 CLI 会剥掉 Plan 字段，必须在发送前确认执行端。 */
export function ensureIndependentPlanSupport(client) {
    const cached = checks.get(client);
    if (cached)
        return cached;
    const check = client
        .request(zcodeProtocolMethods.runtimeCapabilities, {}, zcodeRuntimeCapabilitiesSchema)
        .then((result) => {
        if (result.independentPlanState !== true)
            throw new Error("proto.independentPlanUnsupported");
    })
        .catch((cause) => {
        checks.delete(client);
        throw new Error("proto.independentPlanUnsupported", { cause });
    });
    checks.set(client, check);
    return check;
}
//# sourceMappingURL=independentPlanSupport.js.map