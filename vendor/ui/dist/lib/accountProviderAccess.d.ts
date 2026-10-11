import type { ProviderSettingsView } from "@zcode/services";
import { type ZCodeProviderAccountAccess } from "@zcode/shared";
export interface EntitledAccountProviderAccess {
    readonly providerId: string;
    readonly access: ZCodeProviderAccountAccess;
    readonly label?: string;
}
export declare function resolveEntitledAccountProviderAccess(view: ProviderSettingsView | null | undefined, providerId: string): EntitledAccountProviderAccess | null;
export declare function resolveEntitledAccountProviderAccessFingerprint(view: ProviderSettingsView | null | undefined, providerId: string): string;
/**
 * 套餐只读查询不等于执行模型。pending/未选中的账号仍需展示权益，不能要求 current。
 * 本函数只给余额/订阅查询使用，不得用于模型请求或 ModelSelection completion。
 */
export declare function resolveAccountProviderInspectionAccess(view: ProviderSettingsView | null | undefined, providerId: string): EntitledAccountProviderAccess | null;
//# sourceMappingURL=accountProviderAccess.d.ts.map