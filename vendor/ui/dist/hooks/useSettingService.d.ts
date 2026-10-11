import { type AppSettings } from "@zcode/shared";
/** 获取和更新应用设置 */
export declare function useSettings(): {
    settings: AppSettings | null;
    loading: boolean;
    error: unknown;
    update: (patch: Partial<AppSettings>) => Promise<void>;
    refresh: () => Promise<void>;
};
/** 最近项目列表的便捷 hook */
export declare function useRecentProjects(): {
    recentProjects: string[];
    loading: boolean;
    addProject: (path: string) => Promise<void>;
};
//# sourceMappingURL=useSettingService.d.ts.map