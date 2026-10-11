import type { ISettingService } from "../setting/setting.js";
import type { ISettingsSyncService } from "./settingsSync.js";
interface SettingsSyncServiceDependencies {
    settingService: ISettingService;
}
export declare function getSkillDirectorySymlinkType(platform?: NodeJS.Platform | string): "dir" | "junction";
export declare function getCommandFileSymlinkType(): "file";
export declare function createSettingsSyncService(dependencies: SettingsSyncServiceDependencies): ISettingsSyncService;
export {};
//# sourceMappingURL=settingsSyncService.d.ts.map