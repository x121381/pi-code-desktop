import type { ZCodePermissionOption } from "@zcode/shared";
export { getPermissionRequestPreview, type PermissionRequestFileChange, type PermissionRequestPreview, type PermissionRequestScope, } from "@zcode/shared";
type PermissionOptionDisplayKind = "allowOnce" | "allowAlways" | "rejectOnce" | "rejectAlways" | "custom";
export declare function getPermissionOptionDisplayKind(kind: string): PermissionOptionDisplayKind;
export declare function shouldPreferPermissionOptionName(option: Pick<ZCodePermissionOption, "kind" | "name">): boolean;
export declare function sortPermissionOptions(options: readonly ZCodePermissionOption[]): ZCodePermissionOption[];
//# sourceMappingURL=permissionRequest.d.ts.map