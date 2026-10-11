import type { IProviderSettingsService, ProviderSettingsView } from "@zcode/services";
import { type ProviderSettingsState } from "@/lib/providerSettingsSnapshot.js";
export interface ProviderSettingsRead {
    state: ProviderSettingsState;
    reload(): void;
}
export interface ProviderSettingsServiceRead extends ProviderSettingsRead {
    /** 提交 mutation 返回的权威 View；不依赖异步 onDidChange 事件才能收敛 UI。 */
    commit(view: ProviderSettingsView): void;
}
export declare function useProviderSettingsView(): ProviderSettingsRead;
/** Settings 编辑器按当前 ServiceProvider 读取目标 Environment，并显式暴露失败与重试。 */
export declare function useProviderSettingsServiceView(service: IProviderSettingsService): ProviderSettingsServiceRead;
//# sourceMappingURL=useProviderSettingsView.d.ts.map