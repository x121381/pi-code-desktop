import type { AppSettings } from "@zcode/shared";
export interface ISettingService {
    get(): Promise<AppSettings>;
    update(patch: Partial<AppSettings>, expectedAccountSettings?: Pick<AppSettings, "providerFamilyDomain" | "providerFamilyConnectionSelections">): Promise<void>;
    /** Change the data base directory: copy data from old → new location, then persist the setting. */
    updateDataBaseDir(newDir: string | undefined): Promise<void>;
    ensureDefaultProject(homedir: string): Promise<{
        path: string;
        created: boolean;
    }>;
}
export declare const ISettingService: import("../descriptors.js").ServiceDescriptor<ISettingService>;
//# sourceMappingURL=setting.d.ts.map