import { type MarketingPopup } from "@zcode/shared";
import type { CloudContentDialogPayload, CloudDialogHero } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
export declare function canOpenMarketingPopup(): boolean;
export declare function marketingLabel(text: MarketingPopup["title"]): string;
export declare function adaptMarketingPopup(id: string, locale: "zh-CN" | "en-US", popup: MarketingPopup, hero: CloudDialogHero | null, viewPlanLabel?: string): CloudContentDialogPayload;
//# sourceMappingURL=marketingPopupAdapter.d.ts.map