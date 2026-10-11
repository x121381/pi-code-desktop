import type { IServiceAccessor } from "@zcode/services";
import type { IPlatformService } from "@zcode/shared";
import type { Page, UsePluginUiHostInput } from "./pluginUiHostTypes.js";
type Platform = IPlatformService;
type Services = IServiceAccessor;
export declare function createPage(key: string, input: UsePluginUiHostInput, platform: Platform, services: Services): Page;
export {};
//# sourceMappingURL=pluginUiManagedPage.d.ts.map