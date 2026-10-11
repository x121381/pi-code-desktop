import { type IClientScenesService } from "@zcode/services";
import { type AutomationTemplateCatalog } from "@/settings/automationTemplateCatalog.js";
export type AutomationTemplateCatalogState = AutomationTemplateCatalog & {
    loading: boolean;
};
export declare function useAutomationTemplates(clientScenesService: IClientScenesService): AutomationTemplateCatalogState;
//# sourceMappingURL=useAutomationTemplates.d.ts.map