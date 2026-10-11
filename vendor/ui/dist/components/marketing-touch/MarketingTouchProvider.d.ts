import type { ReactNode } from "react";
declare const Context: import("react").Context<{
    store: import("zustand").StoreApi<import("@/components/marketing-touch/marketingTouchController.js").MarketingTouchState>;
    refresh: () => Promise<void>;
    showPending: () => Promise<void>;
    clickBanner(): Promise<void>;
    closeBanner(): Promise<void>;
    closeDialog(): Promise<void>;
    dialogAction(action: import("@zcode/shared").MarketingAction): Promise<import("@/components/marketing-touch/marketingTouchController.js").MarketingActionResult | undefined>;
    clearError(): void;
    dispose(): void;
} | null>;
export { Context as MarketingTouchContext };
export declare function MarketingTouchProvider({ children, desktop, }: {
    children: ReactNode;
    desktop: boolean;
}): import("react/jsx-runtime").JSX.Element;
export declare function MarketingBanner(): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=MarketingTouchProvider.d.ts.map