export * from "@zcode/zcode-cua/broker/server";
/** @deprecated 默认 CUA 装配不再使用，仅为旧注入方保留兼容导出。 */
export { CuaAgentAdmissionGate, type CuaAgentSpawnAdmissionContext, } from "./cuaAgentAdmissionGate.js";
export { ICuaPermissionService, isCuaPermissionStatusAvailable, shouldRunCuaScreenCaptureProbe, } from "./cuaPermissionService.js";
export type { CuaPermissionState, CuaPermissionStatus, CuaPermissionStatusUnavailable, CuaPermissionStatusResult, CuaPermissionStatusQueryOptions, CuaPermissionRestartResult, CuaPermissionRestartOptions, } from "./cuaPermissionService.js";
export { BrokerError, actionUnavailable, dispatchRequest, errorResponse, errorResponseFromException, handleRequestLine, elementUnavailable, foregroundRequired, isBrokerMethod, isReadOnlyBrokerMethod, okResponse, notAuthorized, notSelectable, notSettable, parseRequestLine, serializeResponse, callBrokerMethod, BROKER_SOCKET_ENV, BROKER_UNAVAILABLE_ENV, mintBrokerSocketPath, resolveBrokerSocketPath, CuaHelperError, isCuaHelperError, } from "@zcode/zcode-cua/broker";
export type { BrokerErrorCode, BrokerMethod, BrokerRequest, BrokerResponse, CuaHelperErrorCode, NativeAutomationBackend, } from "@zcode/zcode-cua/broker";
export { WindowsCuaHelperHost } from "./windowsCuaDevHelperHost.js";
export type { ManagedCuaProductHelperHost, WindowsCuaChild, WindowsCuaChildProcessAdapter, WindowsCuaHelperHostOptions, } from "./windowsCuaDevHelperHost.js";
export { resolveStandaloneStatusLaunchCandidates } from "./cuaStandaloneStatusLaunch.js";
export { createCuaPipSessionService, } from "./cuaPipSessionService.js";
export { ICuaPipSessionService } from "./cuaPipSession.js";
export type { CuaPipPresentationCredentials, } from "./cuaPipSessionService.js";
export type { CuaPipSessionService } from "./cuaPipSession.js";
//# sourceMappingURL=index.d.ts.map