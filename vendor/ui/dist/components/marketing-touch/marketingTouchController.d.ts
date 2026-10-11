import type { IMarketingTouchService } from "@zcode/services";
import type { MarketingAction, MarketingDelivery } from "@zcode/shared";
import type { CloudDialogHero } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
import type { PreparedMarketingHero } from "@/components/marketing-touch/marketingResources.js";
export interface PreparedMarketingDelivery {
    delivery: MarketingDelivery;
    image?: string;
    darkImage?: string;
    bannerHero?: Extract<CloudDialogHero, {
        type: "interactive_bundle" | "video";
    }>;
    hero: CloudDialogHero | null;
    success?: Promise<PreparedMarketingHero>;
    release: () => Promise<void>;
}
type Candidate = PreparedMarketingDelivery & {
    scope: string;
};
export interface MarketingTouchState {
    banner: Candidate | null;
    dialog: (Candidate & {
        result: boolean;
    }) | null;
    pending: boolean;
    phase: "idle" | "verifying" | "submitting" | "preparing";
    error: string | null;
    errorAction: MarketingAction["type"] | null;
}
export type MarketingActionResult = {
    status: "success" | "cancelled" | "failure" | "uncertain";
    message?: string;
    terminal?: boolean;
};
type RenderableBannerCandidate = Candidate & {
    delivery: Extract<MarketingDelivery, {
        resource_position: "banner";
    }>;
};
export declare function isMarketingBannerRenderable(banner: Candidate | null): banner is RenderableBannerCandidate;
export declare function createMarketingTouchController(options: {
    query: () => ReturnType<IMarketingTouchService["query"]>;
    report: IMarketingTouchService["report"];
    prepare: (delivery: MarketingDelivery) => Promise<PreparedMarketingDelivery>;
    execute: (action: MarketingAction, signal: AbortSignal, phase: (phase: MarketingTouchState["phase"]) => void) => Promise<MarketingActionResult>;
    locale: "zh-CN" | "en-US";
    canOpen: () => boolean;
    refresh: () => void;
}): {
    store: import("zustand/vanilla").StoreApi<MarketingTouchState>;
    refresh: () => Promise<void>;
    showPending: () => Promise<void>;
    clickBanner(): Promise<void>;
    closeBanner(): Promise<void>;
    closeDialog(): Promise<void>;
    dialogAction(action: MarketingAction): Promise<MarketingActionResult | undefined>;
    clearError(): void;
    dispose(): void;
};
export type MarketingTouchController = ReturnType<typeof createMarketingTouchController>;
export {};
//# sourceMappingURL=marketingTouchController.d.ts.map