import type { PendingCommandEntry } from "@/v4/pendingCommandRegistry.js";
export interface PendingCommandRecoveryBannerProps {
    entry: PendingCommandEntry;
    onResend?: () => void;
    onDismiss: () => void;
}
/** 明确被 restart 丢弃的 startNow 输入只提供显式用户决策，组件本身不自动重放。 */
export declare const PendingCommandRecoveryBanner: import("react").MemoExoticComponent<({ entry, onResend, onDismiss, }: PendingCommandRecoveryBannerProps) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=PendingCommandRecoveryBanner.d.ts.map