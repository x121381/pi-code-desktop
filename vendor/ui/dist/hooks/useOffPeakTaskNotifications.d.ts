import type { IPlatformService } from "@zcode/shared";
import type { IOffPeakTaskService } from "@zcode/services";
import type { IntlInstance } from "@/i18n/index.js";
export declare function useOffPeakTaskNotifications(params: {
    offPeakTaskService: IOffPeakTaskService;
    platform: Pick<IPlatformService, "showTaskNotification"> | null | undefined;
    enabled: boolean;
    formatMessage: IntlInstance["formatMessage"];
}): void;
//# sourceMappingURL=useOffPeakTaskNotifications.d.ts.map