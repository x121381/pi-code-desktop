import type { CloudDialogHero } from "@/components/cloud-content-dialog/cloudContentDialogTypes.js";
interface MarketingBannerProps {
    src?: string;
    video?: Extract<CloudDialogHero, {
        type: "video";
    }>;
    bundle?: Extract<CloudDialogHero, {
        type: "interactive_bundle";
    }>;
    locale?: string;
    hasAction: boolean;
    hasClose: boolean;
    actionLabel: string;
    closeLabel: string;
    pendingLabel: string;
    pending: boolean;
    onClick: () => void;
    onClose: () => void;
}
export declare function MarketingBannerView(props: MarketingBannerProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MarketingBanner.d.ts.map