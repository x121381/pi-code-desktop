import type { AppSettings } from "@zcode/shared";
import type { ISettingService } from "./setting.js";
export interface SettingServiceUpdatedEvent {
    readonly keys: readonly (keyof AppSettings)[];
}
export interface ObservableSettingService extends ISettingService {
    onDidUpdate(listener: (event: SettingServiceUpdatedEvent) => void): () => void;
}
/**
 * 为 Host 内的设置服务增加提交后通知，不扩大 Setting RPC 契约。
 * 底层 update 失败时不会发布事件。
 */
export declare function createObservableSettingService(base: ISettingService): ObservableSettingService;
//# sourceMappingURL=observableSettingService.d.ts.map