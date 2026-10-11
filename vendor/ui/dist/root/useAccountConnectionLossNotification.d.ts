import type { IServiceAccessor } from "@zcode/services";
/** 根层只观察一次；页面/文案变化不重新建立账号基线。 */
export declare function useAccountConnectionLossNotification(services: IServiceAccessor, intentKey: string, refreshAppSettings?: () => Promise<void>): void;
//# sourceMappingURL=useAccountConnectionLossNotification.d.ts.map