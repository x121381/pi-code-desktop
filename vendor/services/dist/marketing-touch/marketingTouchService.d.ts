import { parseMarketingTouchResponse, type ApiClient } from "@zcode/shared";
import type { IMarketingTouchService } from "#src/marketing-touch/marketingTouch.js";
export declare function createMarketingTouchService(options: {
    apiClient: ApiClient;
    getToken: () => Promise<string | null | undefined>;
    getDeviceMid: () => string | undefined;
    baseUrl: string;
    appVersion: string;
    onSnapshot?: (snapshot: ReturnType<typeof parseMarketingTouchResponse>) => void;
}): IMarketingTouchService;
//# sourceMappingURL=marketingTouchService.d.ts.map