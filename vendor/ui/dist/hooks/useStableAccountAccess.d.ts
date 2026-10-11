import type { ZCodeAccountAccess, ZCodeProviderAccountAccess } from "@zcode/shared";
type StableAccountAccess = ZCodeProviderAccountAccess | ZCodeAccountAccess;
/** Schema 解析会为同一份 Account Access 生成新对象；hook 依赖必须按配置值稳定。 */
export declare function useStableAccountAccess(accountAccess: StableAccountAccess | null | undefined): StableAccountAccess | undefined;
export {};
//# sourceMappingURL=useStableAccountAccess.d.ts.map