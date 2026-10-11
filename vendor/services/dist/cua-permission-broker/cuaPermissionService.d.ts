import type { CuaPermissionState, CuaPermissionStatus, CuaPermissionStatusUnavailable, CuaPermissionStatusResult, CuaPermissionStatusQueryOptions, CuaPermissionRestartResult, CuaPermissionRestartOptions, ICuaPermissionService as BrokerICuaPermissionService } from "@zcode/zcode-cua/broker";
export type { CuaPermissionState, CuaPermissionStatus, CuaPermissionStatusUnavailable, CuaPermissionStatusResult, CuaPermissionStatusQueryOptions, CuaPermissionRestartResult, CuaPermissionRestartOptions, };
export { isCuaPermissionStatusAvailable, shouldRunCuaScreenCaptureProbe, } from "@zcode/zcode-cua/broker/ports";
export interface ICuaPermissionService extends BrokerICuaPermissionService {
}
export declare const ICuaPermissionService: import("../descriptors.js").ServiceDescriptor<BrokerICuaPermissionService>;
//# sourceMappingURL=cuaPermissionService.d.ts.map