import type { IServiceAccessor } from "@zcode/services";
import type { ProviderFamilyConnectionSelection } from "@zcode/shared";
import type { AccountConnectionLoss } from "@/root/accountConnectionRefreshObserver.js";
/** 只计算建议，不替用户保存；闭包固定按钮展示的那个目标，点击时重新校验。 */
export declare function prepareAccountConnectionSwitch(services: IServiceAccessor, event: AccountConnectionLoss): Promise<{
    selection: ProviderFamilyConnectionSelection;
    label: string | undefined;
    apply(): Promise<"switched" | "stale">;
} | null>;
//# sourceMappingURL=accountConnectionLossSuggestion.d.ts.map