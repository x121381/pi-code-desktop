import type { AppSettings } from "@zcode/shared";
import type { ISettingService } from "@zcode/services";
import { type TabStoreState } from "../store/tabStore.js";
export interface TabPersistenceRestoreLifecycle {
    settingService?: ISettingService;
    restoreSession: boolean;
    completed: boolean;
    fullyCompleted: boolean;
}
export interface TabPersistenceRestoreResult {
    /** 恢复期间识别出的 app-owned 路径，不得回填为最近项目。 */
    excludedRecentProjectPaths?: readonly string[];
    /** active workspace 已恢复后，在首帧后的 idle period 补齐 inactive workspace。 */
    deferredRestore?: () => void;
}
export declare function hasCompletedTabPersistenceInitialRestore({ settingService, restoreSession, restoreLifecycle, }: {
    settingService?: ISettingService;
    restoreSession: boolean;
    restoreLifecycle: TabPersistenceRestoreLifecycle;
}): boolean;
export declare function getRecentProjectPathsFromSettings(settings: Pick<AppSettings, "lastWorkspaceSession">, excludedPaths?: readonly string[]): string[];
export declare function buildRestoredRecentProjectPaths(settings: Pick<AppSettings, "lastWorkspaceSession" | "recentProjects">, excludedPaths?: readonly string[]): string[];
export declare function useTabPersistence({ settingService, restoreSession, persistSession, restorePersistedSession, buildPersistPatch, }: {
    settingService?: ISettingService;
    /** 是否恢复上次会话，首个窗口 true，新窗口 false */
    restoreSession?: boolean;
    /** 是否把当前窗口会话写回全局设置，首个窗口 true，新窗口 false */
    persistSession?: boolean;
    /** 自定义恢复流程；不传则回退到默认的本地 tab 恢复逻辑 */
    restorePersistedSession?: (settings: AppSettings) => Promise<TabPersistenceRestoreResult | void> | TabPersistenceRestoreResult | void;
    /** 自定义持久化补丁；不传则只写回本地 workspace 会话 */
    buildPersistPatch?: (state: TabStoreState) => Partial<AppSettings>;
}): {
    isRestoring: boolean;
    hasCompletedInitialRestore: boolean;
    hasCompletedFullRestore: boolean;
};
//# sourceMappingURL=useTabPersistence.d.ts.map